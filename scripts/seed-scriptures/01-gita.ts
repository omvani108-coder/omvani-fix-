// ---------------------------------------------------------------------------
// Seed data converter: Bhagavad Gita
// Imports existing gitaData.ts and re-exports in DB seed format
// ---------------------------------------------------------------------------

import { chapters as gitaChapters } from "../../src/pages/scriptures/gitaData";

export const scripture = {
  id: "gita",
  name: "Bhagavad Gita",
  name_sanskrit: "भगवद्गीता",
  tradition: "Mahabharata",
  category: "Epic",
  total_verses: 700,
  total_chapters: 18,
  summary:
    "The Song of God — Lord Krishna's timeless teachings to Arjuna on the battlefield of Kurukshetra. Through 18 chapters and 700 verses, Krishna reveals the paths of knowledge, action, and devotion, guiding Arjuna from despair to spiritual awakening.",
  accent_color: "hsl(28,90%,55%)",
  is_free: true,
  sort_order: 0,
};

export const chapters = gitaChapters.map((ch) => ({
  id: `gita-ch-${ch.number}`,
  scripture_id: "gita",
  number: ch.number,
  title: ch.title,
  subtitle: ch.subtitle,
  summary: ch.summary,
  total_verses: ch.total_verses,
  is_free: ch.number <= 4,
  sort_order: ch.number,
}));

export const verses = gitaChapters.flatMap((ch) =>
  ch.shlokas.map((s, i) => ({
    id: `gita-${s.id}`,
    scripture_id: "gita",
    chapter_id: `gita-ch-${ch.number}`,
    verse_number: s.verse,
    sanskrit: s.sanskrit,
    transliteration: s.transliteration,
    meaning: s.meaning,
    word_meanings: s.word_meanings ?? null,
    is_key_verse: false,
    sort_order: i,
  }))
);
