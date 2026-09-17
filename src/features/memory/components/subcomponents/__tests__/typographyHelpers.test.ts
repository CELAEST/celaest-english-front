import { describe, it, expect } from "vitest";
import {
  sanitizeQuotes,
  getDynamicDefinitionClass,
  getDynamicExplanationClass,
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
    expect(getDynamicDefinitionClass(extraLongLongDef(extraLongDef))).toContain("text-base");
  });

  it("returns appropriate sizing classes for grammatical explanations", () => {
    // Short: <= 55 chars
    const shortExp = "In what way or by what manner or means.";
    expect(getDynamicExplanationClass(shortExp)).toContain("text-base");

    // Medium: 56-110 chars
    const mediumExp = "Used to introduce questions about the manner of an action or condition in formal discourse.";
    expect(getDynamicExplanationClass(mediumExp)).toContain("text-sm");
  });
});

function extraLongLongDef(text: string): string {
  return text;
}
