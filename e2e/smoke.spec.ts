import { test, expect } from "@playwright/test";

/**
 * Smoke tests — verify the app loads and critical pages are accessible.
 * These run against the local dev server (http://localhost:8080).
 */

test.describe("Landing page", () => {
  test("loads and shows the OmVani brand", async ({ page }) => {
    await page.goto("/");
    // The landing page should contain the app name
    await expect(page.locator("body")).toContainText("OmVani");
  });

  test("has correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/OmVani/i);
  });

  test("displays pricing section with plans", async ({ page }) => {
    await page.goto("/");
    // Scroll down or check for plan names
    await expect(page.locator("body")).toContainText("Seeker");
    await expect(page.locator("body")).toContainText("Sadhak");
    await expect(page.locator("body")).toContainText("Guru");
  });

  test("navbar is visible", async ({ page }) => {
    await page.goto("/");
    // Navbar uses <header> as the outer element
    const header = page.locator("header");
    await expect(header).toBeVisible();
  });
});

test.describe("Auth pages", () => {
  test("signup page loads", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("body")).toContainText(/sign up|create account|get started|free trial/i);
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toContainText(/sign in|log in|welcome/i);
  });
});

test.describe("Protected pages redirect", () => {
  test("chat page redirects unauthenticated user", async ({ page }) => {
    await page.goto("/chat");
    // Should either redirect to login/signup or show auth prompt
    await page.waitForTimeout(1000);
    const url = page.url();
    const hasAuth = url.includes("login") || url.includes("signup");
    const bodyText = await page.locator("body").textContent();
    const hasAuthPrompt = bodyText?.match(/sign in|log in|sign up/i);
    // Either redirected or showing auth-related content
    expect(hasAuth || hasAuthPrompt).toBeTruthy();
  });
});

test.describe("Feature pages load", () => {
  test("scriptures page loads", async ({ page }) => {
    await page.goto("/scriptures");
    await expect(page.locator("body")).toContainText(/Gita|scripture|Upanishad/i);
  });

  test("mandirs page loads", async ({ page }) => {
    await page.goto("/mandirs");
    await expect(page.locator("body")).toContainText(/temple|mandir/i);
  });

  test("bhajans page loads", async ({ page }) => {
    await page.goto("/bhajans");
    await expect(page.locator("body")).toContainText(/bhajan|mantra/i);
  });
});

test.describe("404 handling", () => {
  test("unknown route shows 404 page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    // NotFound.tsx renders "Page Not Found"
    await expect(page.locator("body")).toContainText("Page Not Found");
  });
});
