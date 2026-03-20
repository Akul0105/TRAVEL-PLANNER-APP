import type { Profile } from '@/lib/supabase';

const MAX_PROFILE_ITEMS = 5;

/** Latest like/dislike per item_id (ids are unique across catalog + bento in this app). */
export function feedbackListToPreferenceMap(
  rows: { item_id: string; action: string; created_at?: string }[]
): Record<string, { action: string }> {
  const sorted = [...rows].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );
  const map: Record<string, { action: string }> = {};
  for (const f of sorted) {
    if (f.action !== 'like' && f.action !== 'dislike') continue;
    const id = String(f.item_id).toLowerCase();
    if (!(id in map)) map[id] = { action: f.action };
  }
  return map;
}

export function ensureStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string');
  return [];
}

function mergeUniqueCap(existing: string[], add: string, max: number): string[] {
  const t = add.trim();
  if (!t) return existing;
  const lower = t.toLowerCase();
  if (existing.some((x) => x.toLowerCase() === lower)) return existing;
  const next = [...existing, t];
  return next.slice(0, max);
}

export type LikeSyncMeta = {
  bucketName?: string;
  /** Highlight / bento tile title */
  highlightTitle?: string;
  highlightType?: 'activity' | 'food' | 'attraction';
};

/**
 * Build profile patch when user likes a catalog item (for Scrapbook fields).
 */
export function buildProfileUpdatesFromLike(
  profile: Profile | null,
  meta: LikeSyncMeta
): Partial<Pick<Profile, 'activities_liked' | 'food_preferences' | 'bucket_list'>> | null {
  if (!profile) return null;
  const updates: Partial<Pick<Profile, 'activities_liked' | 'food_preferences' | 'bucket_list'>> = {};

  if (meta.bucketName) {
    updates.bucket_list = mergeUniqueCap(
      ensureStringArray(profile.bucket_list),
      meta.bucketName,
      MAX_PROFILE_ITEMS
    );
  }

  if (meta.highlightTitle && meta.highlightType === 'food') {
    updates.food_preferences = mergeUniqueCap(
      ensureStringArray(profile.food_preferences),
      meta.highlightTitle,
      MAX_PROFILE_ITEMS
    );
  }

  if (meta.highlightTitle && (meta.highlightType === 'activity' || meta.highlightType === 'attraction')) {
    updates.activities_liked = mergeUniqueCap(
      ensureStringArray(profile.activities_liked),
      meta.highlightTitle,
      MAX_PROFILE_ITEMS
    );
  }

  return Object.keys(updates).length ? updates : null;
}
