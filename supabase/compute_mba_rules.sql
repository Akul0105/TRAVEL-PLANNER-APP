-- =====================================================
-- MBA RULES COMPUTATION SCRIPT
-- This script computes association rules from transactions
-- Run this periodically (e.g., daily) to update MBA rules
-- =====================================================

-- Clear existing rules
TRUNCATE TABLE mba_association_rules CASCADE;

-- Minimum thresholds for rules
DO $$
DECLARE
    min_support DECIMAL := 0.1; -- Minimum 10% support
    min_confidence DECIMAL := 0.3; -- Minimum 30% confidence
    total_transactions INTEGER;
    rule_count INTEGER := 0;
BEGIN
    -- Get total transactions
    SELECT COUNT(DISTINCT transaction_id) INTO total_transactions FROM transaction_items;
    
    RAISE NOTICE 'Total transactions: %', total_transactions;
    
    -- Generate all possible 2-item rules
    FOR rule_count IN 1..1 LOOP
        WITH product_pairs AS (
            SELECT DISTINCT
                p1.id as product1_id,
                p1.product_id as product1_code,
                p1.name as product1_name,
                p2.id as product2_id,
                p2.product_id as product2_code,
                p2.name as product2_name
            FROM products p1
            CROSS JOIN products p2
            WHERE p1.id < p2.id
        ),
        -- Calculate support for each pair
        pair_stats AS (
            SELECT 
                pp.product1_id,
                pp.product1_code,
                pp.product1_name,
                pp.product2_id,
                pp.product2_code,
                pp.product2_name,
                -- Count transactions with both products
                COUNT(DISTINCT ti1.transaction_id) as both_count,
                -- Count transactions with product1
                (SELECT COUNT(DISTINCT transaction_id) FROM transaction_items WHERE product_id = pp.product1_id) as product1_count,
                -- Count transactions with product2
                (SELECT COUNT(DISTINCT transaction_id) FROM transaction_items WHERE product_id = pp.product2_id) as product2_count
            FROM product_pairs pp
            LEFT JOIN transaction_items ti1 ON ti1.product_id = pp.product1_id
            LEFT JOIN transaction_items ti2 ON ti2.product_id = pp.product2_id AND ti2.transaction_id = ti1.transaction_id
            GROUP BY pp.product1_id, pp.product1_code, pp.product1_name, pp.product2_id, pp.product2_code, pp.product2_name
        ),
        -- Calculate support, confidence, and lift
        rule_stats AS (
            SELECT 
                product1_id,
                product1_code,
                product1_name,
                product2_id,
                product2_code,
                product2_name,
                both_count::DECIMAL / total_transactions as support,
                both_count::DECIMAL / NULLIF(product1_count, 0) as confidence_1_to_2,
                both_count::DECIMAL / NULLIF(product2_count, 0) as confidence_2_to_1,
                product2_count::DECIMAL / total_transactions as expected_2,
                product1_count::DECIMAL / total_transactions as expected_1
            FROM pair_stats
            WHERE both_count > 0
        )
        -- Insert rules that meet thresholds
        INSERT INTO mba_association_rules (
            antecedent_ids,
            consequent_ids,
            support,
            confidence,
            lift,
            conviction,
            rule_strength
        )
        SELECT 
            ARRAY[product1_code],
            ARRAY[product2_code],
            support,
            confidence_1_to_2,
            confidence_1_to_2 / NULLIF(expected_2, 0) as lift,
            (1 - expected_2) / NULLIF(1 - confidence_1_to_2, 0) as conviction,
            CASE 
                WHEN confidence_1_to_2 / NULLIF(expected_2, 0) > 2 THEN 'high'
                WHEN confidence_1_to_2 / NULLIF(expected_2, 0) > 1.5 THEN 'medium'
                ELSE 'low'
            END
        FROM rule_stats
        WHERE support >= min_support 
        AND confidence_1_to_2 >= min_confidence
        UNION ALL
        SELECT 
            ARRAY[product2_code],
            ARRAY[product1_code],
            support,
            confidence_2_to_1,
            confidence_2_to_1 / NULLIF(expected_1, 0) as lift,
            (1 - expected_1) / NULLIF(1 - confidence_2_to_1, 0) as conviction,
            CASE 
                WHEN confidence_2_to_1 / NULLIF(expected_1, 0) > 2 THEN 'high'
                WHEN confidence_2_to_1 / NULLIF(expected_1, 0) > 1.5 THEN 'medium'
                ELSE 'low'
            END
        FROM rule_stats
        WHERE support >= min_support 
        AND confidence_2_to_1 >= min_confidence;
        
        RAISE NOTICE 'Rules computed: %', (SELECT COUNT(*) FROM mba_association_rules);
    END LOOP;
END $$;

-- Link seasonal rules
INSERT INTO mba_seasonal_rules (season, month, rule_id, demand_multiplier)
SELECT 
    t.season,
    t.month,
    ar.id,
    CASE t.season
        WHEN 'Summer' THEN 1.5
        WHEN 'Winter' THEN 1.3
        WHEN 'Spring' THEN 1.2
        ELSE 1.1
    END as demand_multiplier
FROM mba_association_rules ar
CROSS JOIN LATERAL (
    SELECT DISTINCT season, month FROM transactions WHERE season IS NOT NULL
) t
ON CONFLICT DO NOTHING;

-- Link geo rules
INSERT INTO mba_geo_rules (region, country, rule_id, cultural_factors)
SELECT 
    t.region,
    t.destination_country,
    ar.id,
    CASE t.region
        WHEN 'Europe' THEN ARRAY['wine-culture', 'art-appreciation', 'romantic-traditions']
        WHEN 'Asia' THEN ARRAY['technology-focus', 'traditional-culture', 'efficiency-preference']
        WHEN 'Oceania' THEN ARRAY['beach-culture', 'luxury-preference', 'water-activities']
        ELSE ARRAY['diverse-culture', 'food-appreciation']
    END as cultural_factors
FROM mba_association_rules ar
CROSS JOIN LATERAL (
    SELECT DISTINCT region, destination_country FROM transactions WHERE region IS NOT NULL
) t
ON CONFLICT DO NOTHING;

-- Create analytics snapshot
INSERT INTO mba_analytics_snapshot (
    snapshot_date,
    total_rules,
    total_sequences,
    total_segments,
    avg_confidence,
    avg_lift,
    top_categories,
    seasonal_insights
)
SELECT 
    CURRENT_DATE,
    (SELECT COUNT(*) FROM mba_association_rules),
    (SELECT COUNT(*) FROM mba_sequential_patterns),
    (SELECT COUNT(*) FROM mba_customer_segments),
    (SELECT AVG(confidence) FROM mba_association_rules),
    (SELECT AVG(lift) FROM mba_association_rules),
    (
        SELECT jsonb_agg(jsonb_build_object(
            'category', category,
            'count', count,
            'avgPrice', avg_price
        ))
        FROM (
            SELECT 
                category,
                COUNT(*) as count,
                AVG(price) as avg_price
            FROM products
            GROUP BY category
            ORDER BY count DESC
            LIMIT 5
        ) top_cats
    ),
    (
        SELECT jsonb_agg(seasonal_data)
        FROM (
            SELECT 
                jsonb_build_object(
                    'season', season,
                    'month', month,
                    'demandMultiplier', AVG(demand_multiplier),
                    'ruleCount', COUNT(*)
                ) as seasonal_data
            FROM mba_seasonal_rules
            GROUP BY season, month
        ) seasonal_summary
    );

SELECT 'MBA rules computed successfully!' as status;
SELECT COUNT(*) as total_rules FROM mba_association_rules;
SELECT COUNT(*) as seasonal_rules FROM mba_seasonal_rules;
SELECT COUNT(*) as geo_rules FROM mba_geo_rules;

