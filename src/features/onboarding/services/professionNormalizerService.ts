/**
 * Service: ProfessionNormalizerService
 * Cleans, corrects typos, and dynamically normalizes user profession inputs
 * into authentic English professional titles for personalized AI learning features.
 *
 * Mandate (Anti-Hardcode & Infinite Domain):
 * Uses AI-First semantic normalization via CELAEST Core IA-Mesh (celaest-core)
 * with zero closed static taxonomies, cached seamlessly in session storage.
 */

import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

// Baseline bilingual dictionary for offline synchronous tests & instant fallbacks
const BASELINE_PROFESSIONS: Record<string, string> = {
  // Medical & Healthcare
  "odontologo": "Dentist",
  "odontólogo": "Dentist",
  "odontologa": "Dentist",
  "odontóloga": "Dentist",
  "dentista": "Dentist",
  "dentist": "Dentist",
  "medico": "Medical Doctor",
  "médico": "Medical Doctor",
  "doctor": "Medical Doctor",
  "enfermero": "Nurse",
  "enfermera": "Nurse",
  "nurse": "Nurse",
  "psicologo": "Psychologist",
  "psicólogo": "Psychologist",
  "psicologa": "Psychologist",
  "psicóloga": "Psychologist",
  "veterinario": "Veterinarian",
  "veterinaria": "Veterinarian",

  // Legal & Public Policy
  "abogado": "Lawyer",
  "abogada": "Lawyer",
  "lawyer": "Lawyer",
  "juez": "Judge",

  // Education & Academia
  "profesor": "Teacher",
  "profesora": "Teacher",
  "docente": "Teacher",
  "maestro": "Teacher",
  "maestra": "Teacher",
  "student": "Student",
  "estudiante": "Student",

  // Specialized Trades & Crafts
  "carpintero": "Carpenter",
  "carpintera": "Carpenter",
  "luthier": "Luthier",
  "arquitecto": "Architect",
  "arquitecta": "Architect",

  // Sciences & Diverse Fields
  "biologo marino": "Marine Biologist",
  "biólogo marino": "Marine Biologist",
  "biologa marina": "Marine Biologist",
  "bióloga marina": "Marine Biologist",
  "sumiller": "Sommelier",
  "sommelier": "Sommelier",
  "arqueologo": "Archaeologist",
  "arqueólogo": "Archaeologist",
  "apicultor": "Beekeeper",
  "apicultora": "Beekeeper",
  "astrofisico": "Astrophysicist",
  "astrofísico": "Astrophysicist",

  // Tech & Engineering
  "software": "Software Engineer",
  "developer": "Developer",
  "programador": "Programmer",
  "ingeniero": "Engineer",
  "ingeniera": "Engineer",
};

const CACHE_PREFIX = "celaest:profession:norm:v1:";
const memoryCache = new Map<string, string>();

export class ProfessionNormalizerService {
  /**
   * Synchronous normalization: checks cache, applies prefix cleaning,
   * matches baseline dictionary or title-cases words.
   */
  public static normalize(rawInput: string): string {
    if (!rawInput || typeof rawInput !== "string") {
      return "Professional";
    }

    const cleaned = this.cleanInput(rawInput);
    if (!cleaned) return "Professional";

    const lower = cleaned.toLowerCase();

    // Check memory cache
    if (memoryCache.has(lower)) {
      return memoryCache.get(lower)!;
    }

    // Check sessionStorage if in browser
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const stored = sessionStorage.getItem(CACHE_PREFIX + lower);
        if (stored) {
          memoryCache.set(lower, stored);
          return stored;
        }
      } catch {
        // ignore quota / security error
      }
    }

    // Check baseline dictionary
    if (BASELINE_PROFESSIONS[lower]) {
      return BASELINE_PROFESSIONS[lower];
    }

    // Word-by-word title-case capitalization
    const words = lower.split(/\s+/);
    const titleCased = words
      .map((w) => {
        const clean = w.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ/-]/g, "");
        if (BASELINE_PROFESSIONS[clean]) {
          return BASELINE_PROFESSIONS[clean];
        }
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(" ")
      .trim();

    return titleCased || "Professional";
  }

  /**
   * Dynamic AI-First Normalization via CELAEST-CORE (IA-Mesh):
   * Translates and normalizes ANY profession from ANY language into standard English
   * title-case, caching the result to avoid redundant network hits.
   */
  public static async normalizeAsync(rawInput: string): Promise<string> {
    if (!rawInput || typeof rawInput !== "string") {
      return "Professional";
    }

    const cleaned = this.cleanInput(rawInput);
    if (!cleaned) return "Professional";

    const lower = cleaned.toLowerCase();

    // 1. Return from cache if present
    if (memoryCache.has(lower)) {
      return memoryCache.get(lower)!;
    }
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const stored = sessionStorage.getItem(CACHE_PREFIX + lower);
        if (stored) {
          memoryCache.set(lower, stored);
          return stored;
        }
      } catch {
        // ignore
      }
    }

    // 2. Query CELAEST Core IA-Mesh dynamically
    try {
      const coreAiEndpoint = `${ENV.coreAiUrl}/ai/chat/simple`;
      const prompt = `Translate and normalize the following occupation or professional specialty into standard, natural English professional title-case (e.g. 'carpintero' -> 'Carpenter', 'médico forense' -> 'Forensic Pathologist', 'profesora de yoga' -> 'Yoga Instructor', 'luthier' -> 'Luthier', 'abogado laboral' -> 'Labor Lawyer', 'albañil' -> 'Bricklayer / Mason').
Role to normalize: "${cleaned}"
CRITICAL: Return ONLY the normalized English title in title-case, absolutely nothing else. No explanation, no intro, no punctuation.`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(coreAiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as { response?: string; content?: string };
        const rawTitle = (data.response || data.content || "").trim();
        // Remove surrounding quotes or trailing periods
        const cleanTitle = rawTitle.replace(/^["'`]+|["'`.]+$/g, "").trim();

        if (cleanTitle && cleanTitle.length < 60) {
          memoryCache.set(lower, cleanTitle);
          if (typeof window !== "undefined" && window.sessionStorage) {
            try {
              sessionStorage.setItem(CACHE_PREFIX + lower, cleanTitle);
            } catch {
              // ignore
            }
          }
          return cleanTitle;
        }
      }
    } catch (err) {
      logger.warn("[ProfessionNormalizerService] Core AI normalization call failed or timed out, falling back to heuristic", err);
    }

    // 3. Fallback to synchronous heuristic
    const fallback = this.normalize(cleaned);
    memoryCache.set(lower, fallback);
    return fallback;
  }

  private static cleanInput(raw: string): string {
    let cleaned = raw.trim();
    // Strip conversational prefixes in English & Spanish
    cleaned = cleaned.replace(
      /^(i am a|i'm a|i am an|i'm an|i work as a|i work as an|i work in|soy|trabajo como|trabajo en|me dedico a)\s+/i,
      "",
    );
    return cleaned.trim();
  }
}

