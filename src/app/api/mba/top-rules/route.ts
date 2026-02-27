import { NextResponse } from 'next/server';
import { mbaEngine } from '@/lib/mba/engine';

/**
 * GET /api/mba/top-rules
 * Returns top association rules from the Apriori-style engine with real support, confidence, lift.
 * Formulas: Support = P(A∩B), Confidence = P(B|A) = support(A,B)/support(A), Lift = confidence/support(B).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '5', 10), 20);
    const topRules = mbaEngine.getTopRules(limit);
    const rules = topRules.map((r) => ({
      rule: `IF ${r.antecedent.map((i) => i.name).join(' + ')} → ${r.consequent.map((i) => i.name).join(' + ')}`,
      support: r.support,
      confidence: r.confidence,
      lift: r.lift,
    }));
    return NextResponse.json({
      rules,
      formulas: {
        support: 'Support = (# transactions containing A and B) / total transactions',
        confidence: 'Confidence = P(B|A) = Support(A∪B) / Support(A)',
        lift: 'Lift = Confidence / Support(B) = P(B|A) / P(B)',
      },
    });
  } catch (e) {
    console.error('top-rules error', e);
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}
