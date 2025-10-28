import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get the latest analytics snapshot
    const { data: snapshot, error: snapshotError } = await supabase
      .from('mba_analytics_snapshot')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    if (snapshotError) {
      console.error('Error fetching snapshot:', snapshotError);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

