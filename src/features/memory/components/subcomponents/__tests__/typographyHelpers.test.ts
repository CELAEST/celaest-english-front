import { describe, it, expect } from "vitest";
import {
  sanitizeQuotes,
  getDynamicDefinitionClass,
  getDynamicExplanationClass,
  getDynamicSpeakingSentenceClass,
  getDynamicBackTranslationClass,
} from "../typographyHelpers";

describe("Memory Flashcard Typography Helpers", () => {
  it("sanitizes nested, leading and trailing quotes correctly", () => {
    expect(sanitizeQuotes('""cómo / de qué manera""')).toBe("cómo / de qué manera");
    expect(sanitizeQuotes('“obstáculo / cuello de botella”')).toBe("obstáculo / cuello de botella");
    expect(sanitizeQuotes("  'withstand'  ")).toBe("withstand");
    expect(sanitizeQuotes(undefined)).toBe("");
  });

  it("returns larger font classes for short definitions and scales down gracefully for long ones", () => {
    // Short: <= 32 chars
    const shortDef = "cómo / de qué manera";
    expect(getDynamicDefinitionClass(shortDef)).toContain("text-2xl");

    // Medium: 33-65 chars
    const mediumDef = "capacidad para resistir o aguantar una fuerza o presión intensa";
    expect(getDynamicDefinitionClass(mediumDef)).toContain("text-xl");

    // Long: 66-110 chars
    const longDef = "condición en la que un proceso se ralentiza drásticamente debido a la falta de capacidad en una etapa crítica del sistema";
    expect(getDynamicDefinitionClass(longDef)).toContain("text-lg");

    // Extra long: > 110 chars
    const extraLongDef = "definición sumamente extensa con múltiples cláusulas y explicaciones detalladas para garantizar comprensión absoluta en contextos técnicos profesionales avanzados";
    expect(getDynamicDefinitionClass(extraLongDef)).toContain("text-base");
  });

  it("returns appropriate sizing classes for grammatical explanations", () => {
    // Short: <= 55 chars
    const shortExp = "In what way or by what manner or means.";
    expect(getDynamicExplanationClass(shortExp)).toContain("text-base");

    // Medium: 56-110 chars
    const mediumExp = "Used to introduce questions about the manner of an action or condition in formal discourse.";
    expect(getDynamicExplanationClass(mediumExp)).toContain("text-sm");

    // Long: > 180 chars
    const longExp =
      "Cuando el sujeto es compuesto ('my team and I'), se considera primera persona del plural (nosotros). Por lo tanto, el verbo 'to be' debe conjugarse en 'are', no en 'is'. 'Is' se usa solo para tercera persona singular (he, she, it) o cuando 'team' es el único sujeto visto como una entidad singular, pero aquí el 'and I' fuerza el plural.";
    expect(getDynamicExplanationClass(longExp)).toContain("text-[11.5px]");
  });

  it("returns larger font classes for short speaking sentences and adapts proportionally", () => {
    // Short punchy phrase (e.g. "my team and I is communicating" - 33 chars)
    const shortPhrase = "my team and I is communicating";
    const shortClasses = getDynamicSpeakingSentenceClass(shortPhrase);
    expect(shortClasses).toContain("text-xl");
    expect(shortClasses).toContain("lg:text-3xl");

    // Medium phrase (36-65 chars)
    const mediumPhrase = "We should prioritize customer retention over fast acquisition";
    const mediumClasses = getDynamicSpeakingSentenceClass(mediumPhrase);
    expect(mediumClasses).toContain("text-lg");

    // Longer multi-clause phrase (> 110 chars)
    const longPhrase =
      "Although our initial infrastructure deployment encountered unforeseen latencies during peak hours, we quickly mitigated the bottleneck by scaling horizontal workers across regions.";
    const longClasses = getDynamicSpeakingSentenceClass(longPhrase);
    expect(longClasses).toContain("text-[13.5px]");
  });

  it("adjusts back-face translation dynamically when paired with long grammar explanations", () => {
    const translation = "Mi equipo y yo estamos comunicándonos.";

    // Without long explanation: translation gets larger font
    const defaultTranslationClass = getDynamicBackTranslationClass(translation, false);
    expect(defaultTranslationClass).toContain("text-base");

    // With long explanation: translation reduces font size to preserve space for explanation and rating chips
    const constrainedTranslationClass = getDynamicBackTranslationClass(translation, true);
    expect(constrainedTranslationClass).toContain("text-sm");
  });
});
