/**
 * CEFR and Profession Domain Standards
 * Standard classification and normalization utilities for CELAEST Lingua.
 * Zero hardcoded question banks - All interview questions are generated dynamically by Sovereign AI.
 */

export type CefrLevelCode = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type KnownProfessionCategory =
  | "HEALTHCARE"
  | "LEGAL"
  | "EDUCATION"
  | "TECH"
  | "PRODUCT"
  | "DESIGN"
  | "DATA"
  | "BUSINESS";

export type ProfessionCategory = KnownProfessionCategory | (string & {});

export interface DynamicQuestionTopic {
  category: "WARMUP" | "BEHAVIORAL" | "TECHNICAL" | "SITUATIONAL" | "STRATEGY" | "WRAPUP";
  theme: string;
  questionTemplate: string;
  starHint: string;
  expectedKeywords: string[];
  targetLevel: CefrLevelCode;
}

export function normalizeCefr(raw?: string): CefrLevelCode {
  if (!raw) return "B1";
  const upper = raw.toUpperCase().trim();
  if (upper.startsWith("A1")) return "A1";
  if (upper.startsWith("A2")) return "A2";
  if (upper.startsWith("B1")) return "B1";
  if (upper.startsWith("B2")) return "B2";
  if (upper.startsWith("C1")) return "C1";
  if (upper.startsWith("C2")) return "C2";
  return "B1";
}

export function classifyProfession(roleName?: string): ProfessionCategory {
  if (!roleName) return "BUSINESS";
  const clean = roleName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // 1. Healthcare & Dental / Medical Specialities
  if (
    clean.includes("odontol") ||
    clean.includes("dentis") ||
    clean.includes("dental") ||
    clean.includes("tooth") ||
    clean.includes("teeth") ||
    clean.includes("ortodon") ||
    clean.includes("periodon") ||
    clean.includes("medic") ||
    clean.includes("doctor") ||
    clean.includes("physician") ||
    clean.includes("nurse") ||
    clean.includes("enferm") ||
    clean.includes("salud") ||
    clean.includes("health") ||
    clean.includes("clinic") ||
    clean.includes("therap") ||
    clean.includes("pharma") ||
    clean.includes("hospital")
  ) {
    return "HEALTHCARE";
  }

  // 2. Legal / Law / Jurisprudence
  if (
    clean.includes("law") ||
    clean.includes("abogad") ||
    clean.includes("legal") ||
    clean.includes("jurid") ||
    clean.includes("court") ||
    clean.includes("attorney")
  ) {
    return "LEGAL";
  }

  // 3. Education / Teaching
  if (
    clean.includes("teach") ||
    clean.includes("profess") ||
    clean.includes("profesor") ||
    clean.includes("docent") ||
    clean.includes("educat") ||
    clean.includes("pedagog") ||
    clean.includes("school")
  ) {
    return "EDUCATION";
  }

  if (
    clean.includes("product") ||
    clean.includes("po") ||
    clean.includes("pm") ||
    clean.includes("scrum") ||
    clean.includes("agile")
  ) {
    return "PRODUCT";
  }

  if (
    clean.includes("design") ||
    clean.includes("ux") ||
    clean.includes("ui") ||
    clean.includes("visual") ||
    clean.includes("grafic")
  ) {
    return "DESIGN";
  }

  if (
    clean.includes("data") ||
    clean.includes("analyt") ||
    clean.includes("bi ") ||
    clean.includes("machine") ||
    clean.includes("ai ") ||
    clean.includes("ia ")
  ) {
    return "DATA";
  }

  if (
    clean.includes("software") ||
    clean.includes("engineer") ||
    clean.includes("developer") ||
    clean.includes("program") ||
    clean.includes("frontend") ||
    clean.includes("backend") ||
    clean.includes("fullstack") ||
    clean.includes("devops") ||
    clean.includes("cloud") ||
    clean.includes("qa") ||
    clean.includes("tech")
  ) {
    return "TECH";
  }

  return "BUSINESS";
}
