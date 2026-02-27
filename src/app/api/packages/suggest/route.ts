import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mbaEngine } from '@/lib/mba/engine';
import type { MBAItem } from '@/lib/mba/engine';
import { generateTravelPackage } from '@/services/mystralService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function collectContextItems(
  names: string[],
  seen: Set<string>,
  out: MBAItem[]
): void {
  for (const name of names) {
    const v = name?.trim();
    if (!v || seen.has(v.toLowerCase())) continue;
    const item = mbaEngine.getItemByIdOrName(v);
    if (item && !seen.has(item.id)) {
      seen.add(item.id);
      seen.add(v.toLowerCase());
      out.push(item);
    }
  }
}

/** Build MBA context and return first bundle summary + optional rule metrics for LLM. */
function getMbaSummaryAndRule(
  profile: { activities_liked?: unknown; food_preferences?: unknown; bucket_list?: unknown } | null,
  visited: { destination_name: string }[],
  tripDestination?: string
): { summary: string | null; rule: { support: number; confidence: number; lift: number } | null } {
  const contextItems: MBAItem[] = [];
  const seen = new Set<string>();

  if (tripDestination) {
    const destItem = mbaEngine.getItemByIdOrName(tripDestination);
    if (destItem) {
      contextItems.push(destItem);
      seen.add(destItem.id);
    }
  }
  if (profile) {
    const activities = Array.isArray(profile.activities_liked) ? profile.activities_liked.filter((x): x is string => typeof x === 'string') : [];
    const food = Array.isArray(profile.food_preferences) ? profile.food_preferences.filter((x): x is string => typeof x === 'string') : [];
    const bucket = Array.isArray(profile.bucket_list) ? profile.bucket_list.filter((x): x is string => typeof x === 'string') : [];
    collectContextItems(bucket, seen, contextItems);
    collectContextItems(activities, seen, contextItems);
    collectContextItems(food, seen, contextItems);
  }
  collectContextItems(visited.map((v) => v.destination_name), seen, contextItems);

  let bundleArrays = mbaEngine.getBundleRecommendations(contextItems);
  if (bundleArrays.length === 0) {
    const topRules = mbaEngine.getTopRules(3);
    bundleArrays = topRules
      .slice(0, 1)
      .map((r) => [...r.antecedent, ...r.consequent])
      .filter((items) => items.length > 0);
  }
  if (bundleArrays.length === 0) return { summary: null, rule: null };
  const first = bundleArrays[0];
  const names = first.map((i) => i.name).join(', ');
  const matchingRule = mbaEngine.getBestMatchingRule(first);
  const summary = `${names} (market basket analysis)`;
  const rule = matchingRule
    ? { support: matchingRule.support, confidence: matchingRule.confidence, lift: matchingRule.lift }
    : null;
  return { summary, rule };
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const tripInfo = (body?.tripInfo ?? {}) as {
      destination?: string;
      travelStyle?: string;
      budget?: string;
      duration_days?: number;
    };

    const [profileRes, visitedRes, packagesRes] = await Promise.all([
      supabase.from('profiles').select('activities_liked, food_preferences, bucket_list, travel_style, budget_preference').eq('id', user.id).single(),
      supabase.from('visited_destinations').select('destination_name').eq('user_id', user.id),
      supabase.from('suggested_packages').select('destination').eq('user_id', user.id),
    ]);

    const profile = profileRes?.data as {
      activities_liked?: unknown;
      food_preferences?: unknown;
      bucket_list?: unknown;
      travel_style?: string | null;
      budget_preference?: string | null;
    } | null;
    const visited = (visitedRes?.data ?? []) as { destination_name: string }[];
    const visitedNames = visited.map((v) => v.destination_name).filter(Boolean);
    const existingPackages = (packagesRes?.data ?? []) as { destination: string }[];

    const activitiesLiked = Array.isArray(profile?.activities_liked) ? (profile.activities_liked as unknown[]).filter((x): x is string => typeof x === 'string') : [];
    const foodPrefs = Array.isArray(profile?.food_preferences) ? (profile.food_preferences as unknown[]).filter((x): x is string => typeof x === 'string') : [];
    const bucketList = Array.isArray(profile?.bucket_list) ? (profile.bucket_list as unknown[]).filter((x): x is string => typeof x === 'string') : [];

    // Normalize destination for matching (LLM may return "Tokyo, Japan" vs bucket "tokyo")
    const normalizeDest = (d: string) => d.toLowerCase().trim().split(',')[0].trim();
    const destCounts = new Map<string, number>();
    for (const row of existingPackages) {
      const key = normalizeDest(row.destination);
      destCounts.set(key, (destCounts.get(key) ?? 0) + 1);
    }

    // Prefer trip destination; otherwise pick the bucket-list destination they have the fewest packages for (so Paris/Japan get suggested too). When tied (e.g. all 0), pick randomly so first suggestion isn't always the first in list.
    const chosenDestination =
      tripInfo?.destination?.trim() ||
      (bucketList.length
        ? (() => {
            const withCounts = bucketList.map((dest) => ({ dest, count: destCounts.get(normalizeDest(dest)) ?? 0 }));
            const minCount = Math.min(...withCounts.map((w) => w.count));
            const fewest = withCounts.filter((w) => w.count === minCount);
            return fewest[Math.floor(Math.random() * fewest.length)].dest;
          })()
        : undefined);

    const userContext = {
      destination: chosenDestination || undefined,
      activities_liked: activitiesLiked.length ? activitiesLiked : undefined,
      food_preferences: foodPrefs.length ? foodPrefs : undefined,
      bucket_list: bucketList.length ? bucketList : undefined,
      visited_destinations: visitedNames.length ? visitedNames : undefined,
      budget: tripInfo?.budget || profile?.budget_preference || undefined,
      travel_style: tripInfo?.travelStyle || profile?.travel_style || undefined,
      duration_days: tripInfo?.duration_days,
    };

    const { summary: mbaSummary, rule: mbaRule } = getMbaSummaryAndRule(profile, visited, userContext.destination);
    const pkg = await generateTravelPackage(userContext, mbaSummary, mbaRule);
    if (!pkg) {
      return NextResponse.json({ error: 'Failed to generate package' }, { status: 500 });
    }

    // Always use our chosen destination when we have one (fewest-packages or tripInfo), so display and next pick are correct
    const requestedDest = chosenDestination?.trim();
    const savedDestination = requestedDest
      ? requestedDest.charAt(0).toUpperCase() + requestedDest.slice(1).toLowerCase()
      : pkg.destination;

    const { data: row, error } = await supabase
      .from('suggested_packages')
      .insert({
        user_id: user.id,
        destination: savedDestination,
        hotel: pkg.hotel,
        activities: pkg.activities,
        why_recommended: pkg.whyRecommended,
        mba_summary: mbaSummary,
      })
      .select('*')
      .single();

    if (error) {
      console.error('suggested_packages insert error', error);
      return NextResponse.json({ error: 'Failed to save package' }, { status: 500 });
    }

    return NextResponse.json({ success: true, package: row });
  } catch (e) {
    console.error('packages/suggest error', e);
    return NextResponse.json({ error: 'Failed to suggest package' }, { status: 500 });
  }
}
