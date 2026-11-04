import { describe, expect, it } from "vitest";
import { ENGLISH_ANATOMY_PILLARS, ANATOMY_LEVELS } from "../englishAnatomyData";
import { ANATOMY_SHOWCASE } from "../englishAnatomyShowcase";

describe("English Anatomy guide — content integrity", () => {
  it("every block has a featured example whose highlight appears in the correct sentence", () => {
    for (const pillar of ENGLISH_ANATOMY_PILLARS) {
      const showcase = ANATOMY_SHOWCASE[pillar.id];
      expect(showcase, `missing showcase for ${pillar.id}`).toBeDefined();
      expect(showcase!.correct.toLowerCase()).toContain(showcase!.highlight.toLowerCase());
      expect(showcase!.wrong).not.toBe(showcase!.correct);
    }
  });

  it("every item example contains its highlight token", () => {
    for (const pillar of ENGLISH_ANATOMY_PILLARS) {
      for (const item of pillar.items) {
        expect(item.example.english.toLowerCase(), `${pillar.id} / ${item.token}`).toContain(
          item.example.highlightToken.toLowerCase(),
        );
      }
    }
  });

  it("blocks are ordered from simplest to most complex level", () => {
    const levels = ENGLISH_ANATOMY_PILLARS.map((p) => p.levelId);
    expect(levels).toEqual([...levels].sort((a, b) => a - b));
    expect(new Set(levels).size).toBe(ANATOMY_LEVELS.length);
  });
});

