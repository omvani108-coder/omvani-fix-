-- ============================================================================
-- Migration: Add RLS to unprotected tables + atomic usage increment function
-- ============================================================================

-- ── 1. Enable RLS on subscriptions ──────────────────────────────────────────
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service_role (edge functions / webhooks) can insert/update subscriptions
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 2. Enable RLS on usage_logs ─────────────────────────────────────────────
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Only service_role can insert/update usage (edge functions do the counting)
CREATE POLICY "Service role can manage usage_logs"
  ON public.usage_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 3. Enable RLS on reminder_preferences ───────────────────────────────────
ALTER TABLE public.reminder_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminder preferences"
  ON public.reminder_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminder preferences"
  ON public.reminder_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminder preferences"
  ON public.reminder_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role also needs access (send-reminders function)
CREATE POLICY "Service role can manage reminder_preferences"
  ON public.reminder_preferences FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 4. Enable RLS on reminder_logs ──────────────────────────────────────────
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminder logs"
  ON public.reminder_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Only service_role can insert reminder logs (send-reminders function)
CREATE POLICY "Service role can manage reminder_logs"
  ON public.reminder_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 5. Atomic increment_usage function (prevents race conditions) ───────────
-- Uses INSERT ... ON CONFLICT with count + 1 atomically inside Postgres
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
