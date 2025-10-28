import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all customer segments
    const { data: segments, error } = await supabase
      .from('mba_customer_segments')
      .select('*')
      .order('size', { ascending: false });

    if (error) {
      console.error('Error fetching segments:', error);
      return NextResponse.json({ error: 'Failed to fetch segments' }, { status: 500 });
    }

    return NextResponse.json(segments);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

