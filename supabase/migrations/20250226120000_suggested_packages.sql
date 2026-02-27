-- =====================================================
-- LLM-GENERATED SUGGESTED TRAVEL PACKAGES
-- Run after 20250224100000_scrapbook_and_chat.sql
-- =====================================================

CREATE TABLE IF NOT EXISTS public.suggested_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  hotel TEXT NOT NULL,
  activities JSONB NOT NULL DEFAULT '[]',  -- array of activity name strings
  why_recommended TEXT,
  mba_summary TEXT,  -- optional: e.g. "Tokyo, Hiking, Beach Resort (MBA confidence 85%)"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suggested_packages_user ON public.suggested_packages(user_id);
CREATE INDEX IF NOT EXISTS idx_suggested_packages_created ON public.suggested_packages(created_at DESC);

ALTER TABLE public.suggested_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own suggested packages"
  ON public.suggested_packages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own suggested packages"
  ON public.suggested_packages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own suggested packages"
  ON public.suggested_packages FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.suggested_packages IS 'LLM-generated travel packages (destination, hotel, activities, why recommended) from user profile + MBA context';
