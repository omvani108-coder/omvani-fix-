-- ============================================================================
-- Migration: Create missing tables, add RLS, atomic usage increment function
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS throughout
-- ============================================================================

-- ── 0. Create tables that may not exist yet ─────────────────────────────────

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  current_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  date_ist TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, feature, date_ist)
);

CREATE TABLE IF NOT EXISTS public.reminder_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  channel TEXT NOT NULL DEFAULT 'email',
  reminder_time TEXT NOT NULL DEFAULT '06:00:00',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  language TEXT NOT NULL DEFAULT 'en',
  include_shloka BOOLEAN NOT NULL DEFAULT true,
  include_festivals BOOLEAN NOT NULL DEFAULT true,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  content_type TEXT NOT NULL DEFAULT 'shloka',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
