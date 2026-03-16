// ---------------------------------------------------------------------------
// Seed data converter: Upanishads
// Imports existing upanishadData.ts and re-exports in DB seed format
// Each Upanishad becomes a chapter in the DB.
// ---------------------------------------------------------------------------

import { upanishads } from "../../src/pages/scriptures/upanishadData";

export const scripture = {
  id: "upanishad",
  name: "Upanishads",
  name_sanskrit: "उपनिषद्",
  tradition: "Vedanta",
  category: "Vedanta",
  total_verses: upanishads.reduce(
    (acc, u) => acc + u.chapters.reduce((a, c) => a + c.verses.length, 0),
    0
  ),
  total_chapters: upanishads.length,
  summary:
    "The philosophical core of the Vedas — dialogues exploring the nature of Brahman and Atman. The Upanishads form the foundation of Vedanta and contain the highest spiritual wisdom of ancient India.",
  accent_color: "hsl(42,85%,55%)",
  is_free: false,
  sort_order: 1,
};

export const chapters = upanishads.map((u, i) => ({
  id: `upanishad-${u.id}`,
  scripture_id: "upanishad",
  number: i + 1,
  title: u.name,
  subtitle: u.tradition,
  summary: u.summary,
  total_verses: u.chapters.reduce((a, c) => a + c.verses.length, 0),
  is_free: false,
  sort_order: i + 1,
}));

export const verses = upanishads.flatMap((u) =>
  u.chapters.flatMap((c) =>
    c.verses.map((v, i) => ({
      id: v.id,
      scripture_id: "upanishad",
      chapter_id: `upanishad-${u.id}`,
      verse_number: i + 1,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      meaning: v.meaning,
      word_meanings: v.word_meanings ?? null,
      is_key_verse: false,
      sort_order: i,
    }))
  )
);
