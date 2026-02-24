import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mbaEngine } from '@/lib/mba/engine';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

    const body = await request.json();
    const { tripInfo } = body as { tripInfo?: { destination?: string; travelStyle?: string } };
    const destination = tripInfo?.destination?.trim();
    if (!destination) {
      return NextResponse.json({ error: 'Destination required' }, { status: 400 });
    }

    const destItem = mbaEngine.getItemByIdOrName(destination);
    const contextItems = destItem ? [destItem] : [];

    let bundleArrays = mbaEngine.getBundleRecommendations(contextItems);
    // If no bundles from context (e.g. destination not in MBA items), use top rules to build fallback bundles
    if (bundleArrays.length === 0) {
      const topRules = mbaEngine.getTopRules(3);
      bundleArrays = topRules
        .slice(0, 2)
        .map((r) => [...r.antecedent, ...r.consequent])
        .filter((items) => items.length > 0);
    }
    const inserted: { id: string }[] = [];

    for (const itemsInBundle of bundleArrays) {
      const bundleData = {
        items: itemsInBundle.map((i) => ({ id: i.id, name: i.name, category: i.category, price: i.price })),
        confidence: 0.85,
        ruleSummary: 'Often booked together (market basket analysis)',
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
