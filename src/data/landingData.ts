import {
  MessageCircle,
  Music,
  Camera,
  MapPin,
  BookOpen,
  Flame,
  Sun,
} from "lucide-react";

// ─── Features ────────────────────────────────────────────────────────────────

export const features = [
  {
    icon: MessageCircle,
    title: "AI Spiritual Guide",
    description:
      "Ask any question about dharma, karma, or life — get accurate answers from the Gita, Vedas & Puranas with source shlokas.",
    tag: "Voice + Text · Hindi & English",
  },
  {
    icon: Music,
    title: "Bhajans & Mantras",
    description:
      "Curated library of sacred bhajans and mantras with lyrics, meanings, and soulful audio playback.",
    tag: "Audio · Lyrics · Meaning",
  },
  {
    icon: Camera,
    title: "AI Image Search",
    description:
      "Upload a photo of any deity, temple, or ritual — instantly identify it and learn the complete story behind it.",
    tag: "AI Vision · Instant ID",
  },
  {
    icon: MapPin,
    title: "Mandir Locator",
    description:
      "Find temples near you with directions, timings, and details. Never miss darshan wherever you are.",
    tag: "GPS · Directions · Timings",
  },
] as const;

// ─── Shlokas ──────────────────────────────────────────────────────────────────

export interface Shloka {
  id: number;
  ref: string;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  theme: string;
}

export const shlokas: Shloka[] = [
  {
    id: 1,
    ref: "Bhagavad Gita 2.47",
    sanskrit:
      "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration:
      "Karmanye vadhikaras te ma phaleshu kadachana,\nMa karma-phala-hetur bhur ma te sango 'stv akarmani.",
    meaning:
      "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
    theme: "Nishkama Karma — Desireless Action",
  },
  {
    id: 2,
    ref: "Bhagavad Gita 2.20",
    sanskrit:
      "न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे॥",
    transliteration:
      "Na jayate mriyate va kadacin\nnayam bhutva bhavita va na bhuyah,\nAjo nityah sasvato 'yam purano\nna hanyate hanyamane sarire.",
    meaning:
      "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.",
    theme: "Atman — The Eternal Soul",
  },
  {
    id: 3,
    ref: "Bhagavad Gita 9.22",
    sanskrit:
      "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    transliteration:
      "Ananyash chintayanto mam ye janah paryupasate,\nTesham nityabhiyuktanam yoga-kshemam vahamyaham.",
    meaning:
      "For those who worship Me with devotion, meditating on My transcendental form, I carry what they lack and preserve what they have.",
    theme: "Bhakti — Divine Protection",
  },
  {
    id: 4,
    ref: "Bhagavad Gita 6.5",
    sanskrit:
      "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    transliteration:
      "Uddhared atmanatmanam natmanam avasadayet,\nAtmaiva hy atmano bandhur atmaiva ripur atmanah.",
    meaning:
      "One must elevate, not degrade, oneself by one's own mind. The mind is the friend of the conditioned soul, and his enemy as well.",
    theme: "Atma-Uddhara — Self-Elevation",
  },
  {
    id: 5,
    ref: "Bhagavad Gita 18.66",
    sanskrit:
      "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    transliteration:
      "Sarva-dharman parityajya mam ekam saranam vraja,\nAham tvam sarva-papebhyo moksayisyami ma sucah.",
    meaning:
      "Abandon all varieties of dharma and simply surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
    theme: "Sharanagati — Complete Surrender",
  },
  {
    id: 6,
    ref: "Bhagavad Gita 4.7",
    sanskrit:
      "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    transliteration:
      "Yada yada hi dharmasya glanir bhavati bharata,\nAbhyutthanam adharmasya tadatmanam srjamy aham.",
    meaning:
      "Whenever and wherever there is a decline in dharma and a predominant rise of irreligion — at that time I manifest Myself.",
    theme: "Divine Incarnation — Dharma Restoration",
  },
  {
    id: 7,
    ref: "Bhagavad Gita 2.14",
    sanskrit:
      "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
    transliteration:
      "Matra-sparsas tu kaunteya sitosna-sukha-duhkha-dah,\nAgamapayino 'nityas tams titiksasva bharata.",
    meaning:
      "O son of Kunti, the transient heat and cold, pleasure and pain arise from sense perception. They are non-permanent and come and go. Learn to tolerate them.",
    theme: "Titiksha — Equanimity & Endurance",
  },
];

/** Returns the shloka for a given date — deterministic and testable. */
export function getDailyShloka(date: Date = new Date()): Shloka {
  const MS_PER_DAY = 86_400_000;
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / MS_PER_DAY
  );
  return shlokas[dayOfYear % shlokas.length];
}

// ─── Scriptures ───────────────────────────────────────────────────────────────

export const scriptures = [
  {
    icon: BookOpen,
    name: "Bhagavad Gita",
    description:
      "700 verses of eternal wisdom on dharma, yoga, and the nature of the Self.",
    chapters: "18 Chapters · 700 Shlokas",
    color: "from-saffron/20 to-gold/10",
  },
  {
    icon: Flame,
    name: "Vedas & Upanishads",
    description:
      "Ancient scriptures revealing the nature of Brahman, Atman, and cosmic truth.",
    chapters: "4 Vedas · 108 Upanishads",
    color: "from-lotus-pink/20 to-saffron/10",
  },
  {
    icon: Sun,
    name: "Puranas",
    description:
      "Stories of deities, creation, cosmology, and the cycles of time.",
    chapters: "18 Maha Puranas",
    color: "from-gold/20 to-saffron/10",
  },
] as const;

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials = [
  {
    name: "Priya S.",
    location: "Mumbai",
    text: "OmVani answered my question about karma with a shloka from the Gita that I had been searching for years. It felt like speaking to a real guru.",
    avatar: "🙏",
  },
  {
    name: "Ramesh T.",
    location: "Bengaluru",
    text: "The voice mode is magical. I speak in Hindi and it responds instantly with deep answers and beautiful pronunciation. My morning sadhana is now complete.",
    avatar: "🕉️",
  },
  {
    name: "Ananya M.",
    location: "Delhi",
    text: "I uploaded a photo of a temple idol and OmVani told me its complete story — the deity, significance, and related mantras. Incredible!",
    avatar: "🌸",
  },
] as const;

// ─── Stats ────────────────────────────────────────────────────────────────────

export const stats = [
  { number: "700+", label: "Shlokas Referenced" },
  { number: "2",    label: "Languages Supported" },
  { number: "18",   label: "Puranas Indexed" },
  { number: "24/7", label: "Guru Available" },
] as const;

// ─── Pricing ──────────────────────────────────────────────────────────────────

export const plans = [
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    features: [
      "Unlimited AI conversations",
      "Voice + text in Hindi & English",
      "Full bhajan & mantra library",
      "AI image identification",
      "Temple locator",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "₹399",
    period: "/month",
    features: [
      "Everything in Pro",
      "Sanskrit language support",
      "Offline bhajan downloads",
      "Sadhana tracker & reminders",
      "Priority response speed",
      "ePuja guided rituals",
    ],
    popular: true,
  },
] as const;
