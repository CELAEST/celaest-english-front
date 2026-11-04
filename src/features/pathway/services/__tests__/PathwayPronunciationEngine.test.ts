import { describe, expect, it } from "vitest";
import { PathwayPronunciationEngine } from "../PathwayPronunciationEngine";

describe("PathwayPronunciationEngine — Real Open-Source Algorithmic Evaluation", () => {
  const target = "I review every detail today";

  it("approves exact authentic match with score >= 90 and zero omissions", () => {
    const res = PathwayPronunciationEngine.evaluate(target, "I review every detail today");
    expect(res.passed).toBe(true);
    expect(res.overallScore).toBeGreaterThanOrEqual(90);
    expect(res.omittedWords).toEqual([]);
    expect(res.mispronouncedWords).toEqual([]);
    expect(res.wordEvaluations.every((w) => w.status === "correct")).toBe(true);
  });

  it("handles case insensitivity and punctuation cleanly", () => {
    const res = PathwayPronunciationEngine.evaluate(
      "“I review every detail today.”",
      "i review every detail today!"
    );
    expect(res.passed).toBe(true);
    expect(res.overallScore).toBeGreaterThanOrEqual(90);
  });

  it("REJECTS and catches omitted words when user skips half the sentence", () => {
    // Restless user says only 2 words out of 5
    const res = PathwayPronunciationEngine.evaluate(target, "I review");
    expect(res.passed).toBe(false);
    expect(res.overallScore).toBeLessThan(80);
    expect(res.omittedWords).toContain("every");
    expect(res.omittedWords).toContain("detail");
    expect(res.omittedWords).toContain("today");
    expect(res.feedbackSpanish).toContain("te comiste");
  });

  it("detects classic Spanish L1 traps (espeak instead of speak)", () => {
    const res = PathwayPronunciationEngine.evaluate(
      "I speak English",
      "I espeak English"
    );
    expect(res.mispronouncedWords.length).toBeGreaterThan(0);
    const speakMistake = res.mispronouncedWords.find((m) => m.word === "speak");
    expect(speakMistake).toBeDefined();
    expect(speakMistake?.tip).toContain("Evita añadir una 'e'");
  });

  it("REJECTS completely unrelated Spanish input without false positive 95%", () => {
    // Restless user says random Spanish
    const res = PathwayPronunciationEngine.evaluate(target, "hola como estas amigo mio");
    expect(res.passed).toBe(false);
    expect(res.overallScore).toBeLessThan(50);
    expect(res.omittedWords.length).toBeGreaterThan(0);
  });

  it("REJECTS total silence or empty transcript safely", () => {
    const res = PathwayPronunciationEngine.evaluate(target, "");
    expect(res.passed).toBe(false);
    expect(res.overallScore).toBeLessThan(30);
    expect(res.feedbackSpanish).toContain("No te escuché hablar");
  });

  it("accepts minor acceptable fuzzy speech if >= 80% accuracy and all words covered", () => {
    // Slightly imperfect articulation of 'detail' as 'detaile'
    const res = PathwayPronunciationEngine.evaluate(
      "I learn today",
      "I learn todey"
    );
    expect(res.completenessScore).toBe(100);
    expect(res.wordEvaluations.some((w) => w.status === "near_miss")).toBe(true);
  });
});

