/**
 * Tests for animation variants.
 *
 * Verifies structure and values of framer-motion animation presets.
 */

import { describe, it, expect } from "vitest";
import { fadeUp, fadeIn, slideInLeft, defaultViewport } from "@/lib/animations";

describe("fadeUp variant", () => {
  it("hidden state has opacity 0 and positive y offset", () => {
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: 30 });
  });

  it("visible is a function accepting custom index", () => {
    expect(typeof fadeUp.visible).toBe("function");
    const result = (fadeUp.visible as (i: number) => Record<string, unknown>)(0);
    expect(result.opacity).toBe(1);
    expect(result.y).toBe(0);
  });

  it("stagger delay increases with index", () => {
    const fn = fadeUp.visible as (i: number) => { transition: { delay: number } };
    const delay0 = fn(0).transition.delay;
    const delay2 = fn(2).transition.delay;
    expect(delay2).toBeGreaterThan(delay0);
  });
});

describe("fadeIn variant", () => {
  it("hidden state has opacity 0", () => {
    expect(fadeIn.hidden).toEqual({ opacity: 0 });
  });

  it("visible returns opacity 1", () => {
    const result = (fadeIn.visible as (i: number) => Record<string, unknown>)(0);
    expect(result.opacity).toBe(1);
  });
});

describe("slideInLeft variant", () => {
  it("hidden state has negative x offset", () => {
    expect((slideInLeft.hidden as Record<string, number>).x).toBeLessThan(0);
  });

  it("visible state has x=0", () => {
    expect((slideInLeft.visible as Record<string, number>).x).toBe(0);
  });
});

describe("defaultViewport", () => {
  it("has once: true to fire only once", () => {
    expect(defaultViewport.once).toBe(true);
  });

  it("has negative margin for early trigger", () => {
    expect(defaultViewport.margin).toBe("-80px");
  });
});
