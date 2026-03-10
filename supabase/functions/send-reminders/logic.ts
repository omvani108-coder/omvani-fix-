/**
 * Pure logic for the send-reminders edge function.
 *
 * Exported so tests can import directly — no copy-paste.
 */

// Daily shlokas — rotates by day of year
export const DAILY_SHLOKAS = [
  { verse: "Gita 2.47", sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन", english: "You have the right to perform your duties, but not to the fruits of your actions." },
  { verse: "Gita 2.20", sanskrit: "न जायते म्रियते वा कदाचिन्", english: "The soul is never born nor dies at any time. It is unborn, eternal, ever-existing and primeval." },
  { verse: "Gita 4.7", sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत", english: "Whenever there is a decline in righteousness, I manifest Myself to restore it." },
  { verse: "Gita 9.22", sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते", english: "To those who worship Me with devotion, I carry what they lack and preserve what they have." },
  { verse: "Gita 18.66", sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज", english: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sins." },
  { verse: "Gita 6.35", sanskrit: "असंशयं महाबाहो मनो दुर्निग्रहं चलम्", english: "The mind is restless — but it can be controlled by practice and detachment." },
  { verse: "Gita 12.13", sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च", english: "One who is not envious but is a kind friend to all living entities is very dear to Me." },
];

// Upcoming Hindu festivals (simplified — in production, use a proper panchang API)
export const FESTIVALS_2026 = [
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

export function getTodayShloka(): typeof DAILY_SHLOKAS[0] {
  const day = Math.floor(Date.now() / 86_400_000);
  return DAILY_SHLOKAS[day % DAILY_SHLOKAS.length];
}

export function getUpcomingFestival(
  referenceDate?: Date,
): typeof FESTIVALS_2026[0] | null {
  const ref = referenceDate ?? new Date();
  const today = ref.toISOString().slice(0, 10);
  const upcoming = FESTIVALS_2026.filter((f) => f.date >= today).sort(
    (a, b) => a.date.localeCompare(b.date),
  );
  if (upcoming.length > 0) {
    const daysUntil = Math.ceil(
      (new Date(upcoming[0].date).getTime() - ref.getTime()) / 86_400_000,
    );
    if (daysUntil <= 3) return upcoming[0];
  }
  return null;
}

export function buildEmailHtml(
  shloka: typeof DAILY_SHLOKAS[0],
  festival: typeof FESTIVALS_2026[0] | null,
): string {
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
        Sent with 🙏 by OmVani · <a href="https://omvani.in/profile" style="color:#d97706;">Manage preferences</a>
      </p>
    </div>
  `;
}

/** Pagination page size for fetching reminder preferences */
export const PAGE_SIZE = 100;
