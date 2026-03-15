/**
 * useNotifications.ts
 * Manages browser push notifications for OmVani.
 * - Requests permission
 * - Schedules daily shloka at 7am
 * - Persists preference in localStorage
 */

import { useState, useEffect, useCallback } from "react";
import { getDailyShloka } from "@/data/landingData";
import { isNative, registerNativePush } from "@/lib/native";

const PREF_KEY = "omvani_notifications_enabled";
const LAST_NOTIF_KEY = "omvani_last_notification_date";

function isSupported(): boolean {
  return isNative || "Notification" in window;
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
        const shloka = getDailyShloka();
        sendNotification(
          "ॐ OmVani — Daily Shloka",
          `${shloka.meaning.slice(0, 120)}… — ${shloka.ref}`,
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

    // Native push (Capacitor)
    if (isNative) {
      const token = await registerNativePush();
      if (token) {
        setPermission("granted");
        // TODO: send token to your backend for server-side push
        return true;
      }
      setPermission("denied");
      return false;
    }

    // Web push
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
