// ---------------------------------------------------------------------------
// Seed data converter: Yoga Sutras of Patanjali
// Imports existing yogaSutrasData.ts and re-exports in DB seed format
// Each Pada becomes a chapter in the DB.
// ---------------------------------------------------------------------------

import { padas } from "../../src/pages/scriptures/yogaSutrasData";

export const scripture = {
  id: "yoga-sutras",
  name: "Yoga Sutras",
  name_sanskrit: "योगसूत्राणि",
  tradition: "Yoga",
  category: "Sutra",
  total_verses: 196,
  total_chapters: 4,
  summary:
    "Patanjali's systematic guide to the science of yoga — from ethics to samadhi. The 196 sutras across four chapters lay out the eight-limbed path, the nature of the mind, and the stages of spiritual liberation.",
  accent_color: "hsl(340,60%,55%)",
  is_free: false,
  sort_order: 2,
};

export const chapters = padas.map((p) => ({
  id: `yoga-sutras-pada-${p.number}`,
  scripture_id: "yoga-sutras",
  number: p.number,
  title: p.name,
  subtitle: p.subtitle,
  summary: p.summary,
  total_verses: p.total_sutras,
  is_free: false,
  sort_order: p.number,
}));

export const verses = padas.flatMap((p) =>
  p.sutras.map((s, i) => ({
    id: `ys-${s.id}`,
    scripture_id: "yoga-sutras",
    chapter_id: `yoga-sutras-pada-${p.number}`,
    verse_number: s.sutra,
    sanskrit: s.sanskrit,
    transliteration: s.transliteration,
    meaning: s.meaning,
    word_meanings: s.word_meanings ?? null,
    is_key_verse: false,
    sort_order: i,
  }))
);
