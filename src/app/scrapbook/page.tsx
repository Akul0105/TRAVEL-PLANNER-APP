'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { VisitedDestination, UserBundle } from '@/lib/supabase';
import { MapPin, Package, Plus, Loader2, Trash2 } from 'lucide-react';

export default function ScrapbookPage() {
  const { user, loading: authLoading } = useAuth();
  const [visited, setVisited] = useState<VisitedDestination[]>([]);
  const [bundles, setBundles] = useState<UserBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newDest, setNewDest] = useState({ destination_name: '', country: '', notes: '' });

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      const [vRes, bRes] = await Promise.all([
        supabase.from('visited_destinations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_bundles').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (!vRes.error) setVisited((vRes.data as VisitedDestination[]) ?? []);
      if (!bRes.error) setBundles((bRes.data as UserBundle[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user?.id]);

  const addDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newDest.destination_name.trim()) return;
    setAdding(true);
    const { error } = await supabase.from('visited_destinations').insert({
      user_id: user.id,
      destination_name: newDest.destination_name.trim(),
      country: newDest.country.trim() || null,
      notes: newDest.notes.trim() || null,
    });
    if (!error) {
      setNewDest({ destination_name: '', country: '', notes: '' });
      const { data } = await supabase.from('visited_destinations').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setVisited(data as VisitedDestination[]);
    }
    setAdding(false);
  };

  const removeDestination = async (id: string) => {
    await supabase.from('visited_destinations').delete().eq('id', id);
    setVisited((prev) => prev.filter((d) => d.id !== id));
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6b6560]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5]">
        <section className="py-16 border-b border-[#e8e4df]">
          <div className="container mx-auto px-4">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-semibold text-[#2c2825] mb-3">
              My Scrapbook
            </h1>
            <p className="text-[#6b6560] text-lg max-w-2xl">
              Sign in with your email (via the chat) to see your visited destinations and personalized bundles here.
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg border border-[#e8e4df] p-8 text-center text-[#6b6560]">
            Open the chat and enter your email to receive a sign-in link. Once signed in, your Scrapbook will show your destinations and MBA-recommended bundles.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <section className="py-16 border-b border-[#e8e4df]">
        <div className="container mx-auto px-4">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-semibold text-[#2c2825] mb-3">
            My Scrapbook
          </h1>
          <p className="text-[#6b6560] text-lg max-w-2xl">
            Your visited destinations and personalized travel bundles from market basket analysis.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-10">
        {/* Visited destinations */}
        <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Destinations I&apos;ve visited
          </h2>
          <form onSubmit={addDestination} className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Destination (e.g. Paris)"
              value={newDest.destination_name}
              onChange={(e) => setNewDest((d) => ({ ...d, destination_name: e.target.value }))}
              className="flex-1 min-w-[140px] px-4 py-2 border border-[#e8e4df] rounded-lg bg-[#faf8f5] text-[#2c2825] placeholder:text-[#9c958f]"
            />
            <input
              type="text"
              placeholder="Country (optional)"
              value={newDest.country}
              onChange={(e) => setNewDest((d) => ({ ...d, country: e.target.value }))}
              className="w-32 px-4 py-2 border border-[#e8e4df] rounded-lg bg-[#faf8f5] text-[#2c2825] placeholder:text-[#9c958f]"
            />
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newDest.notes}
              onChange={(e) => setNewDest((d) => ({ ...d, notes: e.target.value }))}
              className="flex-1 min-w-[140px] px-4 py-2 border border-[#e8e4df] rounded-lg bg-[#faf8f5] text-[#2c2825] placeholder:text-[#9c958f]"
            />
            <button
              type="submit"
              disabled={adding || !newDest.destination_name.trim()}
              className="px-4 py-2 bg-[#2c2825] text-white rounded-lg hover:bg-[#4a4541] disabled:opacity-50 flex items-center gap-2"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </form>
          <ul className="space-y-2">
            {visited.length === 0 ? (
              <li className="text-[#6b6560] py-4">No destinations added yet. Add one above.</li>
            ) : (
              visited.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#faf8f5] border border-[#e8e4df]"
                >
                  <span className="font-medium text-[#2c2825]">{d.destination_name}</span>
                  <span className="text-[#6b6560] text-sm">{d.country || d.notes || ''}</span>
                  <button
                    type="button"
                    onClick={() => removeDestination(d.id)}
                    className="p-1 text-[#6b6560] hover:text-[#2c2825]"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Personalized / suggested bundles */}
        <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" /> Personalized bundles (MBA)
          </h2>
          {bundles.length === 0 ? (
            <p className="text-[#6b6560] py-4">
              No bundles yet. Chat with the assistant and share your destination and preferences; we&apos;ll generate personalized bundles for you here.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bundles.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-lg border border-[#e8e4df] bg-[#faf8f5]"
                >
                  <div className="font-medium text-[#2c2825] mb-2">
                    {b.bundle_data.items?.map((i) => i.name).join(' + ')}
                  </div>
                  <ul className="text-sm text-[#6b6560] space-y-1">
                    {b.bundle_data.items?.map((item, i) => (
                      <li key={i}>{item.name} ({item.category}) — ${item.price}</li>
                    ))}
                  </ul>
                  {(b.bundle_data.confidence != null || b.bundle_data.ruleSummary) && (
                    <p className="text-xs text-[#9c958f] mt-2">
                      {b.bundle_data.ruleSummary}
                      {b.bundle_data.confidence != null && ` · Confidence ${(b.bundle_data.confidence * 100).toFixed(0)}%`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
