-- =====================================================
-- SCRAPBOOK SECTIONS (activities, food, bucket list) + CHAT PERSISTENCE
-- Run after 20250224000000_user_profiles_and_scrapbook.sql
-- =====================================================

-- 1. Extend profiles with scrapbook preference arrays (JSONB for flexibility)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS activities_liked JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS food_preferences JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS bucket_list JSONB DEFAULT '[]';

COMMENT ON COLUMN public.profiles.activities_liked IS 'Activities the user likes (e.g. hiking, museums) - for MBA context';
COMMENT ON COLUMN public.profiles.food_preferences IS 'Food types the user likes - for MBA context';
COMMENT ON COLUMN public.profiles.bucket_list IS 'Places the user wants to visit - for MBA context';

-- 2. Chat sessions (one per "thread"; clear chat = new session)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON public.chat_sessions(created_at DESC);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat sessions"
  ON public.chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions"
  ON public.chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Chat messages (per session)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only access messages for their own sessions
CREATE POLICY "Users can read own chat messages"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = chat_messages.session_id AND cs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = chat_messages.session_id AND cs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own chat messages"
  ON public.chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = chat_messages.session_id AND cs.user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.chat_sessions IS 'Chat thread per user; clearing chat creates a new session';
COMMENT ON TABLE public.chat_messages IS 'Messages in a chat session; persisted until user starts new chat';
