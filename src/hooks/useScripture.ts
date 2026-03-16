/**
 * useScripture — Supabase-driven scripture data hook
 *
 * Provides all data for the scripture reader:
 * - Scripture list (cached after first load)
 * - Chapters for selected scripture
 * - Verses for selected chapter
 * - Search across verses
 *
 * Falls back to hardcoded .ts data when DB tables are empty or unavailable.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── Static imports (fallback while DB is being seeded) ──────────────────────
import {
  chapters as gitaChapters,
  searchShlokas,
  type Shloka,
} from "@/pages/scriptures/gitaData";
import {
  upanishads,
  searchUpanishadVerses,
  type Verse as UpanishadVerse,
} from "@/pages/scriptures/upanishadData";
import {
  padas,
  searchSutras,
  type Sutra,
} from "@/pages/scriptures/yogaSutrasData";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Scripture {
  id: string;
  name: string;
  name_sanskrit: string;
  tradition: string | null;
  category: string;
  total_verses: number;
  total_chapters: number;
  summary: string | null;
  accent_color: string;
  is_free: boolean;
  sort_order: number;
  emoji: string;
  cover_image: string | null;
}

export interface ScriptureChapter {
  id: string;
  scripture_id: string;
  number: number;
  title: string;
  subtitle: string | null;
  summary: string | null;
  total_verses: number;
  is_free: boolean;
  sort_order: number;
}

export interface ScriptureVerse {
  id: string;
  scripture_id: string;
  chapter_id: string;
  verse_number: number;
  sanskrit: string;
  transliteration: string | null;
  meaning: string;
  word_meanings: string | null;
  is_key_verse: boolean;
  sort_order: number;
}

// ─── Emoji map for scriptures ─────────────────────────────────────────────────
const SCRIPTURE_EMOJIS: Record<string, string> = {
  gita: "🙏",
  upanishad: "🕉️",
  "yoga-sutras": "🧘",
  "hanuman-chalisa": "🐒",
  sunderkand: "🏹",
  "vishnu-sahasranama": "🔱",
  "lalita-sahasranama": "🌸",
  "shiv-tandav": "🔥",
  "aditya-hridayam": "☀️",
  "guru-granth-sahib": "📖",
};

// ─── Cover image map for scriptures (in /public/images/scriptures/) ──────────
const SCRIPTURE_COVERS: Record<string, string> = {
  gita: "/images/scriptures/gita.jpg",
  upanishad: "/images/scriptures/upanishads.jpg",
  "yoga-sutras": "/images/scriptures/yoga-sutras.jpg",
  "hanuman-chalisa": "/images/scriptures/hanuman-chalisa.jpg",
  sunderkand: "/images/scriptures/sunderkand.jpg",
  "vishnu-sahasranama": "/images/scriptures/vishnu-sahasranama.jpg",
  "lalita-sahasranama": "/images/scriptures/lalita-sahasranama.jpg",
  "shiv-tandav": "/images/scriptures/shiv-tandav.jpg",
  "aditya-hridayam": "/images/scriptures/aditya-hridayam.jpg",
  "guru-granth-sahib": "/images/scriptures/guru-granth-sahib.jpg",
};

// ─── Static data conversion helpers ──────────────────────────────────────────

function buildStaticScriptures(): Scripture[] {
  return [
    {
      id: "gita",
      name: "Bhagavad Gita",
      name_sanskrit: "भगवद्गीता",
      tradition: "Mahabharata",
      category: "Epic",
      total_verses: 700,
      total_chapters: 18,
      summary: "The Song of God — Lord Krishna's timeless teachings to Arjuna on the battlefield of Kurukshetra.",
      accent_color: "hsl(28,90%,55%)",
      is_free: true,
      sort_order: 0,
      emoji: "🙏",
      cover_image: SCRIPTURE_COVERS["gita"] ?? null,
    },
    {
      id: "upanishad",
      name: "Upanishads",
      name_sanskrit: "उपनिषद्",
      tradition: "Vedanta",
      category: "Vedanta",
      total_verses: 88,
      total_chapters: 5,
      summary: "The philosophical core of the Vedas — dialogues exploring the nature of Brahman and Atman.",
      accent_color: "hsl(42,85%,55%)",
      is_free: false,
      sort_order: 1,
      emoji: "🕉️",
      cover_image: SCRIPTURE_COVERS["upanishad"] ?? null,
    },
    {
      id: "yoga-sutras",
      name: "Yoga Sutras",
      name_sanskrit: "योगसूत्राणि",
      tradition: "Yoga",
      category: "Sutra",
      total_verses: 196,
      total_chapters: 4,
      summary: "Patanjali's systematic guide to the science of yoga — from ethics to samadhi.",
      accent_color: "hsl(340,60%,55%)",
      is_free: false,
      sort_order: 2,
      emoji: "🧘",
      cover_image: SCRIPTURE_COVERS["yoga-sutras"] ?? null,
    },
  ];
}

function buildStaticChapters(scriptureId: string): ScriptureChapter[] {
  if (scriptureId === "gita") {
    return gitaChapters.map((ch) => ({
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
  }
  if (scriptureId === "upanishad") {
    return upanishads.map((u, i) => ({
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
  }
  if (scriptureId === "yoga-sutras") {
    return padas.map((p) => ({
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
  }
  return [];
}

function buildStaticVerses(scriptureId: string, chapterId: string): ScriptureVerse[] {
  if (scriptureId === "gita") {
    const chNum = parseInt(chapterId.replace("gita-ch-", ""), 10);
    const ch = gitaChapters.find((c) => c.number === chNum);
    if (!ch) return [];
    return ch.shlokas.map((s, i) => ({
      id: s.id,
      scripture_id: "gita",
      chapter_id: chapterId,
      verse_number: s.verse,
      sanskrit: s.sanskrit,
      transliteration: s.transliteration,
      meaning: s.meaning,
      word_meanings: s.word_meanings ?? null,
      is_key_verse: false,
      sort_order: i,
    }));
  }
  if (scriptureId === "upanishad") {
    const uId = chapterId.replace("upanishad-", "");
    const u = upanishads.find((up) => up.id === uId);
    if (!u) return [];
    return u.chapters.flatMap((c) =>
      c.verses.map((v, i) => ({
        id: v.id,
        scripture_id: "upanishad",
        chapter_id: chapterId,
        verse_number: i + 1,
        sanskrit: v.sanskrit,
        transliteration: v.transliteration,
        meaning: v.meaning,
        word_meanings: v.word_meanings ?? null,
        is_key_verse: false,
        sort_order: i,
      }))
    );
  }
  if (scriptureId === "yoga-sutras") {
    const pNum = parseInt(chapterId.replace("yoga-sutras-pada-", ""), 10);
    const p = padas.find((pd) => pd.number === pNum);
    if (!p) return [];
    return p.sutras.map((s, i) => ({
      id: s.id,
      scripture_id: "yoga-sutras",
      chapter_id: chapterId,
      verse_number: s.sutra,
      sanskrit: s.sanskrit,
      transliteration: s.transliteration,
      meaning: s.meaning,
      word_meanings: s.word_meanings ?? null,
      is_key_verse: false,
      sort_order: i,
    }));
  }
  return [];
}

function searchStaticVerses(scriptureId: string, query: string): ScriptureVerse[] {
  if (scriptureId === "gita") {
    return searchShlokas(query).map((s, i) => ({
      id: s.id,
      scripture_id: "gita",
      chapter_id: `gita-ch-${s.chapter}`,
      verse_number: s.verse,
      sanskrit: s.sanskrit,
      transliteration: s.transliteration,
      meaning: s.meaning,
      word_meanings: s.word_meanings ?? null,
      is_key_verse: false,
      sort_order: i,
    }));
  }
  if (scriptureId === "upanishad") {
    return searchUpanishadVerses(query).map((v, i) => ({
      id: v.id,
      scripture_id: "upanishad",
      chapter_id: `upanishad-${v.id.split(".")[0]}`,
      verse_number: i + 1,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      meaning: v.meaning,
      word_meanings: v.word_meanings ?? null,
      is_key_verse: false,
      sort_order: i,
    }));
  }
  if (scriptureId === "yoga-sutras") {
    return searchSutras(query).map((s, i) => ({
      id: s.id,
      scripture_id: "yoga-sutras",
      chapter_id: `yoga-sutras-pada-${s.pada}`,
      verse_number: s.sutra,
      sanskrit: s.sanskrit,
      transliteration: s.transliteration,
      meaning: s.meaning,
      word_meanings: s.word_meanings ?? null,
      is_key_verse: false,
      sort_order: i,
    }));
  }
  return [];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useScripture() {
  const [scriptures, setScriptures] = useState<Scripture[]>(buildStaticScriptures);
  const [loadingScriptures, setLoadingScriptures] = useState(false);

  const [chapters, setChapters] = useState<ScriptureChapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);

  const [verses, setVerses] = useState<ScriptureVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  const [searchResults, setSearchResults] = useState<ScriptureVerse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [currentScriptureId, setCurrentScriptureId] = useState("");
  const [currentChapterId, setCurrentChapterId] = useState("");

  // Cache: chapters per scripture
  const chaptersCache = useRef<Map<string, ScriptureChapter[]>>(new Map());
  // Whether we've tried to load from DB
  const dbChecked = useRef(false);
  const useDb = useRef(false);

  // ── Check if DB tables have data ──────────────────────────────────────────
  useEffect(() => {
    if (dbChecked.current) return;
    dbChecked.current = true;

    (async () => {
      try {
        const { count, error } = await supabase
          .from("scriptures")
          .select("id", { count: "exact", head: true });

        if (!error && count && count > 0) {
          useDb.current = true;
          // Load scripture list from DB
          setLoadingScriptures(true);
          const { data } = await supabase
            .from("scriptures")
            .select("*")
            .order("sort_order");

          if (data && data.length > 0) {
            setScriptures(
              (data as any[]).map((s) => ({
                ...s,
                emoji: SCRIPTURE_EMOJIS[s.id] ?? "📜",
                cover_image: SCRIPTURE_COVERS[s.id] ?? null,
              }))
            );
          }
          setLoadingScriptures(false);
        }
      } catch {
        // DB tables don't exist yet — use static data
      }
    })();
  }, []);

  // ── Internal: load verses for a given scripture + chapter ──────────────────
  const loadVerses = useCallback(
    (scriptureId: string, chapterId: string) => {
      if (useDb.current) {
        setLoadingVerses(true);
        supabase
          .from("scripture_verses")
          .select("*")
          .eq("chapter_id", chapterId)
          .order("sort_order")
          .then(({ data }) => {
            setVerses((data ?? []) as ScriptureVerse[]);
            setLoadingVerses(false);
          });
      } else {
        setVerses(buildStaticVerses(scriptureId, chapterId));
      }
    },
    []
  );

  // ── Select a scripture → load its chapters + first chapter's verses ───────
  const selectScripture = useCallback(
    (id: string) => {
      setCurrentScriptureId(id);
      setCurrentChapterId("");
      setVerses([]);
      setSearchResults([]);

      const finalize = (chs: ScriptureChapter[]) => {
        setChapters(chs);
        if (chs.length > 0) {
          setCurrentChapterId(chs[0].id);
          loadVerses(id, chs[0].id);
        }
      };

      // Check cache first
      const cached = chaptersCache.current.get(id);
      if (cached) {
        finalize(cached);
        return;
      }

      if (useDb.current) {
        setLoadingChapters(true);
        supabase
          .from("scripture_chapters")
          .select("*")
          .eq("scripture_id", id)
          .order("sort_order")
          .then(({ data }) => {
            const chs = (data ?? []) as ScriptureChapter[];
            chaptersCache.current.set(id, chs);
            finalize(chs);
            setLoadingChapters(false);
          });
      } else {
        const chs = buildStaticChapters(id);
        chaptersCache.current.set(id, chs);
        finalize(chs);
      }
    },
    [loadVerses]
  );

  // ── Select a chapter → load its verses ────────────────────────────────────
  const selectChapter = useCallback(
    (chapterId: string) => {
      setCurrentChapterId(chapterId);
      setSearchResults([]);
      loadVerses(currentScriptureId, chapterId);
    },
    [currentScriptureId, loadVerses]
  );

  // ── Search verses ─────────────────────────────────────────────────────────
  const searchVerses = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);

      if (useDb.current) {
        supabase
          .from("scripture_verses")
          .select("*")
          .eq("scripture_id", currentScriptureId)
          .ilike("meaning", `%${query}%`)
          .limit(30)
          .then(({ data }) => {
            setSearchResults((data ?? []) as ScriptureVerse[]);
            setIsSearching(false);
          });
      } else {
        setSearchResults(searchStaticVerses(currentScriptureId, query));
        setIsSearching(false);
      }
    },
    [currentScriptureId]
  );

  return {
    scriptures,
    loadingScriptures,
    chapters,
    loadingChapters,
    verses,
    loadingVerses,
    searchResults,
    isSearching,
    currentScriptureId,
    currentChapterId,
    selectScripture,
    selectChapter,
    searchVerses,
  };
}
