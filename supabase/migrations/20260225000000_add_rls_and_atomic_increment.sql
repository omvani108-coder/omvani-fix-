-- ============================================================================
-- Migration: Add RLS to unprotected tables + atomic usage increment function
-- Safe to re-run: drops existing policies before recreating
-- ============================================================================

-- ── 1. Enable RLS on subscriptions ──────────────────────────────────────────
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 2. Enable RLS on usage_logs ─────────────────────────────────────────────
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own usage" ON public.usage_logs;
CREATE POLICY "Users can view own usage"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage usage_logs" ON public.usage_logs;
CREATE POLICY "Service role can manage usage_logs"
  ON public.usage_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 3. Enable RLS on reminder_preferences ───────────────────────────────────
ALTER TABLE public.reminder_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reminder preferences" ON public.reminder_preferences;
CREATE POLICY "Users can view own reminder preferences"
  ON public.reminder_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reminder preferences" ON public.reminder_preferences;
CREATE POLICY "Users can insert own reminder preferences"
  ON public.reminder_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reminder preferences" ON public.reminder_preferences;
CREATE POLICY "Users can update own reminder preferences"
  ON public.reminder_preferences FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage reminder_preferences" ON public.reminder_preferences;
CREATE POLICY "Service role can manage reminder_preferences"
  ON public.reminder_preferences FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 4. Enable RLS on reminder_logs ──────────────────────────────────────────
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reminder logs" ON public.reminder_logs;
CREATE POLICY "Users can view own reminder logs"
  ON public.reminder_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage reminder_logs" ON public.reminder_logs;
CREATE POLICY "Service role can manage reminder_logs"
  ON public.reminder_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 5. Atomic increment_usage function (prevents race conditions) ───────────
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id  UUID,
  p_feature  TEXT,
  p_date_ist TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usage_logs (user_id, feature, date_ist, count, updated_at)
  VALUES (p_user_id, p_feature, p_date_ist, 1, now())
  ON CONFLICT (user_id, feature, date_ist)
  DO UPDATE SET
    count = usage_logs.count + 1,
    updated_at = now();
END;
$$;
