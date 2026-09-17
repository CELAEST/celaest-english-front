import { describe, it, expect } from "vitest";
import { OnboardingDiagnosticEvaluator } from "../onboardingDiagnosticEvaluator";

describe("OnboardingDiagnosticEvaluator", () => {
  it("calibrates short basic answers as A1 or A2", () => {
    const answers = [
      "I am a cook. I make food in kitchen.",
      "Yesterday we had problem with meat.",
      "I want to make good food always.",
    ];
    const result = OnboardingDiagnosticEvaluator.evaluate(answers);
    expect(["A1", "A2"]).toContain(result.cefrCode);
    expect(result.compositeScore).toBeLessThan(65);
  });

  it("calibrates intermediate communicative answers as B1 or B2", () => {
    const answers = [
      "I work as a Chef in a busy restaurant. My daily routine involves preparing the mis en place, coordinating with the kitchen staff, and ensuring high quality.",
      "During a Saturday dinner rush, our main oven broke down. However, I collaborated with my team to adjust our menu and cook using our secondary stations.",
      "If I could lead a project, I would create a zero-waste cooking program because sustainability is very important for the restaurant industry.",
    ];
    const result = OnboardingDiagnosticEvaluator.evaluate(answers);
    expect(["B1", "B2"]).toContain(result.cefrCode);
    expect(result.compositeScore).toBeGreaterThanOrEqual(65);
    expect(result.keyStrengths.length).toBeGreaterThan(0);
  });

  it("calibrates complex, nuanced answers with C1 connectors as C1", () => {
    const answers = [
      "As an Executive Chef, I oversee culinary architecture, menu design, and supplier logistics while mentoring our junior staff on modern gastronomic techniques.",
      "We encountered an unprecedented supply chain disruption regarding our organic ingredients; furthermore, our team had to negotiate with local farmers and redesign our tasting menu overnight.",
      "If I were to lead an industry transformation, I would leverage circular economy principles to inevitably reduce food waste, arguably balancing culinary excellence with economic sustainability.",
    ];
    const result = OnboardingDiagnosticEvaluator.evaluate(answers);
    expect(["C1", "C2"]).toContain(result.cefrCode);
    expect(result.compositeScore).toBeGreaterThanOrEqual(85);
  });

  it("calibrates dual signals combining placement quiz and conversational production", () => {
    const answers = [
      "I am a cook. I make food in kitchen.",
      "Yesterday we had problem with meat.",
      "I want to make good food always.",
    ];
    const placementResult = {
      score: 3,
      totalQuestions: 4,
      estimatedLevel: "B1" as const,
      levelTitle: "B1 — Intermediate",
      answers: [],
    };
    const result = OnboardingDiagnosticEvaluator.evaluate(answers, placementResult);
    expect(result.aiDossierSummary).toContain("Receptive Placement Quiz: 3/4 (B1)");
    expect(result.aiDossierSummary).toContain("Productive Chat:");
    expect(result.cefrCode).toBeDefined();
  });

  it("correctly flags Spanish responses and forces A1 Beginner calibration (not A2 or B1)", () => {
    const spanishAnswers = [
      "hola yo soy buzo y trabajo en el mar todos los dias",
      "ayer tuvimos un problema en el trabajo pero lo solucionamos",
      "quiero aprender ingles para mejorar mi futuro",
    ];
    const placementResult = {
      score: 3,
      totalQuestions: 4,
      estimatedLevel: "B1" as const,
      levelTitle: "B1 — Intermediate",
      answers: [],
    };
    const result = OnboardingDiagnosticEvaluator.evaluate(spanishAnswers, placementResult);
    expect(result.isSpanishDetected).toBe(true);
    expect(result.cefrCode).toBe("A1");
    expect(result.cefrLabel).toBe("A1 — Beginner");
    expect(result.compositeScore).toBeLessThanOrEqual(30);
    expect(result.aiDossierSummary).toContain("answered the conversation in Spanish");
  });

  it("handles explicit beginner surrender ('no se ingles') by calibrating immediately at A1", () => {
    const answers = ["no se ingles"];
    const placementResult = {
      score: 2,
      totalQuestions: 4,
      estimatedLevel: "A2" as const,
      levelTitle: "A2 — Elementary",
      answers: [],
    };
    const result = OnboardingDiagnosticEvaluator.evaluate(answers, placementResult);
    expect(result.cefrCode).toBe("A1");
    expect(result.cefrLabel).toBe("A1 — Beginner");
    expect(result.compositeScore).toBe(20);
    expect(result.aiDossierSummary).toContain("no se ingles");
  });
});
