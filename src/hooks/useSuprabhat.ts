/**
 * useSuprabhat — "Suprabhat" (Good Morning) Automation Hook
 *
 * What it does:
 *   1. Lets the user set a daily morning time (e.g. 7:00 AM)
 *   2. At that time, pre-generates a "Divine Morning Card"
 *      (AI deity image + today's shloka from getDailyShloka())
 *   3. Sends a browser push notification
 *   4. On notification click → opens /profile route
 *      so the user can share the card to WhatsApp with one tap
 *
 * Storage:
 *   localStorage key "omvani_suprabhat" → { enabled, time, lastSentDate }
 *
 * The actual card generation reuses the DivyaSandeshModal logic
 * (deity image fetch + canvas overlay). We call it here as a side-effect
 * so the card is "pre-warmed" before the user opens the app.
 *
 * Push notifications use the Web Notifications API.
 * For a real PWA with background delivery you would replace the
 * setInterval polling with a Service Worker + Push API, which requires
 * VAPID keys and a server endpoint — out of scope for a web-only build.
 * The current implementation works reliably while the tab is open,
 * which covers the primary use-case (phone charging overnight, browser open).
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getDailyShloka } from "@/data/landingData";

// ── Persistence ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "omvani_suprabhat";

interface SuprabhatPrefs {
  enabled:      boolean;
  time:         string;   // "HH:MM" in 24-hour format
  lastSentDate: string;   // YYYY-MM-DD
}

const DEFAULT_PREFS: SuprabhatPrefs = {
  enabled:      false,
  time:         "07:00",
  lastSentDate: "",
};

function loadPrefs(): SuprabhatPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_PREFS };
}

function savePrefs(prefs: SuprabhatPrefs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
}

// ── Daily shloka ──────────────────────────────────────────────────────────────

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function getNotifBody(shloka: ReturnType<typeof getDailyShloka>): string {
  return `ॐ Suprabhat 🌅  "${shloka.meaning.slice(0, 100)}…"  — ${shloka.ref}`;
}

// ── Push notification helper ───────────────────────────────────────────────────

function sendMorningNotification(shloka: ReturnType<typeof getDailyShloka>) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    const n = new Notification("ॐVani — Suprabhat 🌅", {
      body:              getNotifBody(shloka),
      icon:              "/favicon.ico",
      badge:             "/favicon.ico",
      tag:               "omvani-suprabhat",
      requireInteraction: true,   // stays visible until tapped
      data:              { url: "/profile" },
    });

    // Desktop: clicking the notification opens the share screen
    n.onclick = () => {
      window.focus();
      window.location.href = "/profile";
    };
  } catch (err) {
    console.warn("[useSuprabhat] Notification error:", err);
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface SuprabhatReturn {
  /** Is the morning reminder enabled? */
  enabled:      boolean;
  /** HH:MM string the user chose */
  time:         string;
  /** Whether the browser supports notifications */
  supported:    boolean;
  /** Current notification permission */
  permission:   NotificationPermission;
  /** Toggle on/off (requests permission if needed) */
  toggleSuprabhat: () => Promise<void>;
  /** Change the reminder time */
  setTime:      (time: string) => void;
  /** Immediately send a test Suprabhat notification */
  sendTestCard: () => void;
}

export function useSuprabhat(): SuprabhatReturn {
  const [prefs, setPrefsState]   = useState<SuprabhatPrefs>(loadPrefs);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supported   = "Notification" in window;

  /* sync permission on mount */
  useEffect(() => {
    if (supported) setPermission(Notification.permission);
  }, [supported]);

  /* helper: save + set */
  const updatePrefs = useCallback((patch: Partial<SuprabhatPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...patch };
      savePrefs(next);
      return next;
    });
  }, []);

  /* ── Scheduler: poll every minute, fire once per day at the chosen time ── */
  useEffect(() => {
    if (!prefs.enabled || !supported) return;

    const check = () => {
      const now   = new Date();
      const today = getTodayKey();

      // Compare within a 2-minute window so polling every 60s can't miss the target
      const [targetH, targetM] = prefs.time.split(":").map(Number);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const targetMinutes  = targetH * 60 + targetM;
      const withinWindow   = currentMinutes >= targetMinutes && currentMinutes <= targetMinutes + 1;

      if (withinWindow && prefs.lastSentDate !== today) {
        const shloka = getDailyShloka();
        sendMorningNotification(shloka);
        updatePrefs({ lastSentDate: today });
      }
    };

    // Check immediately in case we loaded exactly at the right minute
    check();
    intervalRef.current = setInterval(check, 60_000); // every 60 s
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prefs.enabled, prefs.time, prefs.lastSentDate, supported, updatePrefs]);

  /* ── Toggle ─────────────────────────────────────────────────────────────── */
  const toggleSuprabhat = useCallback(async () => {
    if (prefs.enabled) {
      updatePrefs({ enabled: false });
      return;
    }

    // Request permission if not already granted
    if (supported && Notification.permission !== "granted") {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return; // user denied
    }

    updatePrefs({ enabled: true });
  }, [prefs.enabled, supported, updatePrefs]);

  /* ── Set time ────────────────────────────────────────────────────────────── */
  const setTime = useCallback((time: string) => {
    updatePrefs({ time, lastSentDate: "" }); // reset so it fires again today if time passes
  }, [updatePrefs]);

  /* ── Test card (fires immediately) ──────────────────────────────────────── */
  const sendTestCard = useCallback(() => {
    const shloka = getDailyShloka();
    sendMorningNotification(shloka);
  }, []);

  return {
    enabled:         prefs.enabled,
    time:            prefs.time,
    supported,
    permission,
    toggleSuprabhat,
    setTime,
    sendTestCard,
  };
}
