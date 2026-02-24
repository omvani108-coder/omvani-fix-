-- Add foreign key constraint for reminder_preferences.user_id
ALTER TABLE public.reminder_preferences
  ADD CONSTRAINT reminder_preferences_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
