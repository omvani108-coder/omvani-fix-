import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";
import { isNative, configureStatusBar, configureKeyboard } from "@/lib/native";

// ── Sentry error monitoring ────────────────────────────────────────────────
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    enabled: import.meta.env.PROD,
  });
}

// Initialise native shell (no-ops on web)
if (isNative) {
  configureStatusBar();
  configureKeyboard();
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light">
    <App />
  </ThemeProvider>
);
