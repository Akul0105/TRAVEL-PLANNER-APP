import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, itemType = 'destination', action } = body;
    if (!itemId || !action || !['like', 'dislike', 'click'].includes(action)) {
      return NextResponse.json({ error: 'Invalid itemId or action' }, { status: 400 });
    }

    if (action === 'click') {
      const { error } = await supabase.from('catalog_feedback').insert({
        user_id: user.id,
        item_id: String(itemId).toLowerCase(),
        item_type: itemType,
        action: 'click',
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    // like / dislike: upsert so only one preference per user per item
    const { data: existing } = await supabase
      .from('catalog_feedback')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_id', String(itemId).toLowerCase())
      .eq('item_type', itemType)
      .in('action', ['like', 'dislike'])
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('catalog_feedback')
        .update({ action, created_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const { error } = await supabase.from('catalog_feedback').insert({
        user_id: user.id,
        item_id: String(itemId).toLowerCase(),
        item_type: itemType,
        action,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Catalog feedback error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('catalog_feedback')
      .select('item_id, item_type, action')
      .eq('user_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ feedback: data ?? [] });
  } catch (e) {
    console.error('Catalog feedback GET error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
