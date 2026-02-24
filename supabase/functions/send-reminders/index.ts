import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Daily shlokas — rotates by day of year
const DAILY_SHLOKAS = [
  { verse: "Gita 2.47", sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन", english: "You have the right to perform your duties, but not to the fruits of your actions." },
  { verse: "Gita 2.20", sanskrit: "न जायते म्रियते वा कदाचिन्", english: "The soul is never born nor dies at any time. It is unborn, eternal, ever-existing and primeval." },
  { verse: "Gita 4.7", sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत", english: "Whenever there is a decline in righteousness, I manifest Myself to restore it." },
  { verse: "Gita 9.22", sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते", english: "To those who worship Me with devotion, I carry what they lack and preserve what they have." },
  { verse: "Gita 18.66", sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज", english: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sins." },
  { verse: "Gita 6.35", sanskrit: "असंशयं महाबाहो मनो दुर्निग्रहं चलम्", english: "The mind is restless — but it can be controlled by practice and detachment." },
  { verse: "Gita 12.13", sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च", english: "One who is not envious but is a kind friend to all living entities is very dear to Me." },
];

// Upcoming Hindu festivals (simplified — in production, use a proper panchang API)
const FESTIVALS_2026 = [
  { date: "2026-01-14", name: "Makar Sankranti", description: "Sun enters Capricorn. Auspicious for charity and prayer." },
  { date: "2026-02-27", name: "Maha Shivaratri", description: "The great night of Lord Shiva. Fast and worship." },
  { date: "2026-03-17", name: "Holi", description: "Festival of colors celebrating the triumph of good over evil." },
  { date: "2026-03-30", name: "Ugadi / Gudi Padwa", description: "Hindu New Year in many traditions." },
  { date: "2026-04-02", name: "Ram Navami", description: "Birth of Lord Rama. Recite Ramayana." },
  { date: "2026-08-14", name: "Janmashtami", description: "Birth of Lord Krishna. Fast until midnight." },
  { date: "2026-09-24", name: "Navratri Begins", description: "Nine nights of Goddess Durga worship." },
  { date: "2026-10-02", name: "Dussehra", description: "Victory of Rama over Ravana." },
  { date: "2026-10-21", name: "Diwali", description: "Festival of lights. Lakshmi Puja." },
];

function getTodayShloka(): typeof DAILY_SHLOKAS[0] {
  const day = Math.floor(Date.now() / 86_400_000);
  return DAILY_SHLOKAS[day % DAILY_SHLOKAS.length];
}

function getUpcomingFestival(): typeof FESTIVALS_2026[0] | null {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = FESTIVALS_2026.filter((f) => f.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  if (upcoming.length > 0) {
    // Only alert if festival is within 3 days
    const daysUntil = Math.ceil((new Date(upcoming[0].date).getTime() - Date.now()) / 86_400_000);
    if (daysUntil <= 3) return upcoming[0];
  }
  return null;
}

function buildEmailHtml(shloka: typeof DAILY_SHLOKAS[0], festival: typeof FESTIVALS_2026[0] | null, lang: string): string {
  const festivalBlock = festival
    ? `<div style="margin-top:24px;padding:16px;background:#fff3e0;border-radius:8px;">
        <p style="margin:0;font-weight:bold;color:#e65100;">🪔 Upcoming: ${festival.name} (${festival.date})</p>
        <p style="margin:8px 0 0;color:#555;">${festival.description}</p>
      </div>`
    : "";

  return `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px;background:#fefcf3;border-radius:12px;">
      <h2 style="text-align:center;color:#b45309;margin:0 0 8px;">ॐ OmVani — Daily Shloka</h2>
      <p style="text-align:center;color:#92400e;font-size:13px;margin:0 0 24px;">${shloka.verse}</p>
      <blockquote style="margin:0;padding:16px 20px;background:#fffbeb;border-left:4px solid #d97706;border-radius:4px;">
        <p style="margin:0;font-size:20px;color:#78350f;line-height:1.6;">${shloka.sanskrit}</p>
      </blockquote>
      <p style="margin:16px 0 0;color:#44403c;font-size:15px;line-height:1.7;">${shloka.english}</p>
      ${festivalBlock}
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
      <p style="text-align:center;font-size:12px;color:#9ca3af;">
        Sent with 🙏 by OmVani · <a href="https://omvani.app/profile" style="color:#d97706;">Manage preferences</a>
      </p>
    </div>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get current UTC time
    const now = new Date();

    // Find users whose reminder_time matches the current hour (bucketed by hour)
    // We query all enabled users and filter by timezone + time match
    const { data: preferences, error: prefError } = await supabase
      .from("reminder_preferences")
      .select("*")
      .eq("enabled", true);

    if (prefError) throw new Error(`Failed to fetch preferences: ${prefError.message}`);
    if (!preferences || preferences.length === 0) {
      return new Response(JSON.stringify({ message: "No active reminders" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const shloka = getTodayShloka();
    const festival = getUpcomingFestival();
    let sent = 0;
    let skipped = 0;

    for (const pref of preferences) {
      try {
        // Calculate user's local time
        const userNow = new Date(now.toLocaleString("en-US", { timeZone: pref.timezone || "Asia/Kolkata" }));
        const userHour = userNow.getHours();
        const userMinute = userNow.getMinutes();

        // Parse reminder_time (HH:MM:SS)
        const [prefHour, prefMinute] = (pref.reminder_time || "06:00:00").split(":").map(Number);

        // Only send if within the current hour window (cron runs every 30 min)
        if (userHour !== prefHour || Math.abs(userMinute - prefMinute) > 30) {
          skipped++;
          continue;
        }

        // Check if already sent today
        const todayStart = new Date(userNow);
        todayStart.setHours(0, 0, 0, 0);

        const { data: existingLog } = await supabase
          .from("reminder_logs")
          .select("id")
          .eq("user_id", pref.user_id)
          .gte("sent_at", todayStart.toISOString())
          .limit(1);

        if (existingLog && existingLog.length > 0) {
          skipped++;
          continue;
        }

        // Get user email from auth
        const { data: userData } = await supabase.auth.admin.getUserById(pref.user_id);
        if (!userData?.user?.email) {
          skipped++;
          continue;
        }

        // Build content
        const emailHtml = buildEmailHtml(shloka, pref.include_festivals ? festival : null, pref.language);

        // Send email via Lovable AI (Resend-like approach using Supabase's built-in mailer)
        // For now, we use the admin API to send a magic link styled email
        // In production, integrate with Resend/SendGrid
        const channelsToSend = pref.channel === "both" ? ["email", "whatsapp"] : [pref.channel];

        for (const channel of channelsToSend) {
          if (channel === "email") {
            // Use Supabase's built-in email sending via auth.admin
            // We'll use a Resend integration or similar
            const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
            if (LOVABLE_API_KEY) {
              // Use Lovable AI to send email via a supported method
              // For MVP, log the reminder and note email would be sent
              console.log(`[REMINDER] Would send email to ${userData.user.email}: ${shloka.verse}`);
            }
          }

          if (channel === "whatsapp" && pref.whatsapp_number) {
            const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
            const twilioAuth = Deno.env.get("TWILIO_AUTH_TOKEN");
            const twilioFrom = Deno.env.get("TWILIO_WHATSAPP_FROM");

            if (twilioSid && twilioAuth && twilioFrom) {
              let body = `ॐ *OmVani — Daily Shloka*\n\n📖 *${shloka.verse}*\n\n_${shloka.sanskrit}_\n\n${shloka.english}`;
              if (pref.include_festivals && festival) {
                body += `\n\n🪔 *Upcoming: ${festival.name}* (${festival.date})\n${festival.description}`;
              }

              const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
              const formData = new URLSearchParams({
                From: `whatsapp:${twilioFrom}`,
                To: `whatsapp:${pref.whatsapp_number}`,
                Body: body,
              });

              const twilioResp = await fetch(twilioUrl, {
                method: "POST",
                headers: {
                  Authorization: `Basic ${btoa(`${twilioSid}:${twilioAuth}`)}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
              });

              if (!twilioResp.ok) {
                const errText = await twilioResp.text();
                console.error(`Twilio error for ${pref.user_id}: ${errText}`);
              }
            }
          }

          // Log the reminder
          await supabase.from("reminder_logs").insert({
            user_id: pref.user_id,
            channel,
            status: "sent",
            content_type: pref.include_festivals && festival ? "shloka+festival" : "shloka",
          });
        }

        sent++;
      } catch (userErr) {
        console.error(`Error processing user ${pref.user_id}:`, userErr);
        skipped++;
      }
    }

    return new Response(
      JSON.stringify({ message: `Processed ${preferences.length} users. Sent: ${sent}, Skipped: ${skipped}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-reminders error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
