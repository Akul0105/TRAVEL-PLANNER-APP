import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season');

    let query = supabase
      .from('mba_seasonal_rules')
      .select(`
        *,
        mba_association_rules (*)
      `)
      .order('demand_multiplier', { ascending: false });

    if (season) {
      query = query.eq('season', season);
    }

    const { data: seasonalRules, error } = await query;

    if (error) {
      console.error('Error fetching seasonal rules:', error);
      return NextResponse.json({ error: 'Failed to fetch seasonal rules' }, { status: 500 });
    }

    return NextResponse.json(seasonalRules);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

