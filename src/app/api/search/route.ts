/**
 * Search API — MBA-driven destinations & activities only (no booking spam).
 * Optional Mistral one-liner when MISTRAL_API_KEY is set and a destination matches.
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildMbaSearchSuggestions } from '@/services/mbaSearchService';
import { generateSearchDestinationBlurb } from '@/services/mystralService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body?.query === 'string' ? body.query.trim() : '';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const built = buildMbaSearchSuggestions(query);

    if (
      built.suggestions.length > 0 &&
      built.matchedSeed?.category === 'destination' &&
      process.env.MISTRAL_API_KEY
    ) {
      const blurb = await generateSearchDestinationBlurb(
        built.matchedSeed.name,
        built.matchedSeed.tags,
        built.mbaSummaryForLlm
      );
      if (blurb) {
        built.suggestions[0] = { ...built.suggestions[0], subtitle: blurb };
      }
    }

    const { matchedSeed: _m, mbaSummaryForLlm: _s, ...payload } = built;
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to fetch search suggestions' }, { status: 500 });
  }
}
