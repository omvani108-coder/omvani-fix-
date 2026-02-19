// ─── Yoga Sutras of Patanjali ─────────────────────────────────────────────────

export interface Sutra {
  id: string;          // e.g. "1.1"
  pada: number;        // chapter (pada)
  sutra: number;       // verse number within pada
  section: string;     // human-readable e.g. "Pada I · Sutra 1"
  sanskrit: string;
  transliteration: string;
  meaning: string;
  word_meanings?: string;
}

export interface Pada {
  number: number;
  name: string;         // e.g. "Samadhi Pada"
  subtitle: string;
  summary: string;
  total_sutras: number;
  sutras: Sutra[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const padas: Pada[] = [
  {
    number: 1,
    name: "Samadhi Pada",
    subtitle: "On Contemplation",
    summary: "The first chapter defines yoga and the nature of the mind. Patanjali opens with the famous definition of yoga as the stilling of the mind-stuff, then describes the five types of mental modifications, the two means of controlling them — practice and non-attachment — and the various stages and forms of samadhi available to the seeker.",
    total_sutras: 51,
    sutras: [
      {
        id: "1.1",
        pada: 1, sutra: 1,
        section: "Pada I · Sutra 1",
        sanskrit: "अथ योगानुशासनम्॥",
        transliteration: "Atha yoga-anusasanam.",
        meaning: "Now, the exposition of Yoga.",
        word_meanings: "atha — now, auspicious beginning; yoga — union, the discipline of yoga; anusasanam — exposition, instruction, discipline.",
      },
      {
        id: "1.2",
        pada: 1, sutra: 2,
        section: "Pada I · Sutra 2 — The Definition",
        sanskrit: "योगश्चित्तवृत्तिनिरोधः॥",
        transliteration: "Yogas citta-vrtti-nirodhah.",
        meaning: "Yoga is the restraint of the modifications of the mind-stuff.",
        word_meanings: "yogah — yoga; citta — mind-stuff, consciousness; vrtti — modifications, fluctuations, waves; nirodhah — restraint, cessation, control.",
      },
      {
        id: "1.3",
        pada: 1, sutra: 3,
        section: "Pada I · Sutra 3",
        sanskrit: "तदा द्रष्टुः स्वरूपेऽवस्थानम्॥",
        transliteration: "Tada drastuh svarupe avasthanam.",
        meaning: "Then the Seer abides in its own true nature.",
        word_meanings: "tada — then; drastuh — of the Seer, the pure Self; svarupe — in its own nature, in its essential form; avasthanam — abiding, resting, dwelling.",
      },
      {
        id: "1.4",
        pada: 1, sutra: 4,
        section: "Pada I · Sutra 4",
        sanskrit: "वृत्तिसारूप्यमितरत्र॥",
        transliteration: "Vrtti-sarupyam itaratra.",
        meaning: "At other times, the Seer appears to take on the form of the modifications of the mind.",
        word_meanings: "vrtti — modifications of the mind; sarupyam — identification with, assuming the form of; itaratra — at other times, otherwise.",
      },
      {
        id: "1.12",
        pada: 1, sutra: 12,
        section: "Pada I · Sutra 12 — Practice & Non-Attachment",
        sanskrit: "अभ्यासवैराग्याभ्यां तन्निरोधः॥",
        transliteration: "Abhyasa-vairagyabhyam tan-nirodhah.",
        meaning: "The restraint of those modifications is achieved through practice and non-attachment.",
        word_meanings: "abhyasa — practice, repeated effort; vairagyabhyam — non-attachment, dispassion; tan — of those; nirodhah — restraint, cessation.",
      },
      {
        id: "1.13",
        pada: 1, sutra: 13,
        section: "Pada I · Sutra 13",
        sanskrit: "तत्र स्थितौ यत्नोऽभ्यासः॥",
        transliteration: "Tatra sthitau yatno 'bhyasah.",
        meaning: "Practice is the effort to remain in a steady, undisturbed state.",
        word_meanings: "tatra — there, in that; sthitau — in steadiness, in that state; yatnah — effort, endeavour; abhyasah — practice.",
      },
      {
        id: "1.14",
        pada: 1, sutra: 14,
        section: "Pada I · Sutra 14",
        sanskrit: "स तु दीर्घकालनैरन्तर्यसत्काराऽऽसेवितो दृढभूमिः॥",
        transliteration: "Sa tu dirgha-kala-nairantarya-satkarasevito drdha-bhumih.",
        meaning: "Practice becomes firmly grounded when it is cultivated for a long time, without interruption, and with earnest, devoted attention.",
        word_meanings: "sa — that; tu — but; dirgha — long; kala — time; nairantarya — without interruption; satkara — reverence, earnestness; asevitah — practised, cultivated; drdha — firm, strong; bhumih — ground, foundation.",
      },
    ],
  },
  {
    number: 2,
    name: "Sadhana Pada",
    subtitle: "On Practice",
    summary: "The most practical chapter of the Yoga Sutras. Patanjali introduces Kriya Yoga — the yoga of action — comprising austerity, self-study, and surrender to the Lord. He describes the five kleshas (afflictions) that cause suffering, and lays out the famous Eight Limbs of Yoga (Ashtanga) as the path to liberation.",
    total_sutras: 55,
    sutras: [
      {
        id: "2.1",
        pada: 2, sutra: 1,
        section: "Pada II · Sutra 1 — Kriya Yoga",
        sanskrit: "तपःस्वाध्यायेश्वरप्रणिधानानि क्रियायोगः॥",
        transliteration: "Tapah-svadhyaya-isvara-pranidhanani kriya-yogah.",
        meaning: "Austerity, self-study, and surrender to the Lord constitute the Yoga of Action (Kriya Yoga).",
        word_meanings: "tapah — austerity, discipline; svadhyaya — self-study, study of sacred texts; isvara-pranidhanani — surrender to the Lord; kriya-yogah — the yoga of action.",
      },
      {
        id: "2.3",
        pada: 2, sutra: 3,
        section: "Pada II · Sutra 3 — The Five Afflictions",
        sanskrit: "अविद्यास्मितारागद्वेषाभिनिवेशाः क्लेशाः॥",
        transliteration: "Avidya-asmita-raga-dvesa-abhinivesah klesah.",
        meaning: "Ignorance, egoism, attachment, aversion, and clinging to life are the five afflictions (kleshas).",
        word_meanings: "avidya — ignorance; asmita — egoism, I-am-ness; raga — attachment, desire; dvesa — aversion, repulsion; abhinivesah — clinging to life, fear of death; klesah — afflictions, sources of suffering.",
      },
      {
        id: "2.29",
        pada: 2, sutra: 29,
        section: "Pada II · Sutra 29 — The Eight Limbs",
        sanskrit: "यमनियमासनप्राणायामप्रत्याहारधारणाध्यानसमाधयोऽष्टावङ्गानि॥",
        transliteration: "Yama-niyama-asana-pranayama-pratyahara-dharana-dhyana-samadhayo 'stav angani.",
        meaning: "The eight limbs of yoga are: restraints (yama), observances (niyama), posture (asana), breath control (pranayama), withdrawal of the senses (pratyahara), concentration (dharana), meditation (dhyana), and absorption (samadhi).",
        word_meanings: "yama — restraints; niyama — observances; asana — posture; pranayama — breath control; pratyahara — withdrawal of senses; dharana — concentration; dhyana — meditation; samadhayah — absorption; astau — eight; angani — limbs.",
      },
      {
        id: "2.46",
        pada: 2, sutra: 46,
        section: "Pada II · Sutra 46 — On Asana",
        sanskrit: "स्थिरसुखमासनम्॥",
        transliteration: "Sthira-sukham asanam.",
        meaning: "Posture (asana) should be steady and comfortable.",
        word_meanings: "sthira — steady, stable; sukham — comfortable, easeful; asanam — posture, seat.",
      },
      {
        id: "2.48",
        pada: 2, sutra: 48,
        section: "Pada II · Sutra 48",
        sanskrit: "ततो द्वन्द्वानभिघातः॥",
        transliteration: "Tato dvandva-anabhighatah.",
        meaning: "From that, one is no longer assailed by the pairs of opposites.",
        word_meanings: "tatah — from that; dvandva — pairs of opposites (hot/cold, pleasure/pain); anabhighatah — not troubled, not assailed.",
      },
    ],
  },
  {
    number: 3,
    name: "Vibhuti Pada",
    subtitle: "On Supernormal Powers",
    summary: "Patanjali describes the final three inner limbs — dharana (concentration), dhyana (meditation), and samadhi (absorption) — collectively called Samyama. He explains the extraordinary powers (vibhutis or siddhis) that arise from perfection in Samyama, and cautions the sincere seeker not to be attached to these powers, as they become obstacles to liberation.",
    total_sutras: 56,
    sutras: [
      {
        id: "3.1",
        pada: 3, sutra: 1,
        section: "Pada III · Sutra 1 — Dharana",
        sanskrit: "देशबन्धश्चित्तस्य धारणा॥",
        transliteration: "Desa-bandhas cittasya dharana.",
        meaning: "Dharana (concentration) is the binding of the mind to one place.",
        word_meanings: "desa — place; bandhah — binding, fixing; cittasya — of the mind; dharana — concentration.",
      },
      {
        id: "3.2",
        pada: 3, sutra: 2,
        section: "Pada III · Sutra 2 — Dhyana",
        sanskrit: "तत्र प्रत्ययैकतानता ध्यानम्॥",
        transliteration: "Tatra pratyaya-ekatanata dhyanam.",
        meaning: "Dhyana (meditation) is the continuous, uninterrupted flow of consciousness toward that object.",
        word_meanings: "tatra — there, in that; pratyaya — cognition, content of the mind; ekatanata — continuous flow, one-pointedness; dhyanam — meditation.",
      },
      {
        id: "3.3",
        pada: 3, sutra: 3,
        section: "Pada III · Sutra 3 — Samadhi",
        sanskrit: "तदेवार्थमात्रनिर्भासं स्वरूपशून्यमिव समाधिः॥",
        transliteration: "Tad eva artha-matra-nirbhasam svarupa-sunyam iva samadhih.",
        meaning: "When that same meditation shines forth as the object alone, as if empty of its own form, that is samadhi (absorption).",
        word_meanings: "tad — that; eva — alone; artha — object; matra — only; nirbhasam — shining forth; svarupa — own form; sunyam — empty; iva — as if; samadhih — absorption.",
      },
    ],
  },
  {
    number: 4,
    name: "Kaivalya Pada",
    subtitle: "On Liberation",
    summary: "The final chapter discusses the nature of liberation (kaivalya) — the absolute independence of the pure Self from matter. Patanjali explains the source of transformation, the nature of karma and mind, and ultimately describes the state of kaivalya where the Self rests in its own pure nature, free from all identification with the mind and matter.",
    total_sutras: 34,
    sutras: [
      {
        id: "4.1",
        pada: 4, sutra: 1,
        section: "Pada IV · Sutra 1",
        sanskrit: "जन्मौषधिमन्त्रतपःसमाधिजाः सिद्धयः॥",
        transliteration: "Janma-ausadhi-mantra-tapah-samadhi-jah siddhayah.",
        meaning: "Supernormal powers arise from birth, medicinal herbs, mantras, austerities, or samadhi.",
        word_meanings: "janma — birth; ausadhi — herbs, plants; mantra — sacred sounds; tapah — austerities; samadhi — absorption; jah — born of; siddhayah — powers, accomplishments.",
      },
      {
        id: "4.29",
        pada: 4, sutra: 29,
        section: "Pada IV · Sutra 29 — Dharma Megha Samadhi",
        sanskrit: "प्रसंख्यानेऽप्यकुसीदस्य सर्वथा विवेकख्यातेर्धर्ममेघः समाधिः॥",
        transliteration: "Prasankhyane 'py akusidasya sarvatha viveka-khyater dharma-meghah samadhih.",
        meaning: "One who remains uninterested even in the highest discrimination, and is always in a state of discriminative knowledge — for such a person, the samadhi called the 'cloud of virtue' (dharma megha) arises.",
        word_meanings: "prasankhyane — in the highest discrimination; api — even; akusidasya — of one who has no interest; sarvatha — always; viveka-khyateh — of discriminative knowledge; dharma — virtue; meghah — cloud; samadhih — absorption.",
      },
      {
        id: "4.34",
        pada: 4, sutra: 34,
        section: "Pada IV · Sutra 34 — Kaivalya",
        sanskrit: "पुरुषार्थशून्यानां गुणानां प्रतिप्रसवः कैवल्यं स्वरूपप्रतिष्ठा वा चितिशक्तिरिति॥",
        transliteration: "Purusartha-sunyanam gunanam pratiprasavah kaivalyam svarupa-pratistha va citi-saktir iti.",
        meaning: "Liberation (kaivalya) is the return of the gunas to their original state when they are devoid of purpose for the Purusha, or it is the establishment of the power of pure Consciousness in its own nature.",
        word_meanings: "purusartha — purpose of the Purusha; sunyanam — devoid of; gunanam — of the three gunas; pratiprasavah — return to source, involution; kaivalyam — liberation, aloneness; svarupa — own nature; pratistha — established; va — or; citi-saktih — power of pure Consciousness; iti — thus.",
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function searchSutras(query: string): Sutra[] {
  const q = query.toLowerCase();
  return padas.flatMap(p => p.sutras).filter(s =>
    s.meaning.toLowerCase().includes(q) ||
    s.sanskrit.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q) ||
    s.section.toLowerCase().includes(q) ||
    (s.word_meanings?.toLowerCase().includes(q) ?? false)
  );
}

export function getAllSutras(): Sutra[] {
  return padas.flatMap(p => p.sutras);
}

const SUTRA_BOOKMARK_KEY = "omvani_sutra_bookmarks";

export function getSutraBookmarks(): string[] {
  try { return JSON.parse(localStorage.getItem(SUTRA_BOOKMARK_KEY) ?? "[]"); }
  catch { return []; }
}

export function toggleSutraBookmark(id: string): boolean {
  const bm = getSutraBookmarks();
  const idx = bm.indexOf(id);
  if (idx === -1) { bm.push(id); localStorage.setItem(SUTRA_BOOKMARK_KEY, JSON.stringify(bm)); return true; }
  else { bm.splice(idx, 1); localStorage.setItem(SUTRA_BOOKMARK_KEY, JSON.stringify(bm)); return false; }
}

export function isSutraBookmarked(id: string): boolean {
  return getSutraBookmarks().includes(id);
}
