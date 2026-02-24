import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ReminderPreferences {
  enabled: boolean;
  channel: "email" | "whatsapp" | "both";
  reminder_time: string; // HH:MM
  timezone: string;
  whatsapp_number: string;
  include_shloka: boolean;
  include_festivals: boolean;
  language: string;
}

const DEFAULT_PREFS: ReminderPreferences = {
  enabled: false,
  channel: "email",
  reminder_time: "06:00",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
  whatsapp_number: "",
  include_shloka: true,
  include_festivals: true,
  language: "en",
};

export function useReminderPreferences() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<ReminderPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    (async () => {
      const { data, error } = await supabase
        .from("reminder_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data && !error) {
        setPrefs({
          enabled: data.enabled,
          channel: data.channel as ReminderPreferences["channel"],
          reminder_time: (data.reminder_time || "06:00:00").slice(0, 5),
          timezone: data.timezone || DEFAULT_PREFS.timezone,
          whatsapp_number: data.whatsapp_number || "",
          include_shloka: data.include_shloka,
          include_festivals: data.include_festivals,
          language: data.language || "en",
        });
      }
      setLoading(false);
    })();
  }, [user]);

  const savePrefs = useCallback(async (newPrefs: ReminderPreferences) => {
    if (!user) return false;
    setSaving(true);

    const payload = {
      user_id: user.id,
      enabled: newPrefs.enabled,
      channel: newPrefs.channel,
      reminder_time: newPrefs.reminder_time + ":00",
      timezone: newPrefs.timezone,
      whatsapp_number: newPrefs.whatsapp_number || null,
      include_shloka: newPrefs.include_shloka,
      include_festivals: newPrefs.include_festivals,
      language: newPrefs.language,
    };

    const { error } = await supabase
      .from("reminder_preferences")
      .upsert(payload, { onConflict: "user_id" });

    setSaving(false);
    if (!error) {
      setPrefs(newPrefs);
      return true;
    }
    console.error("Failed to save reminder preferences:", error);
    return false;
  }, [user]);

  return { prefs, loading, saving, savePrefs };
}
