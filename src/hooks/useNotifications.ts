/**
 * useNotifications.ts
 * Manages browser push notifications for OmVani.
 * - Requests permission
 * - Schedules daily shloka at 7am
 * - Persists preference in localStorage
 */

import { useState, useEffect, useCallback } from "react";

const PREF_KEY = "omvani_notifications_enabled";
const LAST_NOTIF_KEY = "omvani_last_notification_date";

// Daily shlokas for notifications — rotates by day of year
const DAILY_SHLOKAS = [
  { verse: "Gita 2.47", text: "You have the right to perform your duties, but not to the fruits of your actions." },
  { verse: "Gita 2.20", text: "The soul is never born nor dies at any time. It is unborn, eternal, ever-existing and primeval." },
  { verse: "Gita 4.7",  text: "Whenever there is a decline in righteousness, I manifest Myself to restore it." },
  { verse: "Gita 9.22", text: "To those who worship Me with devotion, I carry what they lack and preserve what they have." },
  { verse: "Gita 18.66", text: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sins." },
  { verse: "Gita 6.35", text: "The mind is restless — but it can be controlled by practice and detachment." },
  { verse: "Gita 12.13", text: "One who is not envious but is a kind friend to all living entities is very dear to Me." },
];

function getTodayShloka() {
  const day = Math.floor(Date.now() / 86_400_000);
  return DAILY_SHLOKAS[day % DAILY_SHLOKAS.length];
}

function isSupported(): boolean {
  return "Notification" in window;
}

export function useNotifications() {
  const [permission, setPermission]   = useState<NotificationPermission>("default");
  const [enabled, setEnabled]         = useState(false);
  const [supported]                   = useState(isSupported);

  // Load saved preference
  useEffect(() => {
    if (!supported) return;
    setPermission(Notification.permission);
    const saved = localStorage.getItem(PREF_KEY);
    setEnabled(saved === "true" && Notification.permission === "granted");
  }, [supported]);

  // Schedule daily notification check
  useEffect(() => {
    if (!enabled || !supported) return;

    const checkAndNotify = () => {
      const today = new Date().toDateString();
      const last  = localStorage.getItem(LAST_NOTIF_KEY);
      const hour  = new Date().getHours();

      // Send once per day, after 7am
      if (last !== today && hour >= 7) {
        const shloka = getTodayShloka();
        sendNotification(
          "ॐ OmVani — Daily Shloka",
          `${shloka.text} — ${shloka.verse}`,
        );
        localStorage.setItem(LAST_NOTIF_KEY, today);
      }
    };

    // Check immediately on mount
    checkAndNotify();

    // Check every hour
    const interval = setInterval(checkAndNotify, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [enabled, supported]);

  const sendNotification = (title: string, body: string) => {
    if (!supported || Notification.permission !== "granted") return;
    try {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "omvani-daily",
        requireInteraction: false,
      });
    } catch (err) {
      console.warn("Notification failed:", err);
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!supported) return false;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch {
      return false;
    }
  }, [supported]);

  const enableNotifications = useCallback(async (): Promise<boolean> => {
    if (!supported) return false;

    let granted = Notification.permission === "granted";
    if (!granted) {
      granted = await requestPermission();
    }

    if (granted) {
      setEnabled(true);
      localStorage.setItem(PREF_KEY, "true");

      // Send a welcome notification immediately
      sendNotification(
        "ॐ OmVani Notifications Enabled",
        "You will receive your daily shloka every morning at 7am. 🙏",
      );
      return true;
    }
    return false;
  }, [supported, requestPermission]);

  const disableNotifications = useCallback(() => {
    setEnabled(false);
    localStorage.setItem(PREF_KEY, "false");
  }, []);

  const toggleNotifications = useCallback(async () => {
    if (enabled) {
      disableNotifications();
    } else {
      await enableNotifications();
    }
  }, [enabled, enableNotifications, disableNotifications]);

  return {
    supported,
    permission,
    enabled,
    toggleNotifications,
    enableNotifications,
    disableNotifications,
    sendNotification,
  };
}
