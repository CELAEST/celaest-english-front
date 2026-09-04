/**
 * AI Dynamic Writing Task Generator Service
 * Generates 100% authentic, career-tailored writing tasks for ANY profession
 * (e.g. Odontóloga, Arquitecto, Abogado, Chef, Veterinario, Pilot, Marine Biologist)
 * and CEFR level (A1 to C2).
 *
 * Implements the user's architectural mandate:
 * 1. Zero static or hardcoded tasks for the active learning session.
 * 2. High-quality pedagogical calibration by CEFR level.
 * 3. Authentic starter phrases native to the specific profession.
 * 4. Resilient caching and instant procedural fallback.
 */

import { WritingTaskItem } from "./dynamicWritingTaskService";
import { normalizeCefr, classifyProfession, CefrLevelCode } from "../../conversation/services/dynamicQuestionService";
import { directClientAiService } from "../../settings/services/directClientAiService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

export interface GenerateWritingTaskParams {
  profession: string;
  cefrLevel: string;
  forceFresh?: boolean;
}

const STORAGE_PREFIX = "celaest:writing:ai_tasks:v2";

function getCacheKey(profession: string, cefrLevel: string): string {
  const normProf = (profession || "Professional").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_");
  const normLevel = (cefrLevel || "B1").toUpperCase().trim();
  return `${STORAGE_PREFIX}:${normProf}:${normLevel}`;
}

export class AiWritingTaskGenerator {
  /**
   * Returns cached task for the given profession and level if available,
   * otherwise returns a procedural vocation-aware seed so rendering is instantaneous.
   */
  public static getCachedOrSeedTask(
    profession: string,
    cefrLevel: string,
  ): WritingTaskItem {
    const level = normalizeCefr(cefrLevel);
    const role = profession?.trim() || "Professional";

    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(getCacheKey(role, level));
        if (cached) {
          const parsed = JSON.parse(cached) as WritingTaskItem;
          if (parsed && parsed.id && parsed.title) {
            return parsed;
          }
        }
      } catch {
        // ignore cache read error
      }
    }

    // Instant procedural seed tailored to domain & level
    return this.createProceduralSeed(role, level);
  }

  /**
   * Generates a brand-new AI writing task for the specific profession and CEFR level.
   */
  public static async generateWritingTask(
    params: GenerateWritingTaskParams,
  ): Promise<WritingTaskItem> {
    const { profession, cefrLevel, forceFresh = false } = params;
    const level = normalizeCefr(cefrLevel);
    const role = profession?.trim() || "Professional";
    const cacheKey = getCacheKey(role, level);

    if (!forceFresh && typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as WritingTaskItem;
          if (parsed && parsed.id && parsed.title) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }

    const { minWords, maxWords, timeLimit, levelDirectives } = this.getLevelParams(level);

    const systemPrompt = `You are a world-class Cambridge and Oxford ESL examiner specializing in career-specific English language writing assessments.
Generate an authentic, realistic professional writing task for an individual working as a: "${role}".
Target CEFR Level: ${level}.

Pedagogical Calibration (${level}):
${levelDirectives}

Strict Quality Mandates:
1. The scenario MUST be authentic, credible, and specific to the daily realities, procedures, clients, patients, or challenges of a "${role}".
2. Category MUST be one of: "EMAIL", "MESSAGE", "REPORT", "PROPOSAL", "LETTER", "REVIEW".
3. Provide 3 to 4 realistic starter phrases in natural English that an authentic "${role}" at CEFR ${level} would use in this specific scenario.
4. ABSOLUTELY DO NOT use generic software engineering jargon (such as 'sprint review', 'PR', 'hotfix', 'tech debt', 'API') unless the role is explicitly Software/IT.
5. All instructions must be in clear English.
6. Ultra-Concise Description Mandate: The "description" field MUST be exactly ONE short, natural sentence (maximum 15 to 20 words). Absolutely NEVER write multiple sentences, lengthy paragraphs, bloated checklists, or overwhelming requirements. Keep it light, inspiring, and concise.

Output format: Return ONLY valid raw JSON with this exact structure:
{
  "category": "EMAIL",
  "title": "Clear and realistic scenario title",
  "description": "Short, crisp 1-sentence prompt (max 15-20 words).",
  "toneHint": "e.g. Professional, empathetic, clear",
  "timeLimit": "${timeLimit}",
  "minWords": ${minWords},
  "maxWords": ${maxWords},
  "starterPhrases": [
    "Authentic starter phrase 1...",
    "Authentic starter phrase 2...",
    "Authentic starter phrase 3..."
  ]
}`;

    const seedCategories = ["EMAIL", "REPORT", "LETTER", "MESSAGE"] as const;
    const randomCategory = seedCategories[Math.floor(Math.random() * seedCategories.length)];
    const nonce = Math.floor(Math.random() * 100000);
    const userPrompt = forceFresh
      ? `Create a brand-new, realistic ${randomCategory} writing task for a ${role} at CEFR ${level} level (Scenario Ref: ${nonce}). Ensure this scenario explores a completely different situation and problem from previous tasks.`
      : `Create a realistic writing task for a ${role} at CEFR ${level} level.`;

    try {
      const isCore = await providerKeyVault.isCentralCoreEnabled();
      const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
      const hasKey = await providerKeyVault.hasKey(activeProvider);

      let rawResponse = "";

      if (!isCore && hasKey) {
        rawResponse = await directClientAiService.chatCompletion({
          systemPrompt,
          userPrompt,
          maxTokens: 1200,
        });
      } else {
        try {
          const CORE_AI_URL = `${ENV.coreAiUrl}/ai/chat/simple`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 20000);
          const response = await fetch(CORE_AI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system: systemPrompt,
              message: userPrompt,
              provider: activeProvider,
              max_tokens: 1500,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (response.ok) {
            const data = (await response.json()) as { response?: string; content?: string };
            rawResponse = data.response || data.content || "";
          }
        } catch {
          if (hasKey) {
            rawResponse = await directClientAiService.chatCompletion({
              systemPrompt,
              userPrompt,
              maxTokens: 1200,
            });
          }
        }
      }

      const parsed = this.parseAiResponse(rawResponse, role, level, minWords, maxWords, timeLimit);

      if (parsed && typeof window !== "undefined") {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(parsed));
        } catch {
          // ignore storage quota
        }
      }

      return parsed;
    } catch (err) {
      logger.warn("[AiWritingTaskGenerator] AI generation failed, using procedural seed", err);
      return this.createProceduralSeed(role, level);
    }
  }

  private static getLevelParams(level: CefrLevelCode): {
    minWords: number;
    maxWords: number;
    timeLimit: string;
    levelDirectives: string;
  } {
    switch (level) {
      case "A1":
        return {
          minWords: 20,
          maxWords: 45,
          timeLimit: "8 min",
          levelDirectives: "- Short internal message or note (20-45 words). Simple present/past, straightforward vocabulary.",
        };
      case "A2":
        return {
          minWords: 30,
          maxWords: 60,
          timeLimit: "10 min",
          levelDirectives: "- Routine update, brief client confirmation, or short scheduling email (30-60 words).",
        };
      case "B1":
        return {
          minWords: 45,
          maxWords: 90,
          timeLimit: "12 min",
          levelDirectives: "- Professional email, case update, or client follow-up explaining a situation and proposing next steps (45-90 words).",
        };
      case "B2":
        return {
          minWords: 70,
          maxWords: 130,
          timeLimit: "15 min",
          levelDirectives: "- Formal consultation summary, treatment/project proposal, or detailed recommendation email (70-130 words). Clear narrative structure and professional collocations.",
        };
      case "C1":
      case "C2":
        return {
          minWords: 100,
          maxWords: 180,
          timeLimit: "18 min",
          levelDirectives: "- In-depth clinical or technical case report, executive briefing, or high-stakes consultation letter (100-180 words). Sophisticated discourse markers and authoritative tone.",
        };
      default:
        return {
          minWords: 45,
          maxWords: 90,
          timeLimit: "12 min",
          levelDirectives: "- Intermediate professional email or update.",
        };
    }
  }

  private static parseAiResponse(
    raw: string,
    role: string,
    level: CefrLevelCode,
    minWords: number,
    maxWords: number,
    timeLimit: string,
  ): WritingTaskItem {
    let clean = raw.trim();
    if (clean.startsWith("```json")) clean = clean.slice(7);
    if (clean.startsWith("```")) clean = clean.slice(3);
    if (clean.endsWith("```")) clean = clean.slice(0, -3);
    clean = clean.trim();

    try {
      const data = JSON.parse(clean);
      if (data && data.title && data.description) {
        const allowedCategories: Array<WritingTaskItem["category"]> = [
          "EMAIL",
          "MESSAGE",
          "REPORT",
          "PROPOSAL",
          "LETTER",
          "REVIEW",
        ];
        const rawCat = String(data.category || "EMAIL").toUpperCase();
        const category = allowedCategories.includes(rawCat as any)
          ? (rawCat as WritingTaskItem["category"])
          : "EMAIL";

        const starterPhrases = Array.isArray(data.starterPhrases) && data.starterPhrases.length > 0
          ? data.starterPhrases.map(String)
          : [
              `Regarding the recent consultation about...`,
              `I would like to follow up on the recommended steps for...`,
              `Please find the detailed summary below...`,
            ];

        return {
          id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          category,
          title: String(data.title),
          description: String(data.description),
          toneHint: String(data.toneHint || "Professional, concise, clear"),
          timeLimit: String(data.timeLimit || timeLimit),
          minWords: Number(data.minWords) || minWords,
          maxWords: Number(data.maxWords) || maxWords,
          level,
          roleCategory: classifyProfession(role),
          starterPhrases,
        };
      }
    } catch (e) {
      logger.warn("[AiWritingTaskGenerator] Failed to parse AI JSON response", e);
    }

    return this.createProceduralSeed(role, level);
  }

  private static createProceduralSeed(role: string, level: CefrLevelCode): WritingTaskItem {
    const { minWords, maxWords, timeLimit } = this.getLevelParams(level);
    const category = classifyProfession(role);

    const healthcareSeeds = [
      {
        category: "EMAIL" as const,
        title: `${role}: Post-Operative Clinical Guidance`,
        description: `Write a clear email to a patient with post-procedure care instructions and follow-up guidance.`,
        starterPhrases: [
          `Following your clinical procedure today, please review these care guidelines.`,
          `Some mild tenderness is expected as the tissue heals, but should subside.`,
          `Please contact our clinic immediately if you experience sharp or throbbing pain.`,
        ],
      },
      {
        category: "EMAIL" as const,
        title: `${role}: Treatment Plan Consultation`,
        description: `Summarize two treatment options for a patient, comparing preservation with restorative replacement.`,
        starterPhrases: [
          `Thank you for discussing your treatment options with us today.`,
          `Based on our clinical findings, the most conservative approach involves...`,
          `Please let us know how you would like to proceed with the scheduled phases.`,
        ],
      },
      {
        category: "LETTER" as const,
        title: `${role}: Clinical Specialist Referral`,
        description: `Draft a concise referral letter to a dental specialist summarizing clinical diagnosis and next steps.`,
        starterPhrases: [
          `I am writing to refer this patient for specialist evaluation regarding...`,
          `Clinical examination and diagnostic imaging indicate...`,
          `Thank you for your collaborative assessment and care.`,
        ],
      },
    ];

    const generalSeeds = [
      {
        category: "EMAIL" as const,
        title: `${role}: Professional Consultation & Follow-up`,
        description: `Write a clear email to a client or colleague summarizing case status and next steps.`,
        starterPhrases: [
          `I am writing to provide an update regarding our recent discussion about...`,
          `Based on our evaluation, the recommended course of action is...`,
          `Please let me know if you have any questions or need further clarification.`,
        ],
      },
      {
        category: "REPORT" as const,
        title: `${role}: Progress & Milestone Status Report`,
        description: `Draft a brief update outlining key accomplishments and upcoming priorities for your team.`,
        starterPhrases: [
          `Please find the detailed status report for the recent phase below.`,
          `Key achievements accomplished during this period include...`,
          `Our primary focus for the upcoming cycle will be...`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: Client Priority Sync & Next Actions`,
        description: `Send a concise message confirming agreed priorities, key deliverables, and deadlines.`,
        starterPhrases: [
          `Following up on our sync, here are the key action items agreed upon.`,
          `I will handle the initial phase by tomorrow afternoon.`,
          `Please confirm if this timeline aligns with your expectations.`,
        ],
      },
    ];

    const pool = category === "HEALTHCARE" ? healthcareSeeds : generalSeeds;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    return {
      id: `seed-${level.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      category: selected.category,
      title: selected.title,
      description: selected.description,
      toneHint: "Polite, authoritative, empathetic",
      timeLimit,
      minWords,
      maxWords,
      level,
      roleCategory: category,
      starterPhrases: selected.starterPhrases,
    };
  }
}
