# Supabase Database Setup for MBA Analytics

This directory contains SQL scripts to set up a complete Market Basket Analysis database in Supabase.

## Files

- **`schema.sql`** - Main database schema with all tables, indexes, views, and functions
- **`seed_data.sql`** - Sample data for testing MBA functionality
- **`compute_mba_rules.sql`** - Script to compute association rules from transactions

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in project details:
   - Name: `travel-planner-mba`
   - Database Password: (save this securely!)
   - Region: Choose closest to you
5. Wait for project to initialize (~2 minutes)

### 2. Run Schema Script

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Wait for completion - you should see "Success. No rows returned"

### 3. Seed Sample Data

1. In SQL Editor, create a new query
2. Copy entire contents of `seed_data.sql`
3. Paste and run
4. Should see "Seed data inserted successfully!"

### 4. Compute MBA Rules

1. Create another new query
2. Copy entire contents of `compute_mba_rules.sql`
3. Paste and run
4. Should see total rules count

### 5. Get Database Connection Info

In Supabase Dashboard:
1. Go to **Settings** → **Database**
2. Find **Connection string** section
3. Copy the **Connection pooling** URI
4. Format: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`

### 6. Environment Variables

Add to your `.env.local`:

```env
# Supabase Database
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_KEY=[YOUR-SERVICE-KEY]

# Database Connection (Direct)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

Get keys from: **Settings** → **API**

## Database Schema Overview

### Core Tables
- **`products`** - Catalog of travel products (destinations, activities, etc.)
- **`customers`** - Customer information and segments
- **`transactions`** - Booking transactions
- **`transaction_items`** - Items in each transaction (market basket)

### MBA Tables
- **`mba_association_rules`** - X → Y patterns (e.g., Mauritius → Snorkeling)
- **`mba_sequential_patterns`** - Purchase sequences over time
- **`mba_customer_segments`** - Customer groups
- **`mba_seasonal_rules`** - Seasonal patterns
- **`mba_geo_rules`** - Geographic patterns
- **`mba_analytics_snapshot`** - Daily analytics summary

### Views
- **`customer_transaction_summary`** - Customer spending summary
- **`product_popularity`** - Most popular products
- **`top_association_rules`** - High-impact rules

## Usage Examples

### Query Top Rules
```sql
SELECT * FROM top_association_rules LIMIT 10;
```

### Get Product Recommendations
```sql
SELECT consequent_ids, confidence, lift 
FROM mba_association_rules 
WHERE 'mauritius' = ANY(antecedent_ids)
ORDER BY lift DESC 
LIMIT 5;
```

### Customer Spending by Segment
```sql
SELECT 
    customer_segment,
    COUNT(*) as customers,
    AVG(total_spent) as avg_spend
FROM customer_transaction_summary
GROUP BY customer_segment;
```

## Automation

### Daily MBA Computation

Set up a cron job or Supabase Edge Function to run `compute_mba_rules.sql` daily:

```sql
-- Run this daily to update MBA rules
\i compute_mba_rules.sql
```

Or use Supabase **Database Webhooks** to trigger computation on new transactions.

## Troubleshooting

### Connection Issues
- Check database password is correct
- Verify IP allowlist in Supabase dashboard
- Use connection pooling for production

### Rule Computation Issues
- Ensure you have transactions in `transaction_items` table
- Check minimum support/confidence thresholds
- Run `compute_mba_rules.sql` manually

### Performance
- Rules computation can take time with large datasets
- Consider running during off-peak hours
- Use `mba_analytics_snapshot` for dashboard queries instead of computing on-the-fly

## Next Steps

1. Connect your Next.js app to Supabase (install `@supabase/supabase-js`)
2. Create API routes to query MBA data
3. Update frontend components to fetch from Supabase
4. Set up scheduled computation jobs
5. Add real-time transaction updates

## Support

- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/

