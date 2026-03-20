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

/** Dark mode: soft fields on charcoal */
const fieldClass =
  'rounded-xl bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-white/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] ring-1 ring-white/10 border-0 outline-none transition-all duration-200 focus:bg-white/[0.1] focus:ring-2 focus:ring-emerald-500/35';

const cardClass =
  'rounded-[1.75rem] bg-neutral-900/90 p-8 md:p-10 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.08]';

const sectionKickerClass = 'text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45 mb-2';

const sectionTitleClass = 'text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-white';

const primaryBtnClass =
  'inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-emerald-900/25 transition hover:bg-emerald-400 disabled:opacity-45';

function ensureStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string');
  return [];
}

/** Format catalog item_id to display name (e.g. paris → Paris, new-york → New York). */
function formatCatalogItemName(id: string): string {
  return id
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export default function ScrapbookPage() {
  const { user, profile, loading: authLoading, updateProfile, refreshProfile, isAnonymous } = useAuth();
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
  const [catalogLikes, setCatalogLikes] = useState<{ item_id: string; item_type: string }[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      const [vRes, bRes, pRes, feedbackRes] = await Promise.all([
        supabase.from('visited_destinations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_bundles').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('suggested_packages').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('catalog_feedback').select('item_id, item_type').eq('user_id', user.id).eq('action', 'like'),
      ]);
      if (!vRes.error) setVisited((vRes.data as VisitedDestination[]) ?? []);
      if (!bRes.error) setBundles((bRes.data as UserBundle[]) ?? []);
      if (!pRes.error) setPackages((pRes.data as SuggestedPackage[]) ?? []);
      if (!feedbackRes.error) setCatalogLikes((feedbackRes.data as { item_id: string; item_type: string }[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user?.id]);

  useEffect(() => {
    if (!profile) return;
    setActivitiesLiked(ensureStringArray(profile.activities_liked));
    setFoodPrefs(ensureStringArray(profile.food_preferences));

    const profileBucket = ensureStringArray(profile.bucket_list);
    const likedDestinations = catalogLikes
      .filter((f) => (f.item_type || 'destination').toLowerCase() === 'destination')
      .map((f) => formatCatalogItemName(f.item_id));
    const seen = new Set(profileBucket.map((x) => x.toLowerCase().trim()));
    const merged = [...profileBucket];
    for (const name of likedDestinations) {
      if (name && !seen.has(name.toLowerCase().trim())) {
        seen.add(name.toLowerCase().trim());
        merged.push(name);
      }
    }
    setBucketList(merged);
  }, [profile?.id, profile?.activities_liked, profile?.food_preferences, profile?.bucket_list, catalogLikes]);

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
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c0a09]">
        <section className="relative overflow-hidden border-b border-white/10 bg-neutral-950 px-4 pb-20 pt-14 md:pb-28 md:pt-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                'radial-gradient(ellipse 90% 60% at 50% -30%, rgba(255,255,255,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(255,255,255,0.06), transparent)',
            }}
          />
          <div className="relative mx-auto max-w-4xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Your space</p>
            <h1 className="mb-5 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl md:leading-[1.05]">
              My Scrapbook
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-neutral-400 md:text-xl">
              Sign in with your email to see visited destinations, preferences, and MBA-personalized bundles in one place.
            </p>
          </div>
        </section>
        <div className="mx-auto -mt-10 max-w-lg px-4 pb-20">
          <div className={`${cardClass} text-center text-[15px] leading-relaxed text-white/65`}>
            Sign in using the button in the <strong className="font-semibold text-white">top right</strong> to unlock
            your Scrapbook and bundle suggestions.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-neutral-950 px-4 pb-16 pt-12 md:pb-24 md:pt-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 90% 55% at 50% -35%, rgba(255,255,255,0.15), transparent 55%), radial-gradient(ellipse 45% 35% at 100% 10%, rgba(255,255,255,0.07), transparent)',
          }}
        />
        <div className="relative mx-auto max-w-4xl">
          {isAnonymous && (
            <div className="mb-8 inline-flex max-w-full rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white/90 backdrop-blur-sm">
              You&apos;re browsing as a guest — sign in with email to sync your scrapbook across devices.
            </div>
          )}
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Your space</p>
          <h1 className="mb-5 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl md:leading-[1.05]">
            My Scrapbook
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">
            Destinations you&apos;ve been, what you love, and bundles shaped by market basket analysis.
          </p>
        </div>
      </section>

      <div className="relative mx-auto max-w-3xl space-y-8 px-4 py-14 md:space-y-12 md:py-20">
        {/* Visited destinations */}
        <div className={cardClass}>
          <p className={sectionKickerClass}>Profile</p>
          <h2 className={`${sectionTitleClass} mb-8 flex items-center gap-3`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-md">
              <MapPin className="h-5 w-5" strokeWidth={2} />
            </span>
            Destinations I&apos;ve visited
          </h2>
          <form onSubmit={addDestination} className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <input
              type="text"
              placeholder="Destination (e.g. Paris)"
              value={newDest.destination_name}
              onChange={(e) => setNewDest((d) => ({ ...d, destination_name: e.target.value }))}
              className={`min-w-[160px] flex-1 ${fieldClass}`}
            />
            <input
              type="text"
              placeholder="Country (optional)"
              value={newDest.country}
              onChange={(e) => setNewDest((d) => ({ ...d, country: e.target.value }))}
              className={`w-full min-w-[120px] sm:w-36 ${fieldClass}`}
            />
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newDest.notes}
              onChange={(e) => setNewDest((d) => ({ ...d, notes: e.target.value }))}
              className={`min-w-[160px] flex-1 ${fieldClass}`}
            />
            <button type="submit" disabled={adding || !newDest.destination_name.trim()} className={primaryBtnClass}>
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </button>
          </form>
          <ul className="space-y-3">
            {visited.length === 0 ? (
              <li className="rounded-2xl bg-white/[0.04] py-10 text-center text-[15px] text-white/45 ring-1 ring-white/10">
                No destinations yet. Add one above to get started.
              </li>
            ) : (
              visited.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-5 py-4 ring-1 ring-white/10"
                >
                  <span className="font-medium text-white">{d.destination_name}</span>
                  <span className="text-white/55 text-sm">{d.country || d.notes || ''}</span>
                  <button
                    type="button"
                    onClick={() => removeDestination(d.id)}
                    className="p-1 text-white/50 hover:text-white"
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
        <div className={cardClass}>
          <p className={sectionKickerClass}>Preferences</p>
          <h2 className={`${sectionTitleClass} mb-3 flex items-center gap-3`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-md">
              <Compass className="h-5 w-5" strokeWidth={2} />
            </span>
            Activities I like
          </h2>
          <p className="mb-6 text-[15px] text-white/50">{ITEMS_HINT}</p>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="e.g. hiking, museums, food tours"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(activitiesLiked, newActivity, setNewActivity, saveActivities))}
              className={`min-w-0 flex-1 ${fieldClass}`}
            />
            <button
              type="button"
              disabled={savingPrefs || !newActivity.trim() || activitiesLiked.length >= MAX_ITEMS}
              onClick={() => addToList(activitiesLiked, newActivity, setNewActivity, saveActivities)}
              className={primaryBtnClass}
            >
              {savingPrefs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </div>
          <ul className="space-y-3">
            {activitiesLiked.length === 0 ? (
              <li className="rounded-2xl bg-white/[0.04] py-8 text-center text-[15px] text-white/45 ring-1 ring-white/10">
                No activities yet. Add 3–5 for richer suggestions.
              </li>
            ) : (
              activitiesLiked.map((a, i) => (
                <li key={i} className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-5 py-3.5 ring-1 ring-white/10">
                  <span className="text-white">{a}</span>
                  <button type="button" onClick={() => removeFromList(activitiesLiked, i, saveActivities)} className="p-1 text-white/50 hover:text-white" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Food I like */}
        <div className={cardClass}>
          <p className={sectionKickerClass}>Preferences</p>
          <h2 className={`${sectionTitleClass} mb-3 flex items-center gap-3`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-md">
              <UtensilsCrossed className="h-5 w-5" strokeWidth={2} />
            </span>
            Food I like
          </h2>
          <p className="mb-6 text-[15px] text-white/50">{ITEMS_HINT}</p>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="e.g. local cuisine, fine dining, street food"
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(foodPrefs, newFood, setNewFood, saveFood))}
              className={`min-w-0 flex-1 ${fieldClass}`}
            />
            <button
              type="button"
              disabled={savingPrefs || !newFood.trim() || foodPrefs.length >= MAX_ITEMS}
              onClick={() => addToList(foodPrefs, newFood, setNewFood, saveFood)}
              className={primaryBtnClass}
            >
              {savingPrefs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </div>
          <ul className="space-y-3">
            {foodPrefs.length === 0 ? (
              <li className="rounded-2xl bg-white/[0.04] py-8 text-center text-[15px] text-white/45 ring-1 ring-white/10">
                No food preferences yet. Add 3–5 for better suggestions.
              </li>
            ) : (
              foodPrefs.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-5 py-3.5 ring-1 ring-white/10">
                  <span className="text-white">{f}</span>
                  <button type="button" onClick={() => removeFromList(foodPrefs, i, saveFood)} className="p-1 text-white/50 hover:text-white" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Places to visit (bucket list) */}
        <div className={cardClass}>
          <p className={sectionKickerClass}>Wishlist</p>
          <h2 className={`${sectionTitleClass} mb-3 flex items-center gap-3`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-md">
              <ListTodo className="h-5 w-5" strokeWidth={2} />
            </span>
            Places to visit
          </h2>
          <p className="mb-6 text-[15px] text-white/50">{ITEMS_HINT}</p>
          {catalogLikes.some((f) => (f.item_type || 'destination').toLowerCase() === 'destination') && (
            <p className="mb-4 text-sm text-white/55">Includes places you liked on the home page.</p>
          )}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="e.g. Tokyo, Iceland, Machu Picchu"
              value={newBucket}
              onChange={(e) => setNewBucket(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(bucketList, newBucket, setNewBucket, saveBucket))}
              className={`min-w-0 flex-1 ${fieldClass}`}
            />
            <button
              type="button"
              disabled={savingPrefs || !newBucket.trim() || bucketList.length >= MAX_ITEMS}
              onClick={() => addToList(bucketList, newBucket, setNewBucket, saveBucket)}
              className={primaryBtnClass}
            >
              {savingPrefs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </div>
          <ul className="space-y-3">
            {bucketList.length === 0 ? (
              <li className="rounded-2xl bg-white/[0.04] py-8 text-center text-[15px] text-white/45 ring-1 ring-white/10">
                No bucket list yet. Add 3–5 dream destinations.
              </li>
            ) : (
              bucketList.map((b, i) => (
                <li key={i} className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-5 py-3.5 ring-1 ring-white/10">
                  <span className="text-white">{b}</span>
                  <button type="button" onClick={() => removeFromList(bucketList, i, saveBucket)} className="p-1 text-white/50 hover:text-white" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Suggested travel packages (LLM + MBA context) */}
        <div className={cardClass}>
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={sectionKickerClass}>AI + MBA</p>
              <h2 className={`${sectionTitleClass} flex items-center gap-3`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-md">
                  <Sparkles className="h-5 w-5" strokeWidth={2} />
                </span>
                Suggested packages
              </h2>
            </div>
            <button type="button" onClick={suggestPackage} disabled={suggestingPackage} className={`shrink-0 ${primaryBtnClass}`}>
              {suggestingPackage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Suggest package
            </button>
          </div>
          <p className="mb-6 text-[15px] leading-relaxed text-white/60">
            Personalized destination, hotel, and activities based on your scrapbook and market basket analysis.
          </p>
          {packages.length === 0 ? (
            <p className="rounded-2xl bg-white/[0.04] py-10 text-center text-[15px] text-white/45 ring-1 ring-white/10">
              No packages yet. Fill preferences above, then run <strong className="text-white">Suggest package</strong>.
            </p>
          ) : (
            <div className="space-y-6">
              {packages.map((p) => (
                <div key={p.id} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <div className="grid gap-2 mb-3">
                    <p className="text-white font-medium">
                      <span className="text-white/55">Destination:</span> {p.destination}
                    </p>
                    <p className="text-white font-medium">
                      <span className="text-white/55">Hotel:</span> {p.hotel}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-white/55 mb-1">Activities</p>
                    <ul className="list-disc list-inside text-white space-y-0.5">
                      {(Array.isArray(p.activities) ? p.activities : []).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  {p.why_recommended && (
                    <p className="text-sm text-white/60 border-t border-white/10 pt-3 mt-3">
                      <span className="font-medium text-white">Why recommended:</span> {p.why_recommended}
                    </p>
                  )}
                  {p.mba_summary && (
                    <p className="text-xs text-white/45 mt-2">Based on: {p.mba_summary}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personalized / suggested bundles */}
        <div className={cardClass}>
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={sectionKickerClass}>Market basket</p>
              <h2 className={`${sectionTitleClass} flex items-center gap-3`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-md">
                  <Package className="h-5 w-5" strokeWidth={2} />
                </span>
                Personalized bundles
              </h2>
            </div>
            <button type="button" onClick={suggestBundles} disabled={suggestingBundles} className={`shrink-0 ${primaryBtnClass}`}>
              {suggestingBundles ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
              Suggest bundles
            </button>
          </div>
          {bundles.length === 0 ? (
            <p className="rounded-2xl bg-white/[0.04] py-10 text-center text-[15px] text-white/45 ring-1 ring-white/10">
              No bundles yet. Chat with the assistant about destinations and preferences — bundles will show up here.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <div key={b.id} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                  <div className="font-medium text-white mb-2">
                    {b.bundle_data.items?.map((i) => i.name).join(' + ')}
                  </div>
                  <ul className="text-sm text-white/60 space-y-1">
                    {b.bundle_data.items?.map((item, i) => (
                      <li key={i}>{item.name} ({item.category}) — {formatPriceInMRU(item.price)}</li>
                    ))}
                  </ul>
                  {(b.bundle_data.ruleSummary || b.bundle_data.confidence != null || b.bundle_data.support != null || b.bundle_data.lift != null) && (
                    <p className="text-xs text-white/45 mt-2 space-y-0.5">
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
