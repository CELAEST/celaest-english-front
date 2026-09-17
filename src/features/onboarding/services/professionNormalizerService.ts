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
  // Culinary, Food & Hospitality
  "cocinero": "Chef",
  "cocinera": "Chef",
  "chef": "Chef",
  "mesero": "Waiter",
  "mesera": "Waitress",
  "camarero": "Waiter",
  "camarera": "Waitress",
  "barista": "Barista",
  "bartender": "Bartender",
  "barman": "Bartender",
  "panadero": "Baker",
  "panadera": "Baker",
  "pastelero": "Pastry Chef",
  "pastelera": "Pastry Chef",
  "repostero": "Pastry Chef",
  "repostera": "Pastry Chef",

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
  "doctora": "Medical Doctor",
  "enfermero": "Nurse",
  "enfermera": "Nurse",
  "nurse": "Nurse",
  "psicologo": "Psychologist",
  "psicólogo": "Psychologist",
  "psicologa": "Psychologist",
  "psicóloga": "Psychologist",
  "veterinario": "Veterinarian",
  "veterinaria": "Veterinarian",
  "nutricionista": "Nutritionist",
  "fisioterapeuta": "Physical Therapist",
  "farmaceutico": "Pharmacist",
  "farmacéutico": "Pharmacist",

  // Business, Management & Finance
  "contador": "Accountant",
  "contadora": "Accountant",
  "administrador": "Administrator",
  "administradora": "Administrator",
  "economista": "Economist",
  "abogado": "Lawyer",
  "abogada": "Lawyer",
  "lawyer": "Lawyer",
  "juez": "Judge",
  "consultor": "Consultant",
  "consultora": "Consultant",
  "asesor": "Consultant",
  "asesora": "Consultant",
  "auditor": "Auditor",
  "auditora": "Auditor",
  "gerente": "Manager",
  "director": "Director",
  "directora": "Director",

  // Education & Academia
  "profesor": "Teacher",
  "profesora": "Teacher",
  "docente": "Teacher",
  "maestro": "Teacher",
  "maestra": "Teacher",
  "student": "Student",
  "estudiante": "Student",

  // Specialized Trades & Construction
  "carpintero": "Carpenter",
  "carpintera": "Carpenter",
  "luthier": "Luthier",
  "arquitecto": "Architect",
  "arquitecta": "Architect",
  "electricista": "Electrician",
  "plomero": "Plumber",
  "plomera": "Plumber",
  "fontanero": "Plumber",
  "fontanera": "Plumber",
  "mecanico": "Mechanic",
  "mecánico": "Mechanic",
  "albañil": "Bricklayer / Mason",
  "albanil": "Bricklayer / Mason",
  "soldador": "Welder",
  "pintor": "Painter",
  "pintora": "Painter",
  "cerrajero": "Locksmith",

  // Design, Arts & Media
  "diseñador": "Designer",
  "diseñadora": "Designer",
  "disenador": "Designer",
  "disenadora": "Designer",
  "fotografo": "Photographer",
  "fotógrafo": "Photographer",
  "fotografa": "Photographer",
  "fotógrafa": "Photographer",
  "periodista": "Journalist",
  "escritor": "Writer",
  "escritora": "Writer",
  "musico": "Musician",
  "músico": "Musician",
  "traductor": "Translator",
  "traductora": "Translator",

  // Logistics & Services
  "conductor": "Driver",
  "conductora": "Driver",
  "chofer": "Driver",
  "chófer": "Driver",
  "piloto": "Pilot",
  "vendedor": "Sales Representative",
  "vendedora": "Sales Representative",
  "cajero": "Cashier",
  "cajera": "Cashier",
  "policia": "Police Officer",
  "policía": "Police Officer",
  "bombero": "Firefighter",
  "bombera": "Firefighter",
  "guardia de seguridad": "Security Guard",
  "guardia": "Security Guard",
  "vigilante": "Security Guard",
  "guarda de seguridad": "Security Guard",
  "seguridad": "Security Guard",

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

  // Agriculture, Farming & Environmental
  "agricultor": "Farmer / Agriculturalist",
  "agricultora": "Farmer / Agriculturalist",
  "campesino": "Farmer",
  "campesina": "Farmer",
  "ganadero": "Rancher / Livestock Farmer",
  "ganadera": "Rancher / Livestock Farmer",
  "agronomo": "Agronomist",
  "agrónomo": "Agronomist",
  "agronoma": "Agronomist",
  "agrónoma": "Agronomist",
  "pescador": "Fisherman",
  "pescadora": "Fisherwoman",
  "jardinero": "Gardener / Landscaper",
  "jardinera": "Gardener / Landscaper",
  "forestal": "Forestry Specialist",

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
   * Dynamic Normalization:
   * 1. Checks memory & session cache (0ms)
   * 2. Checks comprehensive bilingual dictionary (0ms, 0 tokens)
   * 3. Uses lightweight translation API or active BYOK LLM for rare/custom titles
   */
  public static async normalizeAsync(rawInput: string): Promise<string> {
    if (!rawInput || typeof rawInput !== "string") {
      return "Professional";
    }

    const cleaned = this.cleanInput(rawInput);
    if (!cleaned) return "Professional";

    const lower = cleaned.toLowerCase();

    // 1. Return from memory / session cache if present
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

    // 2. Instant bilingual dictionary lookup (0ms, 0 tokens)
    if (BASELINE_PROFESSIONS[lower]) {
      const match = BASELINE_PROFESSIONS[lower];
      memoryCache.set(lower, match);
      if (typeof window !== "undefined" && window.sessionStorage) {
        try {
          sessionStorage.setItem(CACHE_PREFIX + lower, match);
        } catch {
          // ignore
        }
      }
      return match;
    }

    // 2. Query BYOK Provider (when Core is deactivated) or CELAEST Core IA-Mesh
    try {
      const { providerKeyVault } = await import("../../settings/services/providerKeyVault");
      const isCore = await providerKeyVault.isCentralCoreEnabled().catch(() => false);

      if (!isCore) {
        const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
        const hasKey = await providerKeyVault.hasKey(activeProvider);
        if (hasKey) {
          const { directClientAiService } = await import("../../settings/services/directClientAiService");
          const rawTitle = await directClientAiService.chatCompletion({
            systemPrompt: "You are an English linguistic normalizer. Translate the given occupation or profession into standard English professional title-case (for example: 'Cocinero' -> 'Chef', 'Médico' -> 'Medical Doctor', 'Abogado' -> 'Lawyer', 'Profesor' -> 'Teacher'). Return ONLY the title-cased English occupational title, absolutely nothing else. No punctuation, no quotes.",
            userPrompt: `Occupation to translate: "${cleaned}"`,
            providerId: activeProvider,
            maxTokens: 1024,
          });
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
        // When Core is deactivated, do not call remote central core; return local baseline fallback
        const fallback = this.normalize(cleaned);
        memoryCache.set(lower, fallback);
        return fallback;
      }

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
    } catch (err: any) {
      logger.warn("[ProfessionNormalizerService] AI normalization call failed or timed out, falling back to heuristic", err);
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

