/**
 * Currency conversion for display (USD → Mauritian Rupee, MUR).
 * MBA engine and API store prices in USD; we convert to MUR for display.
 */

export const USD_TO_MUR = 45;

/**
 * Convert USD amount to Mauritian Rupees and format for display (e.g. "Rs 3,600").
 */
export function formatPriceInMRU(usd: number): string {
  const mur = Math.round(usd * USD_TO_MUR);
  return `Rs ${mur.toLocaleString()}`;
}
