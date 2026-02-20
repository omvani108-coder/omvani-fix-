
-- Table for user reminder preferences
CREATE TABLE public.reminder_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  channel TEXT NOT NULL DEFAULT 'email', -- 'email', 'whatsapp', 'both'
  reminder_time TIME NOT NULL DEFAULT '06:00:00',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  whatsapp_number TEXT,
  include_shloka BOOLEAN NOT NULL DEFAULT true,
  include_festivals BOOLEAN NOT NULL DEFAULT true,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
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

-- Trigger for updated_at
CREATE TRIGGER update_reminder_preferences_updated_at
BEFORE UPDATE ON public.reminder_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Table to log sent reminders (prevents duplicates)
CREATE TABLE public.reminder_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  content_type TEXT NOT NULL DEFAULT 'shloka'
);

ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminder logs"
ON public.reminder_logs FOR SELECT
USING (auth.uid() = user_id);
