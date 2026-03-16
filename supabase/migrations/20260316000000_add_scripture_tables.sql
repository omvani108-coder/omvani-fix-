-- ═══════════════════════════════════════════════════════════════════════════
-- OmVani — Scripture Tables Migration
-- Moves scripture content from hardcoded .ts files into Supabase DB
-- Supports: Gita, Upanishads, Yoga Sutras, + 7 new scriptures
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. scriptures (master list) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.scriptures (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  name_sanskrit   TEXT,
  tradition       TEXT,
  category        TEXT NOT NULL DEFAULT 'stotra',
  total_verses    INTEGER DEFAULT 0,
  total_chapters  INTEGER DEFAULT 1,
  summary         TEXT,
  cover_gradient  TEXT DEFAULT 'from-saffron/20 to-gold/10',
  accent_color    TEXT DEFAULT 'hsl(28,90%,55%)',
  is_free         BOOLEAN DEFAULT false,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. scripture_chapters (sections within each scripture) ──────────────────
CREATE TABLE IF NOT EXISTS public.scripture_chapters (
  id              TEXT PRIMARY KEY,
  scripture_id    TEXT NOT NULL REFERENCES public.scriptures(id) ON DELETE CASCADE,
  number          INTEGER NOT NULL,
  title           TEXT NOT NULL,
  subtitle        TEXT,
  summary         TEXT,
  total_verses    INTEGER DEFAULT 0,
  is_free         BOOLEAN DEFAULT false,
  sort_order      INTEGER DEFAULT 0
);

-- ── 3. scripture_verses (the actual content) ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.scripture_verses (
  id              TEXT PRIMARY KEY,
  scripture_id    TEXT NOT NULL REFERENCES public.scriptures(id) ON DELETE CASCADE,
  chapter_id      TEXT NOT NULL REFERENCES public.scripture_chapters(id) ON DELETE CASCADE,
  verse_number    INTEGER NOT NULL,
  sanskrit        TEXT NOT NULL,
  transliteration TEXT,
  meaning         TEXT NOT NULL,
  word_meanings   TEXT,
  is_key_verse    BOOLEAN DEFAULT false,
  sort_order      INTEGER DEFAULT 0
);

-- ── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_scripture_verses_chapter ON public.scripture_verses(chapter_id, sort_order);
CREATE INDEX idx_scripture_chapters_scripture ON public.scripture_chapters(scripture_id, sort_order);
CREATE INDEX idx_scripture_verses_scripture ON public.scripture_verses(scripture_id);
CREATE INDEX idx_scripture_verses_search ON public.scripture_verses
  USING GIN(to_tsvector('english', meaning));

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.scriptures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripture_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripture_verses ENABLE ROW LEVEL SECURITY;

-- Public read access (scripture content is not user-specific)
CREATE POLICY "Anyone can read scriptures"
  ON public.scriptures FOR SELECT USING (true);
CREATE POLICY "Anyone can read scripture chapters"
  ON public.scripture_chapters FOR SELECT USING (true);
CREATE POLICY "Anyone can read scripture verses"
  ON public.scripture_verses FOR SELECT USING (true);

-- Service role write access (for seeding via CLI/migration)
CREATE POLICY "Service role manages scriptures"
  ON public.scriptures FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role manages scripture chapters"
  ON public.scripture_chapters FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role manages scripture verses"
  ON public.scripture_verses FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
