/**
 * AI Interview Question Generator Service
 * Pre-generates 10-15 hyper-personalized interview questions tailored to the user's
 * exact profession (e.g. Odontóloga, Arquitecto, Abogado) and CEFR level (A1 to C2).
 *
 * Implements the user's architectural mandate:
 * 1. AI-driven question generation (no static monolithic arrays per role).
 * 2. Pre-generation of 12 questions per session block for zero-latency turn transitions.
 * 3. Deep pedagogical calibration by CEFR level.
 * 4. Resilient caching and procedural instant fallback.
 */

import { InterviewQuestionItem } from "./interviewEngineService";
import { DynamicQuestionService } from "./dynamicQuestionService";
import { directClientAiService } from "../../settings/services/directClientAiService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

export interface GenerateSessionQuestionsParams {
  profession: string;
  cefrLevel: string;
  count?: number;
  forceFresh?: boolean;
}

const STORAGE_PREFIX = "celaest:interview:ai_questions:v2";

function getCacheKey(profession: string, cefrLevel: string): string {
  const normProf = (profession || "Professional").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_");
  const normLevel = (cefrLevel || "B1").toUpperCase().trim();
  return `${STORAGE_PREFIX}:${normProf}:${normLevel}`;
}

export class AiInterviewQuestionGenerator {
  /**
   * Returns cached questions if available, otherwise generates a rich instant seed batch
   * matching the profession and CEFR level so rendering is 100% instantaneous.
   */
  public static getCachedOrSeedQuestions(
    profession: string,
    cefrLevel: string,
    count: number = 12,
  ): InterviewQuestionItem[] {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(getCacheKey(profession, cefrLevel));
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length >= 5) {
            return parsed;
          }
        }
      } catch {
        // ignore cache read error
      }
    }

    // Instant procedural seed tailored to domain & level
    return DynamicQuestionService.getRoundQuestions(1, profession, cefrLevel, count);
  }

  /**
   * Pre-generates 10 to 15 questions with AI for the given profession and CEFR level.
   * If BYOK is active or CELAEST-CORE is reachable, calls the LLM with structured output.
   */
  public static async generateSessionQuestions(
    params: GenerateSessionQuestionsParams,
  ): Promise<InterviewQuestionItem[]> {
    const { profession, cefrLevel, count = 12, forceFresh = false } = params;
    const cacheKey = getCacheKey(profession, cefrLevel);

    // Return from cache if fresh unless forced
    if (!forceFresh && typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length >= count) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }

    const level = cefrLevel.toUpperCase().trim() || "B1";
    const role = profession.trim() || "Professional";

    const levelGuidance = this.getLevelPromptDirectives(level);

    const systemPrompt = `You are a world-class Cambridge and Oxford ESL oral examiner specializing in career-specific English language assessments.
Generate exactly ${count} realistic, practical speaking interview questions for a professional who is an: "${role}".
Target CEFR Level: ${level}.

${levelGuidance}

Strict Domain Rules:
1. Every single question MUST be authentic and specific to the daily reality, vocabulary, procedures, and challenges of an "${role}".
2. If the profession is medical, dental, or healthcare (e.g. Odontóloga, Dentist, Physician, Nurse), questions MUST focus on patients, clinical procedures, diagnosis, dental/medical emergencies, anesthesia, patient anxiety, hygiene, and treatment plans.
3. Absolutely DO NOT generate generic software engineering, DevOps, or IT questions unless the profession is explicitly Software/IT.
4. Vary the categories across: WARMUP, TECHNICAL, BEHAVIORAL, SITUATIONAL, STRATEGY.
5. Provide a helpful starHint in English suggesting how to structure a good response.
6. Provide an array of 4-6 expected technical and conversational keywords that a candidate at CEFR ${level} should use.

Output format: Return ONLY valid raw JSON with the following structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Clear, natural question in English for ${role} at CEFR ${level}",
      "category": "WARMUP",
      "starHint": "Structure: background, routine, key tools...",
      "expectedKeywords": ["keyword1", "keyword2", "keyword3"],
      "targetLevel": "${level}"
    }
  ]
}`;

    const userPrompt = `Generate ${count} progressive interview questions for an ${role} at CEFR ${level} level.`;

    try {
      const isCore = await providerKeyVault.isCentralCoreEnabled();
      const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
      const hasKey = await providerKeyVault.hasKey(activeProvider);

      let rawResponse = "";

      if (!isCore && hasKey) {
        // Use direct BYOK provider (e.g. Groq with llama-3.1-8b-instant)
        rawResponse = await directClientAiService.chatCompletion({
          systemPrompt,
          userPrompt,
          maxTokens: 3500,
        });
      } else {
        // Use CELAEST-CORE IA-Mesh evaluator or direct provider if key exists
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
              max_tokens: 4096,
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
              maxTokens: 3500,
            });
          }
        }
      }

      const parsed = this.parseAiQuestionsResponse(rawResponse, count, role, level);

      if (parsed.length > 0 && typeof window !== "undefined") {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(parsed));
        } catch {
          // ignore storage quota error
        }
      }

      return parsed;
    } catch (err) {
      logger.warn("[AiInterviewQuestionGenerator] Failed to generate AI questions, using procedural seed", err);
      // Fallback to rich procedural seeds
      return DynamicQuestionService.getRoundQuestions(1, role, level, count);
    }
  }

  private static getLevelPromptDirectives(level: string): string {
    if (level.startsWith("A1") || level.startsWith("A2")) {
      return `Pedagogical CEFR A1/A2 Guidance:
- Keep question sentences concise, direct, and accessible (simple present, simple past).
- Focus on daily workplace routine, basic tools/instruments, introducing themselves, and simple patient/client interactions.
- Avoid multi-clause convoluted idioms or abstract corporate buzzwords.`;
    }
    if (level.startsWith("B1") || level.startsWith("B2")) {
      return `Pedagogical CEFR B1/B2 Guidance:
- Intermediate professional English: explaining procedures, addressing patient or client concerns, handling unexpected roadblocks.
- Emphasize clear narrative structure, professional collocations, and conflict resolution or consultation skills.`;
    }
    return `Pedagogical CEFR C1/C2 Guidance:
- Advanced professional fluency: clinical ethics, complex decision-making, multidisciplinary consultations, leadership, and technical nuances.
- Demand sophisticated discourse markers, precise medical/professional terminology, and articulate hypothetical reasoning.`;
  }

  private static parseAiQuestionsResponse(
    raw: string,
    targetCount: number,
    role: string,
    level: string,
  ): InterviewQuestionItem[] {
    let clean = raw.trim();
    if (clean.startsWith("```json")) clean = clean.slice(7);
    if (clean.startsWith("```")) clean = clean.slice(3);
    if (clean.endsWith("```")) clean = clean.slice(0, -3);
    clean = clean.trim();

    try {
      const data = JSON.parse(clean);
      const list = Array.isArray(data) ? data : data?.questions || data?.items;

      if (Array.isArray(list) && list.length > 0) {
        return list.slice(0, targetCount).map((item, idx) => ({
          id: idx + 1,
          question: String(item.question || `Tell me about your experience as a ${role}.`),
          category: item.category || "WARMUP",
          starHint: String(item.starHint || "Explain the situation, your actions, and the outcome."),
          expectedKeywords: Array.isArray(item.expectedKeywords)
            ? item.expectedKeywords.map(String)
            : [role.toLowerCase(), "patient", "clinical"],
          round: Math.floor(idx / 5) + 1,
          targetLevel: (item.targetLevel || level) as any,
        }));
      }
    } catch (e) {
      logger.warn("[AiInterviewQuestionGenerator] JSON parse error on AI response", e);
    }

    // Fallback if parsing failed
    return DynamicQuestionService.getRoundQuestions(1, role, level, targetCount);
  }
}
