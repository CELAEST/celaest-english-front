import { describe, it, expect } from "vitest";
import {
  getTargetWordsForDimensions,
  getTargetWordsForHeight,
} from "../useReadingArticles";

describe("Reading Pagination & Viewport Geometry Engine", () => {
  it("Mobile (360x280) Estándar: calculates healthy word capacity without overflow", () => {
    const words = getTargetWordsForDimensions(360, 280, 0);
    // 280 - 48 = 232 usable px. 232 / 30 = 7 lines.
    // 360 / 38 = 9 words/line. 7 * 9 = 63 words.
    expect(words).toBeGreaterThanOrEqual(45);
    expect(words).toBeLessThanOrEqual(75);
  });

  it("Mobile (360x280) Grande: calculates reduced word capacity for larger font", () => {
    const wordsEstandar = getTargetWordsForDimensions(360, 280, 0);
    const wordsGrande = getTargetWordsForDimensions(360, 280, 1);
    expect(wordsGrande).toBeLessThan(wordsEstandar);
    expect(wordsGrande).toBeGreaterThanOrEqual(30);
  });

  it("Tablet / Laptop (975x380) Estándar: fills column symmetrically", () => {
    const words = getTargetWordsForDimensions(680, 380, 0);
    // 380 - 54 = 326 usable px. 326 / 34.5 = 9 lines.
    // 680 / 44 = 15 words/line. 9 * 15 = 135 words.
    expect(words).toBeGreaterThanOrEqual(100);
    expect(words).toBeLessThanOrEqual(160);
  });

  it("Desktop (1440x500) Estándar: supports rich reading pages", () => {
    const words = getTargetWordsForDimensions(680, 500, 0);
    expect(words).toBeGreaterThanOrEqual(140);
  });

  it("Window fallback getTargetWordsForHeight estimates container accurately", () => {
    const wordsMobile = getTargetWordsForHeight(700, 0);
    expect(wordsMobile).toBeGreaterThanOrEqual(40);

    const wordsDesktop = getTargetWordsForHeight(900, 0);
    expect(wordsDesktop).toBeGreaterThan(wordsMobile);
  });

  it("Constrains minimum words per page to at least 16 words on ultra-compact heights", () => {
    const words = getTargetWordsForDimensions(320, 100, 0);
    expect(words).toBeGreaterThanOrEqual(16);
  });
});
