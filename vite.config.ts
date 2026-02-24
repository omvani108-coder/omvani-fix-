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
  test: {
    // Use jsdom so React components and browser APIs work in tests
    environment: "jsdom",
    // Make vitest globals (describe, it, expect, vi) available without importing
    globals: true,
    // Run the jest-dom matchers setup before every test file
    setupFiles: ["./src/test/setup.ts"],
  },
});
