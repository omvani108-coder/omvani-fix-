/**
 * native.ts
 * Thin bridge between the web app and Capacitor native APIs.
 * All imports are dynamic so tree-shaking removes them in pure-web builds.
 *
 * Usage:
 *   import { isNative, nativeCamera, nativePush, nativeBrowser, nativeShare } from "@/lib/native";
 */

import { Capacitor } from "@capacitor/core";

/** true when running inside the Capacitor native shell (iOS / Android) */
export const isNative = Capacitor.isNativePlatform();

/** Current platform: "ios" | "android" | "web" */
export const platform = Capacitor.getPlatform();

// ── Camera ────────────────────────────────────────────────────────────────────

export async function nativeCamera(): Promise<string | null> {
  if (!isNative) return null;
  const { Camera, CameraResultType, CameraSource } = await import(
    "@capacitor/camera"
  );
  const photo = await Camera.getPhoto({
    quality: 80,
    resultType: CameraResultType.Base64,
    source: CameraSource.Prompt, // lets user choose camera or gallery
    width: 1024,
    height: 1024,
  });
  return photo.base64String ?? null;
}

// ── Push Notifications ────────────────────────────────────────────────────────

export async function registerNativePush(): Promise<string | null> {
  if (!isNative) return null;
  const { PushNotifications } = await import("@capacitor/push-notifications");

  const perm = await PushNotifications.requestPermissions();
  if (perm.receive !== "granted") return null;

  await PushNotifications.register();

  return new Promise((resolve) => {
    PushNotifications.addListener("registration", (token) => {
      resolve(token.value);
    });
    PushNotifications.addListener("registrationError", () => {
      resolve(null);
    });
  });
}

// ── In-App Browser (for Razorpay, external links) ────────────────────────────

export async function openInAppBrowser(url: string): Promise<void> {
  if (!isNative) {
    window.open(url, "_blank");
    return;
  }
  const { Browser } = await import("@capacitor/browser");
  await Browser.open({ url });
}

// ── Share ──────────────────────────────────────────────────────────────────────

export async function nativeShare(opts: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<void> {
  if (!isNative) {
    // Fallback: Web Share API
    if (navigator.share) {
      await navigator.share(opts);
    }
    return;
  }
  const { Share } = await import("@capacitor/share");
  await Share.share(opts);
}

// ── Status Bar ────────────────────────────────────────────────────────────────

export async function configureStatusBar(): Promise<void> {
  if (!isNative) return;
  const { StatusBar, Style } = await import("@capacitor/status-bar");
  await StatusBar.setStyle({ style: Style.Dark });
  if (platform === "android") {
    await StatusBar.setBackgroundColor({ color: "#6b1a1a" });
  }
}

// ── Haptics ───────────────────────────────────────────────────────────────────

export async function hapticLight(): Promise<void> {
  if (!isNative) return;
  const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
  await Haptics.impact({ style: ImpactStyle.Light });
}

// ── Keyboard ──────────────────────────────────────────────────────────────────

export async function configureKeyboard(): Promise<void> {
  if (!isNative) return;
  const { Keyboard } = await import("@capacitor/keyboard");
  Keyboard.addListener("keyboardWillShow", () => {
    document.body.classList.add("keyboard-visible");
  });
  Keyboard.addListener("keyboardWillHide", () => {
    document.body.classList.remove("keyboard-visible");
  });
}
