import { useState } from "react";
import { Bell, Clock, MessageSquare, Mail, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReminderPreferences, ReminderPreferences } from "@/hooks/useReminderPreferences";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/useTranslations";

const TIMEZONES = [
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "America/New_York", label: "US Eastern" },
  { value: "America/Chicago", label: "US Central" },
  { value: "America/Los_Angeles", label: "US Pacific" },
  { value: "Europe/London", label: "UK (GMT)" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Australia/Sydney", label: "Australia (AEST)" },
];

export default function ReminderSettings() {
  const { prefs, loading, saving, savePrefs } = useReminderPreferences();
  const { language } = useTranslations();
  const [draft, setDraft] = useState<ReminderPreferences | null>(null);

  const current = draft ?? prefs;

  const update = (patch: Partial<ReminderPreferences>) => {
    setDraft({ ...current, ...patch });
  };

  const handleSave = async () => {
    if (!draft) return;
    const ok = await savePrefs({ ...draft, language });
    if (ok) {
      toast.success("Reminder preferences saved! 🙏");
      setDraft(null);
    } else {
      toast.error("Failed to save preferences. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-4" />
        <div className="h-4 w-full bg-muted rounded mb-2" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
    );
  }

  const hasChanges = draft !== null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Puja Reminders</h3>
            <p className="text-sm text-muted-foreground">Daily shloka & festival alerts</p>
          </div>
        </div>
        <Switch
          checked={current.enabled}
          onCheckedChange={(checked) => update({ enabled: checked })}
        />
      </div>

      {current.enabled && (
        <div className="space-y-5 pt-2">
          {/* Channel */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Delivery Channel</Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "email" as const, icon: Mail, label: "Email" },
                { value: "whatsapp" as const, icon: MessageSquare, label: "WhatsApp" },
                { value: "both" as const, icon: Bell, label: "Both" },
              ]).map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => update({ channel: value })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm transition-all ${
                    current.channel === value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Number */}
          {(current.channel === "whatsapp" || current.channel === "both") && (
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+91 98765 43210"
                value={current.whatsapp_number}
                onChange={(e) => update({ whatsapp_number: e.target.value })}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">Include country code (e.g. +91)</p>
            </div>
          )}

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Reminder Time
              </Label>
              <Input
                type="time"
                value={current.reminder_time}
                onChange={(e) => update({ reminder_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Timezone
              </Label>
              <Select value={current.timezone} onValueChange={(v) => update({ timezone: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content toggles */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Content</Label>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">Daily Shloka (Sanskrit + English)</span>
              <Switch
                checked={current.include_shloka}
                onCheckedChange={(v) => update({ include_shloka: v })}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">Festival Alerts (3-day advance)</span>
              <Switch
                checked={current.include_festivals}
                onCheckedChange={(v) => update({ include_festivals: v })}
              />
            </div>
          </div>

          {/* Save button */}
          {hasChanges && (
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving…" : "Save Preferences"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
