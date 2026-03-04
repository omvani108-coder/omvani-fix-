import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import { isNative, configureStatusBar, configureKeyboard } from "@/lib/native";

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
