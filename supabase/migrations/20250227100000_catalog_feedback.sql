-- Catalog feedback: likes, dislikes, and clicks for catalog items (used for MBA bundle personalization)
CREATE TABLE IF NOT EXISTS public.catalog_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'destination',
  action TEXT NOT NULL CHECK (action IN ('like', 'dislike', 'click')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_catalog_feedback_user ON public.catalog_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_catalog_feedback_item ON public.catalog_feedback(item_id, item_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_catalog_feedback_user_item_like ON public.catalog_feedback(user_id, item_id, item_type)
  WHERE action IN ('like', 'dislike');

ALTER TABLE public.catalog_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own catalog feedback"
  ON public.catalog_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own catalog feedback"
  ON public.catalog_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own catalog feedback"
  ON public.catalog_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own catalog feedback"
  ON public.catalog_feedback FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.catalog_feedback IS 'User likes, dislikes, and clicks on catalog items; used to personalize MBA bundles';
