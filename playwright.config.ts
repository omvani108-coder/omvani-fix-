import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E test config for OmVani.
 *
 * Run with:
 *   npx playwright test              (headless)
 *   npx playwright test --ui         (interactive UI)
 *   npx playwright test --headed     (visible browser)
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is left in source
  forbidOnly: !!process.env.CI,

  // Retry once on CI
  retries: process.env.CI ? 1 : 0,

  reporter: process.env.CI ? "github" : "html",

  use: {
    // Base URL for all tests — assumes `npm run dev` is running
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Start the dev server before tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
