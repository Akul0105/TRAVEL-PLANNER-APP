/**
 * Map search / MBA suggestion clicks to carousel catalog IDs (no /details navigation).
 */
import { DESTINATIONS } from '@/data/destinationsCatalog';

const CATALOG_ID_SET = new Set(DESTINATIONS.map((d) => d.id));

export function isCatalogDestinationId(id: string): boolean {
  return CATALOG_ID_SET.has(id.replace(/^mba-bundle-/, '').toLowerCase());
}

/** Resolve a picked suggestion to a catalog card id, or null (e.g. MBA-only activity). */
export function suggestionToCatalogId(suggestion: { id: string; text: string }): string | null {
  const clean = suggestion.id.replace(/^mba-bundle-/, '').toLowerCase();
  if (CATALOG_ID_SET.has(clean)) return clean;

  const label = suggestion.text.trim().toLowerCase();
  const exact = DESTINATIONS.find((d) => d.name.toLowerCase() === label);
  if (exact) return exact.id;

  const contains = DESTINATIONS.find(
    (d) => label.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(label)
  );
  return contains?.id ?? null;
}
