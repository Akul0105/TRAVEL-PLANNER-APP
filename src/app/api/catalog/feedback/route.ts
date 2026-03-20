import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function createUserSupabase(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

const ACTIONS = ['like', 'dislike', 'click', 'clear'] as const;
type CatalogAction = (typeof ACTIONS)[number];

function isCatalogAction(a: unknown): a is CatalogAction {
  return typeof a === 'string' && (ACTIONS as readonly string[]).includes(a);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createUserSupabase(token);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, itemType = 'destination', action } = body;
    if (!itemId || !isCatalogAction(action)) {
      return NextResponse.json({ error: 'Invalid itemId or action' }, { status: 400 });
    }

    const idKey = String(itemId).toLowerCase();

    if (action === 'clear') {
      const { error } = await supabase
        .from('catalog_feedback')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', idKey)
        .eq('item_type', itemType)
        .in('action', ['like', 'dislike']);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (action === 'click') {
      const { error } = await supabase.from('catalog_feedback').insert({
        user_id: user.id,
        item_id: idKey,
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
      .eq('item_id', idKey)
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
        item_id: idKey,
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

    const supabase = createUserSupabase(token);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('catalog_feedback')
      .select('item_id, item_type, action, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ feedback: data ?? [] });
  } catch (e) {
    console.error('Catalog feedback GET error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
