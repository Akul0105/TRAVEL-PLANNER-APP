'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { VisitedDestination, UserBundle, SuggestedPackage } from '@/lib/supabase';
import { formatPriceInMRU } from '@/lib/currency';
import { MapPin, Package, Plus, Loader2, Trash2, Compass, UtensilsCrossed, ListTodo, Sparkles } from 'lucide-react';

const MIN_ITEMS = 3;
const MAX_ITEMS = 5;
const ITEMS_HINT = `Add ${MIN_ITEMS}–${MAX_ITEMS} items for better bundle suggestions.`;

function ensureStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string');
  return [];
}

export default function ScrapbookPage() {
  const { user, profile, loading: authLoading, updateProfile, refreshProfile } = useAuth();
  const [visited, setVisited] = useState<VisitedDestination[]>([]);
  const [bundles, setBundles] = useState<UserBundle[]>([]);
  const [packages, setPackages] = useState<SuggestedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newDest, setNewDest] = useState({ destination_name: '', country: '', notes: '' });
  const [activitiesLiked, setActivitiesLiked] = useState<string[]>([]);
  const [foodPrefs, setFoodPrefs] = useState<string[]>([]);
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [newFood, setNewFood] = useState('');
  const [newBucket, setNewBucket] = useState('');
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [suggestingBundles, setSuggestingBundles] = useState(false);
  const [suggestingPackage, setSuggestingPackage] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      const [vRes, bRes, pRes] = await Promise.all([
        supabase.from('visited_destinations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_bundles').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('suggested_packages').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (!vRes.error) setVisited((vRes.data as VisitedDestination[]) ?? []);
      if (!bRes.error) setBundles((bRes.data as UserBundle[]) ?? []);
      if (!pRes.error) setPackages((pRes.data as SuggestedPackage[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user?.id]);

  useEffect(() => {
    if (profile) {
      setActivitiesLiked(ensureStringArray(profile.activities_liked));
      setFoodPrefs(ensureStringArray(profile.food_preferences));
      setBucketList(ensureStringArray(profile.bucket_list));
    }
  }, [profile?.id, profile?.activities_liked, profile?.food_preferences, profile?.bucket_list]);

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

  const saveActivities = async (next: string[]) => {
    setActivitiesLiked(next);
    setSavingPrefs(true);
    await updateProfile({ activities_liked: next });
    await refreshProfile();
    setSavingPrefs(false);
  };
  const saveFood = async (next: string[]) => {
    setFoodPrefs(next);
    setSavingPrefs(true);
    await updateProfile({ food_preferences: next });
    await refreshProfile();
    setSavingPrefs(false);
  };
  const saveBucket = async (next: string[]) => {
    setBucketList(next);
    setSavingPrefs(true);
    await updateProfile({ bucket_list: next });
    await refreshProfile();
    setSavingPrefs(false);
  };

  const addToList = (
    list: string[],
    newVal: string,
    setNew: (v: string) => void,
    save: (next: string[]) => Promise<void>,
    max: number = MAX_ITEMS
  ) => {
    const v = newVal.trim();
    if (!v || list.length >= max) return;
    const next = [...list, v];
    setNew('');
    save(next);
  };
  const removeFromList = (list: string[], index: number, save: (next: string[]) => Promise<void>) => {
    const next = list.filter((_, i) => i !== index);
    save(next);
  };

  const suggestBundles = async () => {
    if (!user) return;
    setSuggestingBundles(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch('/api/mba/suggest-bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data?.success && data?.count > 0) {
        const { data: bData } = await supabase.from('user_bundles').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (bData) setBundles(bData as UserBundle[]);
      }
    } finally {
      setSuggestingBundles(false);
    }
  };

  const suggestPackage = async () => {
    if (!user) return;
    setSuggestingPackage(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch('/api/packages/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          tripInfo: {
            // Do not send destination: API picks from bucket list (fewest packages) so you get Paris, Japan, Tokyo, etc.
            budget: profile?.budget_preference,
            travelStyle: profile?.travel_style,
          },
        }),
      });
      const data = await res.json();
      if (data?.success && data?.package) {
        setPackages((prev) => [data.package as SuggestedPackage, ...prev]);
      }
    } finally {
      setSuggestingPackage(false);
    }
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

        {/* Activities I like */}
        <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5" /> Activities I like
          </h2>
          <p className="text-sm text-[#9c958f] mb-3">{ITEMS_HINT}</p>
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder="e.g. hiking, museums, food tours"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(activitiesLiked, newActivity, setNewActivity, saveActivities))}
              className="flex-1 min-w-[160px] px-4 py-2 border border-[#e8e4df] rounded-lg bg-[#faf8f5] text-[#2c2825] placeholder:text-[#9c958f]"
            />
            <button
              type="button"
              disabled={savingPrefs || !newActivity.trim() || activitiesLiked.length >= MAX_ITEMS}
              onClick={() => addToList(activitiesLiked, newActivity, setNewActivity, saveActivities)}
              className="px-4 py-2 bg-[#2c2825] text-white rounded-lg hover:bg-[#4a4541] disabled:opacity-50 flex items-center gap-2"
            >
              {savingPrefs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {activitiesLiked.length === 0 ? (
              <li className="text-[#6b6560] py-2">No activities yet. Add 3–5 for better suggestions.</li>
            ) : (
              activitiesLiked.map((a, i) => (
                <li key={i} className="flex items-center justify-between py-2 px-4 rounded-lg bg-[#faf8f5] border border-[#e8e4df]">
                  <span className="text-[#2c2825]">{a}</span>
                  <button type="button" onClick={() => removeFromList(activitiesLiked, i, saveActivities)} className="p-1 text-[#6b6560] hover:text-[#2c2825]" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Food I like */}
        <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-4 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" /> Food I like
          </h2>
          <p className="text-sm text-[#9c958f] mb-3">{ITEMS_HINT}</p>
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder="e.g. local cuisine, fine dining, street food"
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(foodPrefs, newFood, setNewFood, saveFood))}
              className="flex-1 min-w-[160px] px-4 py-2 border border-[#e8e4df] rounded-lg bg-[#faf8f5] text-[#2c2825] placeholder:text-[#9c958f]"
            />
            <button
              type="button"
              disabled={savingPrefs || !newFood.trim() || foodPrefs.length >= MAX_ITEMS}
              onClick={() => addToList(foodPrefs, newFood, setNewFood, saveFood)}
              className="px-4 py-2 bg-[#2c2825] text-white rounded-lg hover:bg-[#4a4541] disabled:opacity-50 flex items-center gap-2"
            >
              {savingPrefs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {foodPrefs.length === 0 ? (
              <li className="text-[#6b6560] py-2">No food preferences yet. Add 3–5 for better suggestions.</li>
            ) : (
              foodPrefs.map((f, i) => (
                <li key={i} className="flex items-center justify-between py-2 px-4 rounded-lg bg-[#faf8f5] border border-[#e8e4df]">
                  <span className="text-[#2c2825]">{f}</span>
                  <button type="button" onClick={() => removeFromList(foodPrefs, i, saveFood)} className="p-1 text-[#6b6560] hover:text-[#2c2825]" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Places to visit (bucket list) */}
        <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-4 flex items-center gap-2">
            <ListTodo className="w-5 h-5" /> Places to visit (bucket list)
          </h2>
          <p className="text-sm text-[#9c958f] mb-3">{ITEMS_HINT}</p>
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder="e.g. Tokyo, Iceland, Machu Picchu"
              value={newBucket}
              onChange={(e) => setNewBucket(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(bucketList, newBucket, setNewBucket, saveBucket))}
              className="flex-1 min-w-[160px] px-4 py-2 border border-[#e8e4df] rounded-lg bg-[#faf8f5] text-[#2c2825] placeholder:text-[#9c958f]"
            />
            <button
              type="button"
              disabled={savingPrefs || !newBucket.trim() || bucketList.length >= MAX_ITEMS}
              onClick={() => addToList(bucketList, newBucket, setNewBucket, saveBucket)}
              className="px-4 py-2 bg-[#2c2825] text-white rounded-lg hover:bg-[#4a4541] disabled:opacity-50 flex items-center gap-2"
            >
              {savingPrefs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {bucketList.length === 0 ? (
              <li className="text-[#6b6560] py-2">No bucket list places yet. Add 3–5 for better suggestions.</li>
            ) : (
              bucketList.map((b, i) => (
                <li key={i} className="flex items-center justify-between py-2 px-4 rounded-lg bg-[#faf8f5] border border-[#e8e4df]">
                  <span className="text-[#2c2825]">{b}</span>
                  <button type="button" onClick={() => removeFromList(bucketList, i, saveBucket)} className="p-1 text-[#6b6560] hover:text-[#2c2825]" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Suggested travel packages (LLM + MBA context) */}
        <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Suggested travel packages
            </h2>
            <button
              type="button"
              onClick={suggestPackage}
              disabled={suggestingPackage}
              className="px-4 py-2 bg-[#2c2825] text-white rounded-lg hover:bg-[#4a4541] disabled:opacity-50 flex items-center gap-2"
            >
              {suggestingPackage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Suggest package
            </button>
          </div>
          <p className="text-sm text-[#6b6560] mb-4">
            Personalized destination, hotel, and activities based on your scrapbook and market basket analysis.
          </p>
          {packages.length === 0 ? (
            <p className="text-[#6b6560] py-4">
              No packages yet. Fill in activities, food, and bucket list above, then click <strong>Suggest package</strong>.
            </p>
          ) : (
            <div className="space-y-6">
              {packages.map((p) => (
                <div key={p.id} className="p-5 rounded-lg border border-[#e8e4df] bg-[#faf8f5]">
                  <div className="grid gap-2 mb-3">
                    <p className="text-[#2c2825] font-medium">
                      <span className="text-[#6b6560]">Destination:</span> {p.destination}
                    </p>
                    <p className="text-[#2c2825] font-medium">
                      <span className="text-[#6b6560]">Hotel:</span> {p.hotel}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-[#6b6560] mb-1">Activities</p>
                    <ul className="list-disc list-inside text-[#2c2825] space-y-0.5">
                      {(Array.isArray(p.activities) ? p.activities : []).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  {p.why_recommended && (
                    <p className="text-sm text-[#6b6560] border-t border-[#e8e4df] pt-3 mt-3">
                      <span className="font-medium text-[#2c2825]">Why recommended:</span> {p.why_recommended}
                    </p>
                  )}
                  {p.mba_summary && (
                    <p className="text-xs text-[#9c958f] mt-2">Based on: {p.mba_summary}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personalized / suggested bundles */}
        <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] flex items-center gap-2">
              <Package className="w-5 h-5" /> Personalized bundles (MBA)
            </h2>
            <button
              type="button"
              onClick={suggestBundles}
              disabled={suggestingBundles}
              className="px-4 py-2 bg-[#2c2825] text-white rounded-lg hover:bg-[#4a4541] disabled:opacity-50 flex items-center gap-2"
            >
              {suggestingBundles ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
              Suggest bundles
            </button>
          </div>
          {bundles.length === 0 ? (
            <p className="text-[#6b6560] py-4">
              No bundles yet. Chat with the assistant and share your destination and preferences; we&apos;ll generate personalized bundles for you here.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const bundleKey = (b: UserBundle) => (b.bundle_data.items ?? []).map((i) => i.id).sort().join('|');
                const seen = new Set<string>();
                return bundles.filter((b) => {
                  const k = bundleKey(b);
                  if (seen.has(k)) return false;
                  seen.add(k);
                  return true;
                });
              })().map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-lg border border-[#e8e4df] bg-[#faf8f5]"
                >
                  <div className="font-medium text-[#2c2825] mb-2">
                    {b.bundle_data.items?.map((i) => i.name).join(' + ')}
                  </div>
                  <ul className="text-sm text-[#6b6560] space-y-1">
                    {b.bundle_data.items?.map((item, i) => (
                      <li key={i}>{item.name} ({item.category}) — {formatPriceInMRU(item.price)}</li>
                    ))}
                  </ul>
                  {(b.bundle_data.ruleSummary || b.bundle_data.confidence != null || b.bundle_data.support != null || b.bundle_data.lift != null) && (
                    <p className="text-xs text-[#9c958f] mt-2 space-y-0.5">
                      {b.bundle_data.ruleSummary && <span className="block">{b.bundle_data.ruleSummary}</span>}
                      <span>
                        {b.bundle_data.support != null && `Support ${(b.bundle_data.support * 100).toFixed(1)}%`}
                        {b.bundle_data.support != null && (b.bundle_data.confidence != null || b.bundle_data.lift != null) && ' · '}
                        {b.bundle_data.confidence != null && `Confidence ${(b.bundle_data.confidence * 100).toFixed(0)}%`}
                        {b.bundle_data.confidence != null && b.bundle_data.lift != null && ' · '}
                        {b.bundle_data.lift != null && `Lift ${b.bundle_data.lift.toFixed(2)}`}
                      </span>
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
