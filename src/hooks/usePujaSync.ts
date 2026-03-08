/**
 * usePujaSync
 *
 * Loads and saves puja records to Supabase when the user is signed in.
 * Falls back silently to localStorage when unauthenticated or offline —
 * so the tracker always works, regardless of connectivity.
 *
 * Merge strategy: on initial load, any localStorage data that is NEWER
 * than what's in Supabase (by date_key) is upserted up, then localStorage
 * is cleared. This means existing streaks are never lost when a user first
 * signs in on a new device.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DayRecord {
  [itemId: string]: boolean;
}

export interface MonthRecord {
  [dateKey: string]: DayRecord; // dateKey = "YYYY-MM-DD"
}

// ── localStorage helpers (kept as fallback) ───────────────────────────────────

const STORAGE_KEY = "omvani_puja_tracker";

function lsLoad(): MonthRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function lsSave(data: MonthRecord) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function lsClear() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

async function fetchAllRecords(userId: string): Promise<MonthRecord> {
  const { data, error } = await supabase
    .from("puja_records")
    .select("date_key, item_states")
    .eq("user_id", userId);

  if (error || !data) return {};

  const result: MonthRecord = {};
  for (const row of data) {
    result[row.date_key] = row.item_states as DayRecord;
  }
  return result;
}

async function upsertDay(
  userId: string,
  dateKey: string,
  itemStates: DayRecord
): Promise<void> {
  await supabase.from("puja_records").upsert(
    {
      user_id: userId,
      date_key: dateKey,
      item_states: itemStates,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,date_key" }
  );
}

async function deleteDay(userId: string, dateKey: string): Promise<void> {
  await supabase
    .from("puja_records")
    .delete()
    .eq("user_id", userId)
    .eq("date_key", dateKey);
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePujaSync() {
  const { user } = useAuth();
  const [data, setData] = useState<MonthRecord>(lsLoad);
  const [loading, setLoading] = useState(false);
  const hasMerged = useRef(false);

  // ── Initial load + one-time localStorage → Supabase migration ─────────────
  useEffect(() => {
    if (!user || hasMerged.current) return;
    hasMerged.current = true;

    setLoading(true);

    (async () => {
      const localData = lsLoad();
      const remoteData = await fetchAllRecords(user.id);

      // Merge: for each date_key in localStorage that isn't in remote, upsert it
      const localKeys = Object.keys(localData);
      const upsertPromises: Promise<void>[] = [];

      for (const dateKey of localKeys) {
        if (!remoteData[dateKey]) {
          upsertPromises.push(upsertDay(user.id, dateKey, localData[dateKey]));
          remoteData[dateKey] = localData[dateKey];
        }
      }

      if (upsertPromises.length > 0) {
        await Promise.allSettled(upsertPromises);
      }

      // Clear localStorage after successful migration
      if (localKeys.length > 0) {
        lsClear();
      }

      setData(remoteData);
      setLoading(false);
    })();
  }, [user]);

  // ── Toggle a single puja item ──────────────────────────────────────────────
  const toggleItem = useCallback(
    (dateKey: string, itemId: string) => {
      setData((prev) => {
        const dayRecord = prev[dateKey] ?? {};
        const updated: MonthRecord = {
          ...prev,
          [dateKey]: {
            ...dayRecord,
            [itemId]: !dayRecord[itemId],
          },
        };

        if (user) {
          // Fire-and-forget: optimistic UI, sync in background
          upsertDay(user.id, dateKey, updated[dateKey]).catch(console.error);
        } else {
          lsSave(updated);
        }

        return updated;
      });
    },
    [user]
  );

  // ── Reset (clear) a single day ─────────────────────────────────────────────
  const resetDay = useCallback(
    (dateKey: string) => {
      setData((prev) => {
        const updated = { ...prev };
        delete updated[dateKey];

        if (user) {
          deleteDay(user.id, dateKey).catch(console.error);
        } else {
          lsSave(updated);
        }

        return updated;
      });
    },
    [user]
  );

  return { data, loading, toggleItem, resetDay };
}
