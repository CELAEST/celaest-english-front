import { describe, it, expect } from "vitest";
import { sanitizeFeedbackTone } from "../coreAiEvaluatorService";

describe("sanitizeFeedbackTone", () => {
  it("converts keycap emojis to typographic numbering", () => {
    expect(sanitizeFeedbackTone("1\uFE0F\u20E3 Primero")).toMatch(/^1\.\s*Primero/);
  });

  it("strips decorative emojis from feedback text", () => {
    const input = "Great job \u{1F680} keep it up";
    const output = sanitizeFeedbackTone(input);

    expect(output).not.toMatch(/[\u{1F000}-\u{1FAFF}]/u);
    expect(output).toContain("Great job");
    expect(output).toContain("keep it up");
  });

  it("replaces third-person recruiter language with second person", () => {
    expect(sanitizeFeedbackTone("La respuesta del candidato fue clara")).toContain("Tu respuesta");
    expect(sanitizeFeedbackTone("El candidato debe practicar")).toContain("Te recomendamos");
  });

  it("softens punitive vocabulary into growth-oriented coaching", () => {
    expect(sanitizeFeedbackTone("Tu respuesta es incomprensible")).toContain(
      "idea principal difusa",
    );
    expect(sanitizeFeedbackTone("Hay falta de preparación")).toContain("oportunidad de estructura");
  });

  it("normalizes spacing before punctuation", () => {
    expect(sanitizeFeedbackTone("Hola , mundo !")).toBe("Hola, mundo!");
    expect(sanitizeFeedbackTone("muy bien   .")).toBe("muy bien.");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeFeedbackTone("")).toBe("");
  });
});
