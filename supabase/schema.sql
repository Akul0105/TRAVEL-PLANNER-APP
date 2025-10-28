-- =====================================================
-- MARKET BASKET ANALYSIS DATABASE SCHEMA
-- Supabase PostgreSQL Schema for Travel Planner MBA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PRODUCTS TABLE (Destinations, Activities, Services)
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'mauritius', 'snorkeling'
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'destination', 'activity', 'accommodation', 'transportation', 'service'
    price DECIMAL(10, 2) NOT NULL,
    tags TEXT[], -- Array of tags like ['beach', 'luxury', 'tropical']
    description TEXT,
    image_url VARCHAR(500),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(active);

-- =====================================================
-- 2. CUSTOMERS TABLE
-- =====================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    customer_segment VARCHAR(100), -- 'luxury-travelers', 'budget-travelers', 'adventure-seekers', 'cultural-explorers'
    date_of_birth DATE,
    address TEXT,
    preferences JSONB, -- Store user preferences as JSON
    total_spent DECIMAL(10, 2) DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_segment ON customers(customer_segment);
CREATE INDEX idx_customers_email ON customers(email);

-- =====================================================
-- 3. TRANSACTIONS TABLE (Market Basket Transactions)
-- =====================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'cancelled', 'pending'
    payment_method VARCHAR(50),
    booking_reference VARCHAR(100) UNIQUE,
    season VARCHAR(20), -- 'Summer', 'Winter', 'Spring', 'Fall'
    month INTEGER, -- 1-12
    year INTEGER,
    region VARCHAR(100), -- Origin region/country
    destination_country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_season ON transactions(season);
CREATE INDEX idx_transactions_month ON transactions(month);
CREATE INDEX idx_transactions_year ON transactions(year);
CREATE INDEX idx_transactions_status ON transactions(status);

-- =====================================================
-- 4. TRANSACTION ITEMS (Many-to-Many relationship)
-- =====================================================
CREATE TABLE transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_product ON transaction_items(product_id);

-- =====================================================
-- 5. MBA ASSOCIATION RULES (Pre-computed)
-- =====================================================
CREATE TABLE mba_association_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    antecedent_ids TEXT[] NOT NULL, -- Array of product IDs
    consequent_ids TEXT[] NOT NULL, -- Array of product IDs
    support DECIMAL(10, 6) NOT NULL, -- Frequency of the rule
    confidence DECIMAL(10, 6) NOT NULL, -- Probability of consequent given antecedent
    lift DECIMAL(10, 6) NOT NULL, -- How much more likely consequent is given antecedent
    conviction DECIMAL(10, 6), -- How much antecedent alone would lead to consequent
    rule_strength VARCHAR(20), -- 'high', 'medium', 'low'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_association_rules_support ON mba_association_rules(support DESC);
CREATE INDEX idx_association_rules_confidence ON mba_association_rules(confidence DESC);
CREATE INDEX idx_association_rules_lift ON mba_association_rules(lift DESC);

-- =====================================================
-- 6. MBA SEQUENTIAL PATTERNS
-- =====================================================
CREATE TABLE mba_sequential_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sequence_ids TEXT[] NOT NULL, -- Array of product IDs in order
    frequency INTEGER NOT NULL,
    support DECIMAL(10, 6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sequential_patterns_support ON mba_sequential_patterns(support DESC);

-- =====================================================
-- 7. MBA CUSTOMER SEGMENTS
-- =====================================================
CREATE TABLE mba_customer_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_id VARCHAR(100) UNIQUE NOT NULL, -- 'luxury-travelers', 'budget-travelers', etc.
    name VARCHAR(255) NOT NULL,
    characteristics TEXT[] NOT NULL,
    avg_spend DECIMAL(10, 2) NOT NULL,
    size INTEGER NOT NULL,
    growth_rate DECIMAL(5, 4), -- Growth percentage
    satisfaction_rate DECIMAL(5, 4), -- Satisfaction percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customer_segments_id ON mba_customer_segments(segment_id);

-- =====================================================
-- 8. MBA SEASONAL RULES
-- =====================================================
CREATE TABLE mba_seasonal_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season VARCHAR(20) NOT NULL, -- 'Summer', 'Winter', 'Spring', 'Fall'
    month INTEGER NOT NULL, -- 1-12
    rule_id UUID REFERENCES mba_association_rules(id) ON DELETE CASCADE,
    demand_multiplier DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_seasonal_rules_season ON mba_seasonal_rules(season);
CREATE INDEX idx_seasonal_rules_month ON mba_seasonal_rules(month);

-- =====================================================
-- 9. MBA GEOGRAPHIC RULES
-- =====================================================
CREATE TABLE mba_geo_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    rule_id UUID REFERENCES mba_association_rules(id) ON DELETE CASCADE,
    cultural_factors TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_geo_rules_region ON mba_geo_rules(region);
CREATE INDEX idx_geo_rules_country ON mba_geo_rules(country);

-- =====================================================
-- 10. MBA ANALYTICS SNAPSHOT (Summary data)
-- =====================================================
CREATE TABLE mba_analytics_snapshot (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_date DATE NOT NULL,
    total_rules INTEGER NOT NULL,
    total_sequences INTEGER NOT NULL,
    total_segments INTEGER NOT NULL,
    avg_confidence DECIMAL(10, 6) NOT NULL,
    avg_lift DECIMAL(10, 6) NOT NULL,
    top_categories JSONB, -- Store top categories data
    seasonal_insights JSONB, -- Store seasonal insights
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_snapshot_date ON mba_analytics_snapshot(snapshot_date DESC);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Customer Transaction Summary
CREATE VIEW customer_transaction_summary AS
SELECT 
    c.id as customer_id,
    c.email,
    c.name,
    c.customer_segment,
    COUNT(t.id) as total_transactions,
    SUM(t.total_amount) as total_spent,
    AVG(t.total_amount) as avg_transaction_value,
    MAX(t.transaction_date) as last_transaction_date
FROM customers c
LEFT JOIN transactions t ON c.id = t.customer_id
WHERE t.status = 'completed'
GROUP BY c.id, c.email, c.name, c.customer_segment;

-- View: Product Popularity
CREATE VIEW product_popularity AS
SELECT 
    p.id,
    p.product_id,
    p.name,
    p.category,
    p.price,
    COUNT(ti.id) as times_booked,
    SUM(ti.quantity) as total_quantity,
    SUM(ti.subtotal) as total_revenue
FROM products p
LEFT JOIN transaction_items ti ON p.id = ti.product_id
GROUP BY p.id, p.product_id, p.name, p.category, p.price
ORDER BY times_booked DESC;

-- View: Top Association Rules
CREATE VIEW top_association_rules AS
SELECT 
    ar.id,
    ar.antecedent_ids,
    ar.consequent_ids,
    ar.support,
    ar.confidence,
    ar.lift,
    ar.rule_strength
FROM mba_association_rules ar
WHERE ar.lift > 1.5 AND ar.confidence > 0.3
ORDER BY ar.lift DESC
LIMIT 100;

-- =====================================================
-- FUNCTIONS FOR MBA CALCULATIONS
-- =====================================================

-- Function: Calculate Support (how often items appear together)
CREATE OR REPLACE FUNCTION calculate_support(product_ids TEXT[])
RETURNS DECIMAL AS $$
DECLARE
    total_transactions INTEGER;
    matching_transactions INTEGER;
BEGIN
    -- Get total number of transactions
    SELECT COUNT(DISTINCT transaction_id) INTO total_transactions
    FROM transaction_items;
    
    -- Get transactions containing all specified products
    SELECT COUNT(DISTINCT ti.transaction_id) INTO matching_transactions
    FROM transaction_items ti
    WHERE ti.product_id = ANY(
        SELECT id::TEXT FROM products WHERE product_id = ANY(product_ids)
    )
    GROUP BY ti.transaction_id
    HAVING COUNT(DISTINCT ti.product_id) = array_length(product_ids, 1);
    
    RETURN matching_transactions::DECIMAL / NULLIF(total_transactions, 0);
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate Confidence
CREATE OR REPLACE FUNCTION calculate_confidence(antecedent_ids TEXT[], consequent_ids TEXT[])
RETURNS DECIMAL AS $$
DECLARE
    antecedent_support DECIMAL;
    combined_support DECIMAL;
BEGIN
    -- Calculate support for antecedent
    SELECT calculate_support(antecedent_ids) INTO antecedent_support;
    
    -- Calculate support for antecedent + consequent together
    SELECT calculate_support(antecedent_ids || consequent_ids) INTO combined_support;
    
    RETURN combined_support / NULLIF(antecedent_support, 0);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample products
INSERT INTO products (product_id, name, category, price, tags) VALUES
('mauritius', 'Mauritius', 'destination', 1200.00, ARRAY['beach', 'luxury', 'tropical']),
('paris', 'Paris', 'destination', 800.00, ARRAY['city', 'culture', 'romantic']),
('tokyo', 'Tokyo', 'destination', 1100.00, ARRAY['city', 'technology', 'culture']),
('bali', 'Bali', 'destination', 600.00, ARRAY['beach', 'spiritual', 'wellness']),
('dubai', 'Dubai', 'destination', 1500.00, ARRAY['luxury', 'modern', 'desert']),
('london', 'London', 'destination', 900.00, ARRAY['city', 'history', 'culture']),
('snorkeling', 'Snorkeling', 'activity', 80.00, ARRAY['water', 'adventure', 'nature']),
('spa', 'Spa Treatment', 'activity', 120.00, ARRAY['wellness', 'relaxation', 'luxury']),
('museum', 'Museum Tour', 'activity', 25.00, ARRAY['culture', 'education', 'indoor']),
('hiking', 'Hiking', 'activity', 60.00, ARRAY['nature', 'adventure', 'outdoor']),
('cooking', 'Cooking Class', 'activity', 90.00, ARRAY['culture', 'food', 'learning']),
('cruise', 'Boat Cruise', 'activity', 150.00, ARRAY['water', 'romantic', 'scenic']),
('luxury-hotel', 'Luxury Hotel', 'accommodation', 300.00, ARRAY['luxury', 'service', 'comfort']),
('boutique-hotel', 'Boutique Hotel', 'accommodation', 150.00, ARRAY['unique', 'charming', 'local']),
('resort', 'Beach Resort', 'accommodation', 200.00, ARRAY['beach', 'all-inclusive', 'relaxation']),
('hostel', 'Hostel', 'accommodation', 40.00, ARRAY['budget', 'social', 'backpacker']),
('flight', 'Flight', 'transportation', 500.00, ARRAY['air', 'international', 'fast']),
('train', 'Train Pass', 'transportation', 200.00, ARRAY['rail', 'scenic', 'comfortable']),
('car-rental', 'Car Rental', 'transportation', 80.00, ARRAY['flexible', 'independent', 'road-trip']),
('airport-transfer', 'Airport Transfer', 'transportation', 50.00, ARRAY['convenient', 'private', 'door-to-door']),
('travel-insurance', 'Travel Insurance', 'service', 30.00, ARRAY['protection', 'peace-of-mind', 'essential']),
('visa-service', 'Visa Service', 'service', 100.00, ARRAY['documentation', 'official', 'required']),
('guide', 'Private Guide', 'service', 200.00, ARRAY['local', 'expert', 'personalized']),
('photography', 'Photography Service', 'service', 150.00, ARRAY['memories', 'professional', 'special']);

-- Insert sample customer segments
INSERT INTO mba_customer_segments (segment_id, name, characteristics, avg_spend, size, growth_rate, satisfaction_rate) VALUES
('luxury-travelers', 'Luxury Travelers', ARRAY['high-budget', 'premium-services', 'exclusive-experiences'], 3000.00, 150, 0.15, 0.94),
('budget-travelers', 'Budget Travelers', ARRAY['cost-conscious', 'value-seeking', 'backpacker-style'], 800.00, 300, 0.08, 0.87),
('adventure-seekers', 'Adventure Seekers', ARRAY['outdoor-activities', 'nature-focused', 'active-lifestyle'], 1200.00, 200, 0.12, 0.91),
('cultural-explorers', 'Cultural Explorers', ARRAY['history-interested', 'museum-lovers', 'local-experiences'], 1000.00, 250, 0.10, 0.89);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE products IS 'Master catalog of all travel products (destinations, activities, accommodations, etc.)';
COMMENT ON TABLE customers IS 'Customer information and segmentation data';
COMMENT ON TABLE transactions IS 'Travel bookings/transactions';
COMMENT ON TABLE transaction_items IS 'Items purchased in each transaction (market basket)';
COMMENT ON TABLE mba_association_rules IS 'Pre-computed MBA association rules (X -> Y patterns)';
COMMENT ON TABLE mba_sequential_patterns IS 'Sequential purchase patterns over time';
COMMENT ON TABLE mba_customer_segments IS 'Customer segmentation data';
COMMENT ON TABLE mba_seasonal_rules IS 'Seasonal purchase patterns';
COMMENT ON TABLE mba_geo_rules IS 'Geographic-specific purchase patterns';
COMMENT ON TABLE mba_analytics_snapshot IS 'Daily snapshot of MBA analytics for dashboard';

-- =====================================================
-- DONE!
-- =====================================================

