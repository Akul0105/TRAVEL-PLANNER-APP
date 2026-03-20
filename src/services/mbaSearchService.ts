/**
 * Server-side search: MBA engine + optional Mistral one-liner (no booking fluff).
 */
import { DESTINATIONS } from '@/data/destinationsCatalog';
import { mbaEngine, type MBAItem } from '@/lib/mba/engine';

const CATALOG_IDS = new Set(DESTINATIONS.map((d) => d.id));

export type MbaSearchSuggestionDTO = {
  id: string;
  text: string;
  type: 'destination' | 'activity';
  subtitle?: string;
  popularity?: number;
};

/** Country / region phrases → catalog destination ids that exist in Planify. */
const QUERY_TO_CATALOG_IDS: Record<string, string[]> = {
  italy: ['rome', 'florence'],
  italian: ['rome', 'florence'],
  france: ['paris'],
  french: ['paris'],
  uk: ['london', 'edinburgh'],
  britain: ['london'],
  england: ['london'],
  scotland: ['edinburgh'],
  spain: ['barcelona'],
  greek: ['athens', 'santorini'],
  greece: ['athens', 'santorini'],
  japan: ['tokyo', 'kyoto'],
  indonesia: ['bali'],
  thailand: ['bangkok'],
  usa: ['new-york', 'los-angeles', 'miami'],
  america: ['new-york', 'miami'],
  uae: ['dubai'],
  emirates: ['dubai'],
  iceland: ['reykjavik'],
  morocco: ['marrakech'],
  croatia: ['dubrovnik'],
  mexico: ['cancun'],
  brazil: ['rio'],
  canada: ['vancouver'],
  australia: ['sydney'],
  'new zealand': ['queenstown'],
  netherlands: ['amsterdam'],
  holland: ['amsterdam'],
  portugal: ['lisbon'],
  turkey: ['istanbul'],
  austria: ['vienna'],
  'czech': ['prague'],
  czechia: ['prague'],
  denmark: ['copenhagen'],
  korea: ['seoul'],
  china: ['hong-kong'],
  'hong kong': ['hong-kong'],
};

function catalogSynonymSuggestions(lower: string): MbaSearchSuggestionDTO[] | null {
  const keys = lower.split(/[\s,]+/).map((k) => k.trim()).filter(Boolean);
  const ids = new Set<string>();
  for (const k of keys) {
    const mapped = QUERY_TO_CATALOG_IDS[k];
    if (mapped) mapped.forEach((id) => ids.add(id));
  }
  const direct = QUERY_TO_CATALOG_IDS[lower];
  if (direct) direct.forEach((id) => ids.add(id));

  const resolved = [...ids].filter((id) => CATALOG_IDS.has(id));
  if (resolved.length === 0) return null;

  return resolved.map((id, idx) => {
    const d = DESTINATIONS.find((x) => x.id === id)!;
    return {
      id: d.id,
      text: d.name,
      type: 'destination' as const,
      subtitle: d.region ? `${d.region} · matches your search` : d.description.slice(0, 80),
      popularity: 92 - idx * 3,
    };
  });
}

function catalogSubstringMatches(lower: string): MbaSearchSuggestionDTO[] {
  if (lower.length < 2) return [];
  return DESTINATIONS.filter(
    (d) =>
      d.id.includes(lower) ||
      d.name.toLowerCase().includes(lower) ||
      (d.region?.toLowerCase().includes(lower) ?? false) ||
      d.description.toLowerCase().includes(lower)
  )
    .slice(0, 12)
    .map((d, idx) => ({
      id: d.id,
      text: d.name,
      type: 'destination' as const,
      subtitle: d.region ? `${d.region} · ${d.description.slice(0, 70)}` : d.description.slice(0, 80),
      popularity: 88 - idx * 2,
    }));
}

const EXCLUDED_CATEGORIES = new Set(['accommodation', 'transportation', 'service']);

export type MbaSearchResponseDTO = {
  suggestions: MbaSearchSuggestionDTO[];
  marketBasket: MbaSearchSuggestionDTO[];
};

function isExcluded(item: MBAItem): boolean {
  return EXCLUDED_CATEGORIES.has(item.category);
}

function findSeedItem(query: string): MBAItem | null {
  const q = query.trim();
  if (!q) return null;
  let seed = mbaEngine.getItemByIdOrName(q);
  if (seed && !isExcluded(seed)) return seed;
  const lower = q.toLowerCase();
  const all = mbaEngine.getAllItems();
  const dest = all.find(
    (i) =>
      i.category === 'destination' &&
      (lower.includes(i.id) || lower.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(lower))
  );
  if (dest) return dest;
  const act = all.find(
    (i) =>
      i.category === 'activity' &&
      (i.id === lower || i.name.toLowerCase().includes(lower) || lower.includes(i.name.toLowerCase()))
  );
  if (act && !isExcluded(act)) return act;
  return null;
}

function destinationMatchesQuery(dest: MBAItem, q: string): boolean {
  const lower = q.toLowerCase();
  return (
    dest.name.toLowerCase().includes(lower) ||
    dest.id.includes(lower) ||
    dest.tags.some((t) => t.includes(lower))
  );
}

/**
 * Build dropdown rows from MBA rules, bundles, and recommendations — destinations & activities only.
 */
export function buildMbaSearchSuggestions(query: string): MbaSearchResponseDTO & {
  matchedSeed: MBAItem | null;
  mbaSummaryForLlm: string;
} {
  const q = query.trim();
  const lower = q.toLowerCase();

  if (!q || lower.length < 2) {
    return { suggestions: [], marketBasket: [], matchedSeed: null, mbaSummaryForLlm: '' };
  }

  const allItems = mbaEngine.getAllItems();
  const seed = findSeedItem(q);

  // No MBA seed: catalog synonyms (e.g. "Italy" → Rome, Florence), substring matches, then MBA-only destinations
  if (!seed) {
    const fromSynonyms = catalogSynonymSuggestions(lower);
    if (fromSynonyms?.length) {
      return {
        suggestions: fromSynonyms,
        marketBasket: [],
        matchedSeed: null,
        mbaSummaryForLlm: '',
      };
    }

    const fromCatalog = catalogSubstringMatches(lower);
    if (fromCatalog.length > 0) {
      return {
        suggestions: fromCatalog,
        marketBasket: [],
        matchedSeed: null,
        mbaSummaryForLlm: '',
      };
    }

    const destMatches = allItems
      .filter((i) => i.category === 'destination' && destinationMatchesQuery(i, lower))
      .slice(0, 10);
    return {
      suggestions: destMatches.map((d, idx) => ({
        id: d.id,
        text: d.name,
        type: 'destination' as const,
        subtitle: d.tags.slice(0, 4).join(' • '),
        popularity: Math.max(55, 90 - idx * 4),
      })),
      marketBasket: [],
      matchedSeed: null,
      mbaSummaryForLlm: '',
    };
  }

  const context: MBAItem[] = [seed];
  const seen = new Set<string>([seed.id]);
  const suggestions: MbaSearchSuggestionDTO[] = [];

  // Primary row: the matched place or activity
  suggestions.push({
    id: seed.id,
    text: seed.name,
    type: seed.category === 'destination' ? 'destination' : 'activity',
    subtitle: seed.tags.join(' • '),
    popularity: 98,
  });

  const rules = mbaEngine.getTopRulesContainingItems([seed.id], 12);
  const mbaSummaryForLlm = rules
    .slice(0, 4)
    .map(
      (r) =>
        `${[...r.antecedent, ...r.consequent].map((x) => x.name).join(' + ')} (conf ${(r.confidence * 100).toFixed(0)}%)`
    )
    .join(' · ');

  type Scored = { item: MBAItem; confidence: number; lift: number };
  const scored: Scored[] = [];
  for (const r of rules) {
    for (const it of [...r.antecedent, ...r.consequent]) {
      if (it.id === seed.id || isExcluded(it)) continue;
      if (it.category !== 'destination' && it.category !== 'activity') continue;
      scored.push({ item: it, confidence: r.confidence, lift: r.lift });
    }
  }
  scored.sort((a, b) => b.confidence * b.lift - a.confidence * a.lift);

  for (const { item, confidence, lift } of scored) {
    if (suggestions.length >= 9) break;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    const pct = Math.round(confidence * 100);
    suggestions.push({
      id: item.id,
      text: item.name,
      type: item.category === 'destination' ? 'destination' : 'activity',
      subtitle: `MBA: linked with ${seed.name} · ${pct}% confidence, lift ${lift.toFixed(2)}`,
      popularity: Math.min(96, pct + 20),
    });
  }

  const recs = mbaEngine.getRecommendations(context, 25).filter((i) => !isExcluded(i) && (i.category === 'destination' || i.category === 'activity'));
  for (const item of recs) {
    if (suggestions.length >= 10) break;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    suggestions.push({
      id: item.id,
      text: item.name,
      type: item.category === 'destination' ? 'destination' : 'activity',
      subtitle: `MBA: frequently co-selected with ${seed.name}`,
      popularity: 72,
    });
  }

  const bundles = mbaEngine.getBundleRecommendations(context);
  const fromBundles = bundles
    .flat()
    .filter((i) => i.category === 'destination' && i.id !== seed.id && !seen.has(i.id));

  const marketBasket: MbaSearchSuggestionDTO[] = fromBundles.slice(0, 6).map((d, idx) => ({
    id: d.id,
    text: d.name,
    type: 'destination' as const,
    subtitle: `MBA bundle: often in same traveller basket as ${seed.name}`,
    popularity: 80 - idx * 5,
  }));

  return { suggestions, marketBasket, matchedSeed: seed, mbaSummaryForLlm };
}
