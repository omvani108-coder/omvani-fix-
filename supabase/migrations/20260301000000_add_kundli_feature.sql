-- ═══════════════════════════════════════════════════════════════════════════
-- OmVani — Kundli (birth chart) analysis feature
-- ═══════════════════════════════════════════════════════════════════════════

-- Stores each kundli analysis request and result
CREATE TABLE IF NOT EXISTS public.kundli_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Birth details
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  time_of_birth TIME,                    -- nullable: not everyone knows their exact time
  place_of_birth TEXT NOT NULL,

  -- Analysis
  lens TEXT NOT NULL,                    -- 'love', 'career', 'wealth', 'health', 'future', 'spiritual', 'marriage', 'family'
  result TEXT,                           -- the AI-generated analysis (stored after streaming completes)

  -- Payment
  is_free BOOLEAN NOT NULL DEFAULT false, -- true for the one free lifetime analysis
  razorpay_payment_id TEXT,              -- populated for paid analyses
  payment_amount INTEGER,                -- amount in paise (6000 = ₹60, 2000 = ₹20)
  payment_status TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'free'

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kundli_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own kundli analyses"
  ON public.kundli_analyses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kundli analyses"
  ON public.kundli_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kundli analyses"
  ON public.kundli_analyses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage kundli_analyses"
  ON public.kundli_analyses FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Helper function: has user used their free kundli analysis?
CREATE OR REPLACE FUNCTION public.has_used_free_kundli(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.kundli_analyses
    WHERE user_id = p_user_id AND is_free = true
  );
$$;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_kundli_analyses_user_id ON public.kundli_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_kundli_analyses_payment_status ON public.kundli_analyses(payment_status);

-- Reuse the existing updated_at trigger
CREATE TRIGGER update_kundli_analyses_updated_at
  BEFORE UPDATE ON public.kundli_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
