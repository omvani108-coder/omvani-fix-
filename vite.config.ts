import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "framer-motion",
            "lucide-react",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "cmdk",
            "sonner",
            "vaul",
          ],
          "data-vendor": [
            "@supabase/supabase-js",
            "@tanstack/react-query",
            "zod",
            "react-hook-form",
            "date-fns",
          ],
          sentry: ["@sentry/react"],
          posthog: ["posthog-js"],
        },
      },
    },
  },
});
