/**
 * Supabase Client Configuration
 * Replace these with your actual Supabase credentials
 */

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceKey: process.env.SUPABASE_SERVICE_KEY || '', // Server-side only
};

// Example usage (install @supabase/supabase-js first):
/*
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// Server-side client with service key
export const supabaseAdmin = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.serviceKey
);
*/

// Helper functions for MBA queries
export const MBAQueries = {
  // Get top association rules
  getTopRules: (limit: number = 10) => `
    SELECT * FROM top_association_rules 
    LIMIT ${limit}
  `,

  // Get recommendations for a product
  getRecommendations: (productId: string, limit: number = 5) => `
    SELECT consequent_ids, confidence, lift 
    FROM mba_association_rules 
    WHERE '${productId}' = ANY(antecedent_ids)
    ORDER BY lift DESC 
    LIMIT ${limit}
  `,

  // Get analytics snapshot
  getAnalyticsSnapshot: () => `
    SELECT * FROM mba_analytics_snapshot 
    ORDER BY snapshot_date DESC 
    LIMIT 1
  `,

  // Get seasonal rules
  getSeasonalRules: (season?: string) => `
    SELECT sr.*, ar.antecedent_ids, ar.consequent_ids, ar.confidence, ar.lift
    FROM mba_seasonal_rules sr
    JOIN mba_association_rules ar ON sr.rule_id = ar.id
    ${season ? `WHERE sr.season = '${season}'` : ''}
    ORDER BY sr.demand_multiplier DESC
  `,

  // Get customer segments
  getCustomerSegments: () => `
    SELECT * FROM mba_customer_segments
    ORDER BY size DESC
  `,

  // Get product popularity
  getProductPopularity: (limit: number = 20) => `
    SELECT * FROM product_popularity 
    ORDER BY times_booked DESC 
    LIMIT ${limit}
  `,
};

