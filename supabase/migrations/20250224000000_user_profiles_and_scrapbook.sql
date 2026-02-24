-- =====================================================
-- USER PROFILES & SCRAPBOOK (Auth + Scrapbook features)
-- Run this after Supabase Auth is enabled.
-- =====================================================

-- 1. PROFILES (extends auth.users for app-specific data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  address TEXT,
  avatar_url TEXT,
  travel_style TEXT,
  budget_preference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger: create profile on signup (Supabase Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. VISITED DESTINATIONS (user's scrapbook - places they've been)
CREATE TABLE IF NOT EXISTS public.visited_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_name TEXT NOT NULL,
  country TEXT,
  notes TEXT,
  visited_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visited_destinations_user ON public.visited_destinations(user_id);

ALTER TABLE public.visited_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own visited destinations"
  ON public.visited_destinations
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. USER BUNDLES (MBA-generated suggested/personalized bundles per user)
CREATE TABLE IF NOT EXISTS public.user_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bundle_data JSONB NOT NULL,  -- { items: [{ id, name, category, price }], confidence?, lift?, ruleSummary? }
  source TEXT DEFAULT 'mba',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_bundles_user ON public.user_bundles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bundles_created ON public.user_bundles(created_at DESC);

ALTER TABLE public.user_bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bundles"
  ON public.user_bundles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bundles"
  ON public.user_bundles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bundles"
  ON public.user_bundles FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.profiles IS 'User profiles (name, address, preferences) linked to Supabase Auth';
COMMENT ON TABLE public.visited_destinations IS 'Destinations the user has visited - scrapbook';
COMMENT ON TABLE public.user_bundles IS 'MBA-generated personalized/suggested bundles per user';
