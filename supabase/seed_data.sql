-- =====================================================
-- SAMPLE DATA FOR MBA TESTING
-- Run this after schema.sql to populate with test data
-- =====================================================

-- First, let's create some sample customers
INSERT INTO customers (email, name, customer_segment, preferences) VALUES
('john.luxury@example.com', 'John Smith', 'luxury-travelers', '{"budget": "high", "amenities": ["spa", "private-guide"], "destinations": ["mauritius", "dubai"]}'),
('sarah.budget@example.com', 'Sarah Johnson', 'budget-travelers', '{"budget": "low", "amenities": ["hostel"], "destinations": ["bali", "tokyo"]}'),
('mike.adventure@example.com', 'Mike Wilson', 'adventure-seekers', '{"budget": "medium", "amenities": ["hiking", "outdoor"], "destinations": ["bali", "tokyo"]}'),
('emma.culture@example.com', 'Emma Brown', 'cultural-explorers', '{"budget": "medium", "amenities": ["museum", "culture"], "destinations": ["paris", "london"]}'),
('david.luxury@example.com', 'David Lee', 'luxury-travelers', '{"budget": "high", "amenities": ["luxury-hotel", "spa"], "destinations": ["mauritius", "dubai"]}'),
('lisa.budget@example.com', 'Lisa Garcia', 'budget-travelers', '{"budget": "low", "amenities": ["hostel"], "destinations": ["bali"]}'),
('alex.adventure@example.com', 'Alex Martinez', 'adventure-seekers', '{"budget": "medium", "amenities": ["hiking"], "destinations": ["tokyo", "bali"]}'),
('olivia.culture@example.com', 'Olivia Taylor', 'cultural-explorers', '{"budget": "medium", "amenities": ["museum", "cooking"], "destinations": ["paris", "london"]}');

-- Get customer IDs for reference
DO $$
DECLARE
    john_id UUID;
    sarah_id UUID;
    mike_id UUID;
    emma_id UUID;
    david_id UUID;
    lisa_id UUID;
    alex_id UUID;
    olivia_id UUID;
BEGIN
    SELECT id INTO john_id FROM customers WHERE email = 'john.luxury@example.com';
    SELECT id INTO sarah_id FROM customers WHERE email = 'sarah.budget@example.com';
    SELECT id INTO mike_id FROM customers WHERE email = 'mike.adventure@example.com';
    SELECT id INTO emma_id FROM customers WHERE email = 'emma.culture@example.com';
    SELECT id INTO david_id FROM customers WHERE email = 'david.luxury@example.com';
    SELECT id INTO lisa_id FROM customers WHERE email = 'lisa.budget@example.com';
    SELECT id INTO alex_id FROM customers WHERE email = 'alex.adventure@example.com';
    SELECT id INTO olivia_id FROM customers WHERE email = 'olivia.culture@example.com';

    -- Create sample transactions
    -- Luxury travelers booking Mauritius with spa, snorkeling, luxury hotel, flight, insurance
    INSERT INTO transactions (customer_id, transaction_date, total_amount, status, season, month, year, region, destination_country, booking_reference)
    VALUES
    (john_id, NOW() - INTERVAL '30 days', 2010.00, 'completed', 'Summer', 6, 2024, 'Europe', 'Mauritius', 'BK001'),
    (john_id, NOW() - INTERVAL '60 days', 1750.00, 'completed', 'Spring', 3, 2024, 'Europe', 'Dubai', 'BK002'),
    (david_id, NOW() - INTERVAL '45 days', 2200.00, 'completed', 'Summer', 7, 2024, 'Asia', 'Mauritius', 'BK003'),
    (david_id, NOW() - INTERVAL '90 days', 1980.00, 'completed', 'Spring', 4, 2024, 'Europe', 'Mauritius', 'BK004'),
    
    -- Budget travelers booking Bali with hostel, flight, insurance
    (sarah_id, NOW() - INTERVAL '20 days', 730.00, 'completed', 'Summer', 6, 2024, 'Europe', 'Bali', 'BK005'),
    (sarah_id, NOW() - INTERVAL '50 days', 810.00, 'completed', 'Spring', 3, 2024, 'Europe', 'Tokyo', 'BK006'),
    (lisa_id, NOW() - INTERVAL '25 days', 680.00, 'completed', 'Summer', 7, 2024, 'North America', 'Bali', 'BK007'),
    
    -- Adventure seekers booking Tokyo/Bali with hiking, boutique hotel, train
    (mike_id, NOW() - INTERVAL '35 days', 1370.00, 'completed', 'Spring', 3, 2024, 'Europe', 'Tokyo', 'BK008'),
    (mike_id, NOW() - INTERVAL '55 days', 980.00, 'completed', 'Spring', 4, 2024, 'Europe', 'Bali', 'BK009'),
    (alex_id, NOW() - INTERVAL '40 days', 1290.00, 'completed', 'Spring', 3, 2024, 'North America', 'Tokyo', 'BK010'),
    
    -- Cultural explorers booking Paris/London with museum, cooking, boutique hotel, train
    (emma_id, NOW() - INTERVAL '28 days', 1185.00, 'completed', 'Spring', 3, 2024, 'Europe', 'Paris', 'BK011'),
    (emma_id, NOW() - INTERVAL '65 days', 1250.00, 'completed', 'Winter', 12, 2023, 'Europe', 'London', 'BK012'),
    (olivia_id, NOW() - INTERVAL '32 days', 1145.00, 'completed', 'Spring', 4, 2024, 'North America', 'Paris', 'BK013');
END $$;

-- Now add transaction items for each transaction
-- We'll do this by finding transactions and adding appropriate items

-- Function to add transaction items
DO $$
DECLARE
    txn RECORD;
    dest_product_id UUID;
    dest_product_price DECIMAL;
    cust_segment VARCHAR;
BEGIN
    -- For each transaction, add appropriate items based on destination and customer segment
    FOR txn IN SELECT id, customer_id, destination_country, booking_reference FROM transactions LOOP
        
        -- Add destination product
        SELECT id, price INTO dest_product_id, dest_product_price 
        FROM products WHERE product_id = LOWER(txn.destination_country);
        
        IF dest_product_id IS NOT NULL THEN
            INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, subtotal)
            VALUES (txn.id, dest_product_id, 1, dest_product_price, dest_product_price);
        END IF;
        
        -- Get customer segment
        SELECT customer_segment INTO cust_segment FROM customers WHERE id = txn.customer_id;
        
        -- Add items based on customer segment and destination
        IF cust_segment = 'luxury-travelers' THEN
            -- Add flight, luxury hotel, spa, insurance, snorkeling/cruise
            INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, subtotal)
            SELECT txn.id, id, 1, price, price FROM products 
            WHERE product_id IN ('flight', 'luxury-hotel', 'spa', 'travel-insurance', 'snorkeling', 'cruise', 'airport-transfer')
            ORDER BY RANDOM() LIMIT 5;
            
        ELSIF cust_segment = 'budget-travelers' THEN
            -- Add flight, hostel, insurance
            INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, subtotal)
            SELECT txn.id, id, 1, price, price FROM products 
            WHERE product_id IN ('flight', 'hostel', 'travel-insurance')
            ORDER BY RANDOM() LIMIT 3;
            
        ELSIF cust_segment = 'adventure-seekers' THEN
            -- Add train/flight, boutique hotel, hiking, insurance
            INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, subtotal)
            SELECT txn.id, id, 1, price, price FROM products 
            WHERE product_id IN ('train', 'flight', 'boutique-hotel', 'hiking', 'travel-insurance')
            ORDER BY RANDOM() LIMIT 4;
            
        ELSIF cust_segment = 'cultural-explorers' THEN
            -- Add train, boutique hotel, museum, cooking, insurance
            INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, subtotal)
            SELECT txn.id, id, 1, price, price FROM products 
            WHERE product_id IN ('train', 'boutique-hotel', 'museum', 'cooking', 'travel-insurance')
            ORDER BY RANDOM() LIMIT 5;
        END IF;
    END LOOP;
END $$;

-- Generate more random transactions for better MBA data
DO $$
DECLARE
    i INTEGER;
    rand_customer_id UUID;
    rand_season VARCHAR;
    rand_month INTEGER;
    rand_year INTEGER;
    rand_region VARCHAR;
    rand_destination VARCHAR;
    booking_num INTEGER := 100;
BEGIN
    FOR i IN 1..booking_num LOOP
        -- Get random customer
        SELECT id INTO rand_customer_id FROM customers ORDER BY RANDOM() LIMIT 1;
        
        -- Random season/month
        rand_month := (RANDOM() * 12)::INTEGER + 1;
        rand_year := 2024;
        
        CASE 
            WHEN rand_month IN (12, 1, 2) THEN rand_season := 'Winter';
            WHEN rand_month IN (3, 4, 5) THEN rand_season := 'Spring';
            WHEN rand_month IN (6, 7, 8) THEN rand_season := 'Summer';
            ELSE rand_season := 'Fall';
        END CASE;
        
        -- Random region and destination
        rand_region := CASE (RANDOM() * 3)::INTEGER
            WHEN 0 THEN 'Europe'
            WHEN 1 THEN 'North America'
            ELSE 'Asia'
        END;
        
        rand_destination := CASE (RANDOM() * 5)::INTEGER
            WHEN 0 THEN 'Mauritius'
            WHEN 1 THEN 'Paris'
            WHEN 2 THEN 'Tokyo'
            WHEN 3 THEN 'Bali'
            ELSE 'London'
        END;
        
        -- Insert transaction
        INSERT INTO transactions (customer_id, transaction_date, total_amount, status, season, month, year, region, destination_country, booking_reference)
        VALUES (
            rand_customer_id,
            NOW() - (RANDOM() * 90 || ' days')::INTERVAL,
            (RANDOM() * 2000 + 500)::DECIMAL(10,2),
            'completed',
            rand_season,
            rand_month,
            rand_year,
            rand_region,
            rand_destination,
            'BK' || LPAD((booking_num + i)::TEXT, 3, '0')
        );
    END LOOP;
END $$;

-- Add items to generated transactions
DO $$
DECLARE
    txn RECORD;
    product_list TEXT[];
    prod_id UUID;
    prod_price DECIMAL;
BEGIN
    FOR txn IN SELECT id, destination_country FROM transactions WHERE booking_reference LIKE 'BK%' LOOP
        
        -- Add destination
        SELECT id, price INTO prod_id, prod_price FROM products WHERE product_id = LOWER(txn.destination_country);
        IF prod_id IS NOT NULL THEN
            INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, subtotal)
            VALUES (txn.id, prod_id, 1, prod_price, prod_price);
        END IF;
        
        -- Add random activities and services
        SELECT ARRAY_AGG(product_id) INTO product_list FROM products 
        WHERE category IN ('activity', 'accommodation', 'transportation', 'service')
        ORDER BY RANDOM() LIMIT 4;
        
        FOR prod_id, prod_price IN SELECT id, price FROM products WHERE product_id = ANY(product_list) LOOP
            INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, subtotal)
            VALUES (txn.id, prod_id, 1, prod_price, prod_price);
        END LOOP;
    END LOOP;
END $$;

-- Update transaction total amounts based on items
UPDATE transactions t
SET total_amount = (
    SELECT COALESCE(SUM(subtotal), 0)
    FROM transaction_items ti
    WHERE ti.transaction_id = t.id
);

-- Update customer stats
UPDATE customers c
SET total_spent = (
    SELECT COALESCE(SUM(total_amount), 0)
    FROM transactions t
    WHERE t.customer_id = c.id AND t.status = 'completed'
),
total_bookings = (
    SELECT COUNT(*)
    FROM transactions t
    WHERE t.customer_id = c.id AND t.status = 'completed'
);

SELECT 'Seed data inserted successfully!' as status;

