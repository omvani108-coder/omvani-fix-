/**
 * useScriptureBookmarks
 *
 * Cloud-synced bookmarks for Gita, Upanishad, and Yoga Sutras.
 * Falls back to localStorage when unauthenticated.
 * On first sign-in, migrates existing localStorage bookmarks to Supabase.
 *
 * Usage:
 *   const { isBookmarked, toggleBookmark } = useScriptureBookmarks("gita");
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ScriptureType =
  | "gita"
  | "upanishad"
  | "yoga_sutras"
  | "hanuman_chalisa"
  | "sunderkand"
  | "vishnu_sahasranama"
  | "lalita_sahasranama"
  | "shiv_tandav"
  | "aditya_hridayam"
  | "guru_granth_sahib";

// ── localStorage keys (legacy — used for migration only) ─────────────────────

const LS_KEYS: Record<ScriptureType, string> = {
  gita:                "omvani_bookmarks",
  upanishad:           "omvani_upanishad_bookmarks",
  yoga_sutras:         "omvani_sutra_bookmarks",
  hanuman_chalisa:     "omvani_hanuman_chalisa_bookmarks",
  sunderkand:          "omvani_sunderkand_bookmarks",
  vishnu_sahasranama:  "omvani_vishnu_sahasranama_bookmarks",
  lalita_sahasranama:  "omvani_lalita_sahasranama_bookmarks",
  shiv_tandav:         "omvani_shiv_tandav_bookmarks",
  aditya_hridayam:     "omvani_aditya_hridayam_bookmarks",
  guru_granth_sahib:   "omvani_guru_granth_sahib_bookmarks",
};

function lsLoad(type: ScriptureType): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS[type]) ?? "[]");
  } catch {
    return [];
  }
}

function lsSave(type: ScriptureType, ids: string[]) {
  try {
    localStorage.setItem(LS_KEYS[type], JSON.stringify(ids));
  } catch {}
}

function lsClear(type: ScriptureType) {
  try {
    localStorage.removeItem(LS_KEYS[type]);
  } catch {}
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

async function fetchBookmarks(
  userId: string,
  type: ScriptureType
): Promise<string[]> {
  const { data, error } = await supabase
    .from("scripture_bookmarks")
    .select("bookmark_ids")
    .eq("user_id", userId)
    .eq("scripture_type", type)
    .maybeSingle();

  if (error || !data) return [];
  return (data.bookmark_ids as string[]) ?? [];
}

async function saveBookmarks(
  userId: string,
  type: ScriptureType,
  ids: string[]
): Promise<void> {
  await supabase.from("scripture_bookmarks").upsert(
    {
      user_id: userId,
      scripture_type: type,
      bookmark_ids: ids,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,scripture_type" }
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useScriptureBookmarks(type: ScriptureType) {
  const { user } = useAuth();
  const [bookmarkIds, setBookmarkIds] = useState<string[]>(() => lsLoad(type));
  const hasMerged = useRef(false);

  // ── Initial load + one-time localStorage → Supabase migration ─────────────
  useEffect(() => {
    if (!user || hasMerged.current) return;
    hasMerged.current = true;

    (async () => {
      const localIds = lsLoad(type);
      const remoteIds = await fetchBookmarks(user.id, type);

      // Merge: union of local + remote, deduped
      const merged = Array.from(new Set([...remoteIds, ...localIds]));

      // If local had anything new, push the merged set back to Supabase
      const hasNew = localIds.some((id) => !remoteIds.includes(id));
      if (hasNew) {
        await saveBookmarks(user.id, type, merged);
      }

      // Clear localStorage after successful migration
      if (localIds.length > 0) {
        lsClear(type);
      }

      setBookmarkIds(merged);
    })();
  }, [user, type]);

  // ── Toggle a single bookmark ───────────────────────────────────────────────
  const toggleBookmark = useCallback(
    (id: string): boolean => {
      let added = false;

      setBookmarkIds((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((b) => b !== id) : [...prev, id];
        added = !exists;

        if (user) {
          saveBookmarks(user.id, type, next).catch(console.error);
        } else {
          lsSave(type, next);
        }

        return next;
      });

      return added;
    },
    [user, type]
  );

  const isBookmarked = useCallback(
    (id: string) => bookmarkIds.includes(id),
    [bookmarkIds]
  );

  return { bookmarkIds, isBookmarked, toggleBookmark };
}
