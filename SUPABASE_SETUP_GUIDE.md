# Supabase Setup Guide for Travel Planner MBA

## ✅ What's Already Done

1. ✅ SQL schema created (`supabase/schema.sql`)
2. ✅ Seed data script created (`supabase/seed_data.sql`)
3. ✅ MBA computation script created (`supabase/compute_mba_rules.sql`)
4. ✅ Supabase client installed (`@supabase/supabase-js`)
5. ✅ Environment variables configured (`.env.local`)
6. ✅ API routes created for MBA data

## 📋 Next Steps

### 1. Update Database Password in `.env.local`

Open `.env.local` and replace `[YOUR_PASSWORD]` with your actual Supabase database password:

```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.wyqcskxyzjkecnemvoxz.supabase.co:5432/postgres
```

To get/change your password:
- Go to Supabase Dashboard → Settings → Database
- Reset your database password if needed

### 2. Run SQL Scripts in Supabase

Go to **Supabase Dashboard → SQL Editor** and run these in order:

#### Step 1: Create Schema
1. Click "New Query"
2. Copy entire contents of `supabase/schema.sql`
3. Paste and run
4. Should see "Success. No rows returned"

#### Step 2: Seed Data
1. Create new query
2. Copy entire contents of `supabase/seed_data.sql`
3. Paste and run
4. Should see "Seed data inserted successfully!"

#### Step 3: Compute MBA Rules
1. Create new query
2. Copy entire contents of `supabase/compute_mba_rules.sql`
3. Paste and run
4. Should see counts of rules

### 3. Verify Data

Run these queries in Supabase SQL Editor:

```sql
-- Check products
SELECT COUNT(*) FROM products;

-- Check transactions
SELECT COUNT(*) FROM transactions;

-- Check MBA rules
SELECT COUNT(*) FROM mba_association_rules;

-- Check analytics snapshot
SELECT * FROM mba_analytics_snapshot ORDER BY snapshot_date DESC LIMIT 1;
```

### 4. Test API Endpoints

Start your Next.js dev server:

```bash
npm run dev
```

Test these endpoints:

- **Analytics**: http://localhost:3000/api/mba/analytics
- **Top Rules**: http://localhost:3000/api/mba/rules?limit=10
- **Segments**: http://localhost:3000/api/mba/segments
- **Seasonal**: http://localhost:3000/api/mba/seasonal

### 5. Update Components to Use Supabase

Currently, your analytics components use mock data from `mbaEngine`. You need to update them to fetch from Supabase.

Example for `MBAAnalyticsDashboard.tsx`:

```typescript
const [analytics, setAnalytics] = useState<any>(null);

useEffect(() => {
  fetch('/api/mba/analytics')
    .then(res => res.json())
    .then(data => setAnalytics(data))
    .catch(err => console.error(err));
}, []);
```

## 🔧 Troubleshooting

### Connection Issues
- Check `.env.local` has correct Supabase URL and anon key
- Verify database password is correct
- Check if IPv4 compatibility is needed (use Session Pooler)

### API Errors
- Check browser console for errors
- Verify tables exist in Supabase
- Check Supabase logs in dashboard

### Data Not Showing
- Ensure you ran all 3 SQL scripts
- Verify transactions exist: `SELECT COUNT(*) FROM transactions`
- Re-run `compute_mba_rules.sql` if needed

## 📊 Database Structure

Your Supabase database has:

- **`products`** - Travel products catalog
- **`customers`** - Customer information
- **`transactions`** - Booking transactions
- **`transaction_items`** - Items in each transaction
- **`mba_association_rules`** - Pre-computed MBA rules
- **`mba_customer_segments`** - Customer segments
- **`mba_seasonal_rules`** - Seasonal patterns
- **`mba_geo_rules`** - Geographic patterns
- **`mba_analytics_snapshot`** - Daily analytics summary

## 🚀 Next Steps

1. ✅ Set up Supabase database
2. 🔄 Update components to fetch from Supabase APIs
3. 📈 Add real-time updates
4. 🤖 Automate MBA computation (daily cron job)
5. 📧 Add email notifications for insights

## 📚 Resources

- Supabase Docs: https://supabase.com/docs
- SQL Editor: Supabase Dashboard → SQL Editor
- API Docs: Check `/api/mba/*` routes

