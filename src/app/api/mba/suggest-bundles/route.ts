import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mbaEngine } from '@/lib/mba/engine';
import type { MBAItem } from '@/lib/mba/engine';

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
    const tripInfo = (body?.tripInfo ?? {}) as { destination?: string; travelStyle?: string };

    // Fetch profile (activities_liked, food_preferences, bucket_list) and visited_destinations
    const [profileRes, visitedRes] = await Promise.all([
      supabase.from('profiles').select('activities_liked, food_preferences, bucket_list, travel_style').eq('id', user.id).single(),
      supabase.from('visited_destinations').select('destination_name').eq('user_id', user.id),
    ]);

    const contextItems: MBAItem[] = [];
    const seen = new Set<string>();

    // 1. Explicit destination from request (e.g. from chat)
    const destination = tripInfo?.destination?.trim();
    if (destination) {
      const destItem = mbaEngine.getItemByIdOrName(destination);
      if (destItem) {
        contextItems.push(destItem);
        seen.add(destItem.id);
      }
    }

    // 2. Profile scrapbook: bucket list, activities, food (map to MBA items by name)
    const profile = profileRes?.data as { activities_liked?: unknown; food_preferences?: unknown; bucket_list?: unknown } | null;
    if (profile) {
      const activities = Array.isArray(profile.activities_liked) ? profile.activities_liked.filter((x): x is string => typeof x === 'string') : [];
      const food = Array.isArray(profile.food_preferences) ? profile.food_preferences.filter((x): x is string => typeof x === 'string') : [];
      const bucket = Array.isArray(profile.bucket_list) ? profile.bucket_list.filter((x): x is string => typeof x === 'string') : [];
      collectContextItems(bucket, seen, contextItems);
      collectContextItems(activities, seen, contextItems);
      collectContextItems(food, seen, contextItems);
    }

    // 3. Visited destinations
    const visited = (visitedRes?.data ?? []) as { destination_name: string }[];
    collectContextItems(visited.map((v) => v.destination_name), seen, contextItems);

    let bundleArrays = mbaEngine.getBundleRecommendations(contextItems);
    if (bundleArrays.length === 0) {
      const topRules = mbaEngine.getTopRules(3);
      bundleArrays = topRules
        .slice(0, 2)
        .map((r) => [...r.antecedent, ...r.consequent])
        .filter((items) => items.length > 0);
    }

    // Allowed destinations: only show bundles that contain destinations the user wants (bucket list) or has visited
    const bucket = Array.isArray(profile?.bucket_list) ? (profile.bucket_list as string[]).filter(Boolean) : [];
    const visitedNames = (visited as { destination_name: string }[]).map((v) => v.destination_name).filter(Boolean);
    const allowedDestKeys = new Set<string>();
    for (const name of [...bucket, ...visitedNames]) {
      const key = name.toLowerCase().trim();
      if (key) allowedDestKeys.add(key);
      const item = mbaEngine.getItemByIdOrName(name);
      if (item && item.category === 'destination') allowedDestKeys.add(item.id.toLowerCase());
    }

    // Deduplicate and drop bundles that contain a destination not in bucket list or visited
    const seenKeys = new Set<string>();
    const uniqueBundles = bundleArrays.filter((itemsInBundle) => {
      const destItems = itemsInBundle.filter((i) => i.category === 'destination');
      const allDestinationsAllowed = destItems.every(
        (d) => allowedDestKeys.has(d.id.toLowerCase()) || allowedDestKeys.has(d.name.toLowerCase()),
      );
      if (!allDestinationsAllowed) return false;
      const key = itemsInBundle.map((i) => i.id).sort().join('|');
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    const inserted: { id: string }[] = [];
    for (const itemsInBundle of uniqueBundles) {
      const matchingRule = mbaEngine.getBestMatchingRule(itemsInBundle);
      const ruleSummary = matchingRule
        ? `IF ${matchingRule.antecedent.map((i) => i.name).join(' + ')} → ${matchingRule.consequent.map((i) => i.name).join(' + ')}`
        : null;
      const bundleData = {
        items: itemsInBundle.map((i) => ({ id: i.id, name: i.name, category: i.category, price: i.price })),
        confidence: matchingRule?.confidence ?? undefined,
        support: matchingRule?.support ?? undefined,
        lift: matchingRule?.lift ?? undefined,
        ruleSummary: ruleSummary ?? undefined,
      };
      const { data: row, error } = await supabase
        .from('user_bundles')
        .insert({ user_id: user.id, bundle_data: bundleData, source: 'mba' })
        .select('id')
        .single();
      if (!error && row) inserted.push(row);
    }

    return NextResponse.json({ success: true, count: inserted.length });
  } catch (e) {
    console.error('suggest-bundles error', e);
    return NextResponse.json({ error: 'Failed to generate bundles' }, { status: 500 });
  }
}
