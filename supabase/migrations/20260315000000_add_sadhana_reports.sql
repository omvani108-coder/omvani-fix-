-- ═══════════════════════════════════════════════════════════════════
-- Sadhana AI Reports — stores AI-generated daily sadhana analysis
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sadhana_reports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  questions           JSONB NOT NULL,           -- [{question, options, answer, isCustom}]
  report              JSONB NOT NULL,           -- {summary, strengths, improvements, progress, recommendation, score}
  consistency_score   INTEGER CHECK (consistency_score BETWEEN 1 AND 10),
  is_free             BOOLEAN DEFAULT false,
  razorpay_payment_id TEXT,
  payment_amount      INTEGER DEFAULT 0,        -- paise (3000 = ₹30)
  payment_status      TEXT DEFAULT 'free' CHECK (payment_status IN ('free','paid','pending')),
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Index for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_sadhana_reports_user_id ON sadhana_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_reports_user_created ON sadhana_reports(user_id, created_at DESC);

-- RLS: users can only read/insert their own reports
ALTER TABLE sadhana_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sadhana reports"
  ON sadhana_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sadhana reports"
  ON sadhana_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access on sadhana_reports"
  ON sadhana_reports FOR ALL
  USING (auth.role() = 'service_role');
