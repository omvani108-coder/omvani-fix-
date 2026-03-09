// ═══════════════════════════════════════════════════════════════════════════
// OmVani — Landing Page Data
// File path in your project:
//   src/data/landingData.ts
//
// WHAT CHANGED FROM YOUR ORIGINAL:
//   - plans[] now has 3 entries: Free (Seeker), ₹199 (Sadhak), ₹399 (Guru)
//   - Each plan accurately reflects the feature limits
//   - The "popular" flag is on Guru (₹399) 
//   - Annual pricing note added to paid plans
//   - Everything else (features, shlokas, scriptures, stats) is unchanged
// ═══════════════════════════════════════════════════════════════════════════

import {
  MessageCircle,
  BookOpen,
  Music,
  MapPin,
  Camera,
  CheckSquare,
} from "lucide-react";

// ── Features section ───────────────────────────────────────────────────────────
export const features = [
  {
    icon:        MessageCircle,
    title:       "AI Spiritual Guru",
    description: "Ask anything about dharma, karma, or life. Get answers rooted in authentic scripture — Gita, Vedas, Upanishads.",
    tag:         "Powered by Claude AI",
    href:        "/chat",
  },
  {
    icon:        BookOpen,
    title:       "Sacred Scriptures",
    description: "Browse the Bhagavad Gita, Upanishads, and Yoga Sutras. Search by topic, bookmark verses, and ask the AI about any shloka.",
    tag:         "Gita · Upanishads · Yoga Sutras",
    href:        "/scriptures",
  },
  {
    icon:        Music,
    title:       "Bhajans & Mantras",
    description: "A curated library of bhajans, mantras, aartis, and stotras — with lyrics, meanings, and audio links.",
    tag:         "Sanskrit · Hindi",
    href:        "/bhajans",
  },
  {
    icon:        MapPin,
    title:       "Mandir Directory",
    description: "Explore Jyotirlingas, Shakti Peeths, Char Dham, and famous temples across India with history and visit info.",
    tag:         "100+ temples",
    href:        "/mandirs",
  },
  {
    icon:        Camera,
    title:       "Deity Identifier",
    description: "Upload a photo of any deity, temple, or sacred object — our AI identifies it and tells you its significance, mantras, and worship times.",
    tag:         "AI Vision · Gemini",
    href:        "/identify",
  },
  {
    icon:        CheckSquare,
    title:       "Puja Tracker",
    description: "Track your daily spiritual practice — bath, deepak, incense, mantra, aarti and more. Build streaks and stay consistent.",
    tag:         "Daily · Streaks",
    href:        "/puja-tracker",
  },
];

// ── Shloka carousel data ───────────────────────────────────────────────────────
export const shlokas = [
  {
    id:       "gita-2-47",
    ref:      "Bhagavad Gita 2.47",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    meaning:  "You have the right to perform your duties, but not to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
  },
  {
    id:       "gita-2-20",
    ref:      "Bhagavad Gita 2.20",
    sanskrit: "न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे॥",
    meaning:  "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.",
  },
  {
    id:       "gita-4-7",
    ref:      "Bhagavad Gita 4.7",
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    meaning:  "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion — at that time I descend Myself.",
  },
  {
    id:       "gita-9-22",
    ref:      "Bhagavad Gita 9.22",
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    meaning:  "For those who worship Me with devotion, meditating on My transcendental form — to them I carry what they lack and preserve what they have.",
  },
  {
    id:       "gita-18-66",
    ref:      "Bhagavad Gita 18.66",
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    meaning:  "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
  },
  {
    id:       "gita-6-35",
    ref:      "Bhagavad Gita 6.35",
    sanskrit: "असंशयं महाबाहो मनो दुर्निग्रहं चलम्।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥",
    meaning:  "O mighty-armed Arjuna, it is undoubtedly very difficult to curb the restless mind, but it is possible by suitable practice and by detachment.",
  },
  {
    id:       "gita-12-13",
    ref:      "Bhagavad Gita 12.13",
    sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥",
    meaning:  "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor, who is free from false ego and equal in both happiness and distress, is very dear to Me.",
  },
];

// ── Get today's shloka (rotates by day of year) ───────────────────────────────
export function getDailyShloka() {
  const dayOfYear = Math.floor(Date.now() / 86_400_000);
  return shlokas[dayOfYear % shlokas.length];
}

// ── Sacred scriptures section ─────────────────────────────────────────────────
export const scriptures = [
  {
    name:        "Bhagavad Gita",
    icon:        BookOpen,
    description: "700 verses of divine dialogue between Krishna and Arjuna covering dharma, karma, devotion, and liberation.",
    chapters:    "18 Chapters · 700 Shlokas",
    color:       "from-saffron/5 to-gold/5",
  },
  {
    name:        "Upanishads",
    icon:        BookOpen,
    description: "The philosophical heart of the Vedas — exploring the nature of Brahman, Atman, and the ultimate reality.",
    chapters:    "10 Principal Upanishads",
    color:       "from-maroon/5 to-saffron/5",
  },
  {
    name:        "Yoga Sutras",
    icon:        BookOpen,
    description: "Patanjali's foundational text on yoga philosophy — 196 aphorisms on the nature of mind and the path to liberation.",
    chapters:    "4 Padas · 196 Sutras",
    color:       "from-lotus-pink/5 to-maroon/5",
  },
];

// ── Stats section ─────────────────────────────────────────────────────────────
export const stats = [
  { number: "700+",  label: "Sacred Shlokas" },
  { number: "3",     label: "Core Scriptures" },
  { number: "100+",  label: "Temples Mapped" },
  { number: "24/7",  label: "Guru Available" },
];

// ── Pricing plans ─────────────────────────────────────────────────────────────
// THIS IS THE UPDATED SECTION — now 3 plans with accurate feature limits
// The landing page pricing section reads from this array.
export interface LandingPlan {
  id: string;
  name: string;
  emoji: string;
  price: string;
  annualPrice?: string;
  period: string;
  popular: boolean;
  cta: string;
  trialNote?: string;
  annualNote?: string;
  features: string[];
  notIncluded: string[];
}

export const plans: LandingPlan[] = [
  {
    id:      "free",
    name:    "Seeker",
    emoji:   "🙏",
    price:   "Free",
    period:  "forever",
    popular: false,
    cta:     "Get Started",
    features: [
      "3 AI Guru chats per day",
      "Bhagavad Gita — first 4 pages only",
      "1 Deity identification total",
      "1 Bhajan search result",
      "7-day Puja Tracker history",
      "Basic mandir directory",
    ],
    notIncluded: [
      "Upanishads & Yoga Sutras",
      "Voice responses (TTS)",
      "WhatsApp reminders",
    ],
  },
  {
    id:      "basic",
    name:    "Sadhak",
    emoji:   "🪔",
    price:   "₹199",
    annualPrice: "₹1,499",
    period:  "/month",
    popular: false,
    cta:     "Start Free Trial",
    trialNote: "7 days free · then ₹199/mo",
    annualNote: "or ₹1,499/yr — save ₹889",
    features: [
      "10 AI Guru chats per day",
      "1 free Kundli reading per month",
      "All 3 scriptures — unlimited access",
      "Deity identifier — 3 per day",
      "Top 10 Bhajans",
      "Full Puja Tracker — unlimited history",
      "Email reminders with daily shloka",
    ],
    notIncluded: [
      "WhatsApp reminders",
      "Unlimited identifications",
    ],
  },
  {
    id:      "pro",
    name:    "Guru",
    emoji:   "👑",
    price:   "₹399",
    annualPrice: "₹2,999",
    period:  "/month",
    popular: true,
    cta:     "Start Free Trial",
    trialNote: "7 days free · then ₹399/mo",
    annualNote: "or ₹2,999/yr — save ₹1,789",
    features: [
      "20 AI Guru chats per day",
      "2 free Kundli readings per month",
      "All 3 scriptures — unlimited access",
      "Deity identifier — unlimited",
      "Full Bhajans library — all songs",
      "Full Puja Tracker — unlimited history",
      "WhatsApp + Email reminders",
      "Priority support",
      "Early access to new features",
    ],
    notIncluded: [],
  },
];
