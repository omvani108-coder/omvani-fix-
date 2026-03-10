/**
 * Tests for landing page data and utility functions.
 *
 * Verifies content integrity, shloka rotation, and plan structure.
 */

import { describe, it, expect } from "vitest";
import {
  getDailyShloka,
  shlokas,
  plans,
} from "@/data/landingData";
import type { LandingPlan } from "@/data/landingData";

// ── Shlokas ────────────────────────────────────────────────────────────────────

describe("shlokas", () => {
  it("has at least 5 entries", () => {
    expect(shlokas.length).toBeGreaterThanOrEqual(5);
  });

  it("every shloka has ref, sanskrit, and meaning", () => {
    for (const s of shlokas) {
      expect(s.ref).toBeTruthy();
      expect(s.sanskrit.length).toBeGreaterThan(10);
      expect(s.meaning.length).toBeGreaterThan(10);
    }
  });
});

describe("getDailyShloka", () => {
  it("returns a valid shloka object", () => {
    const shloka = getDailyShloka();
    expect(shloka).toHaveProperty("ref");
    expect(shloka).toHaveProperty("sanskrit");
    expect(shloka).toHaveProperty("meaning");
  });

  it("always returns from the shlokas array", () => {
    const shloka = getDailyShloka();
    expect(shlokas).toContain(shloka);
  });

  it("deterministic — same call returns same result", () => {
    const a = getDailyShloka();
    const b = getDailyShloka();
    expect(a).toBe(b);
  });
});

// ── Pricing plans ──────────────────────────────────────────────────────────────

describe("plans", () => {
  it("has at least 3 plans", () => {
    expect(plans.length).toBeGreaterThanOrEqual(3);
  });

  it("every plan has required fields", () => {
    for (const plan of plans) {
      expect(plan.name).toBeTruthy();
      expect(plan.id).toBeTruthy();
      expect(plan.price).toBeTruthy();
      expect(plan.cta).toBeTruthy();
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });

  it("has a free plan", () => {
    const free = plans.find((p: LandingPlan) => p.price === "Free");
    expect(free).toBeTruthy();
    expect(free!.id).toBe("free");
  });

  it("every plan has unique id", () => {
    const ids = plans.map((p: LandingPlan) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
