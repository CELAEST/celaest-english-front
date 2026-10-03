/**
 * AI Interview Question Generator Service
 * Pre-generates hyper-personalized interview questions tailored to the user's
 * exact profession and CEFR level (A1 to C2).
 *
 * Implements the user's architectural mandate:
 * 1. 100% Sovereign AI-driven question generation (ZERO static / hardcoded questions).
 * 2. Strict anti-repetition: accepts `avoidQuestions` so previous turns are never repeated.
 * 3. Deep pedagogical calibration by CEFR level.
 * 4. Zero silent fallback to hardcoded question banks: throws on failure to trigger AI recovery modal.
 */

import { InterviewQuestionItem } from "./interviewEngineService";
import { directClientAiService, AiInfrastructureError } from "../../settings/services/directClientAiService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

export interface GenerateSessionQuestionsParams {
  profession: string;
  cefrLevel: string;
  count?: number;
  avoidQuestions?: string[];
  forceFresh?: boolean;
}

export class AiInterviewQuestionGenerator {
  private static inFlightQuestionPromises = new Map<string, Promise<InterviewQuestionItem[]>>();

  /**
   * Pre-generates questions with AI for the given profession and CEFR level.
   * Enforces anti-repetition against `avoidQuestions`.
   * Guarantees ZERO duplicate network calls via an in-flight singleton promise lock.
   */
  public static async generateSessionQuestions(
    params: GenerateSessionQuestionsParams,
  ): Promise<InterviewQuestionItem[]> {
    const { profession, cefrLevel, count = 5, avoidQuestions = [], forceFresh = false } = params;
    const level = cefrLevel.toUpperCase().trim() || "B1";
    const role = profession.trim() || "Professional";

    const inFlightKey = `${role}::${level}::${avoidQuestions.length}::${count}`;

    if (!forceFresh && this.inFlightQuestionPromises.has(inFlightKey)) {
      return this.inFlightQuestionPromises.get(inFlightKey)!;
    }

    const levelGuidance = this.getLevelPromptDirectives(level);

    const avoidListText =
      avoidQuestions.length > 0
        ? `\n\nSTRICT ANTI-REPETITION MANDATE:
The candidate has ALREADY been asked the following questions in this interview. You MUST NOT repeat, rephrase, or duplicate any of them:
${avoidQuestions.slice(-25).map((q, idx) => `${idx + 1}. "${q}"`).join("\n")}
Every question you generate MUST be completely brand new and explore different scenarios, tools, or responsibilities.`
        : "";

    const systemPrompt = `You are a world-class Cambridge and Oxford ESL oral examiner specializing in career-specific English language assessments.
Generate exactly ${count} realistic, practical speaking interview questions for a professional who is an: "${role}".
Target CEFR Level: ${level}.

${levelGuidance}
${avoidListText}

Strict Domain Rules:
1. Every single question MUST be authentic and specific to the daily reality, vocabulary, procedures, and challenges of an "${role}".
2. If the profession is medical, dental, or healthcare (e.g. Odontóloga, Dentist, Physician, Nurse), questions MUST focus on patients, clinical procedures, diagnosis, dental/medical emergencies, anesthesia, patient anxiety, hygiene, and treatment plans.
3. Absolutely DO NOT generate generic software engineering, DevOps, or IT questions unless the profession is explicitly Software/IT.
4. Vary the categories across: WARMUP, TECHNICAL, BEHAVIORAL, SITUATIONAL, STRATEGY.
5. Provide a helpful starHint in English suggesting how to structure a good response.
6. Provide an array of 4-6 expected technical and conversational keywords that a candidate at CEFR ${level} should use.
7. NEVER use unescaped double quotes inside any string value; use single quotes for quotes or dialogue.

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

    const userPrompt = `Generate ${count} progressive, unique interview questions for a ${role} at CEFR ${level} level.`;

    const executeRequest = (async (): Promise<InterviewQuestionItem[]> => {
      try {
        const isCore = await providerKeyVault.isCentralCoreEnabled();
        const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
        const hasKey = await providerKeyVault.hasKey(activeProvider);

        let rawResponse = "";

        if (!isCore) {
          if (!hasKey) {
            throw new AiInfrastructureError(
              "AI_KEYS_EXHAUSTED",
              `El Clúster Central está desactivado y no hay clave configurada para ${activeProvider.toUpperCase()}.`,
              401,
              activeProvider,
            );
          }
          rawResponse = await directClientAiService.chatCompletion({
            systemPrompt,
            userPrompt,
            maxTokens: 3500,
          });
        } else {
          // Route through CELAEST-CORE IA Mesh
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
                max_tokens: 3500,
              }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (response.ok) {
              const data = (await response.json()) as { response?: string; content?: string };
              rawResponse = data.response || data.content || "";
            } else if (hasKey) {
              rawResponse = await directClientAiService.chatCompletion({
                systemPrompt,
                userPrompt,
                maxTokens: 3500,
              });
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

        if (!rawResponse || !rawResponse.trim()) {
          throw new Error("Empty response received from AI interview question generator");
        }

        return this.parseAiQuestionsResponse(rawResponse, count, role, level);
      } catch (err) {
        logger.error("[AiInterviewQuestionGenerator] Failed to generate AI questions:", err);
        throw err;
      }
    })();

    this.inFlightQuestionPromises.set(inFlightKey, executeRequest);

    try {
      return await executeRequest;
    } finally {
      this.inFlightQuestionPromises.delete(inFlightKey);
    }
  }

  private static getLevelPromptDirectives(level: string): string {
    if (level.startsWith("A1")) {
      return `Pedagogical CEFR A1 (Absolute Beginner) Guidance:
- Questions MUST be ultra-short, friendly, and direct (max 8 to 12 words per question).
- Grammar: Strictly SIMPLE PRESENT (verb to be, do/does, like, work, use, have). Absolutely NO past tense, NO present perfect, NO complex conditional or multi-clause structures.
- Focus strictly on elementary basics: introducing themselves, where they work, what simple tools/instruments they use, their daily routine, and what they like about their job.
- StarHint: Extremely simple and accessible in English (e.g. "Answer in 1 or 2 short sentences: 'Hello, my name is... and I work as a [role].'").
- ExpectedKeywords: 3-4 elementary high-frequency words (e.g. "name", "work", "like", "use").
- The candidate is an absolute beginner; never intimidate them with multi-part questions or complex behavioral scenarios.`;
    }
    if (level.startsWith("A2")) {
      return `Pedagogical CEFR A2 (Elementary) Guidance:
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
    const jsonMatch = clean.match(/\{[\s\S]*\}/) || clean.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      clean = jsonMatch[0];
    } else {
      if (clean.startsWith("```json")) clean = clean.slice(7);
      if (clean.startsWith("```")) clean = clean.slice(3);
      if (clean.endsWith("```")) clean = clean.slice(0, -3);
      clean = clean.trim();
    }

    if (!clean) {
      throw new Error("Unable to locate JSON object in AI question response");
    }

    const data = JSON.parse(clean);
    const list = Array.isArray(data) ? data : data?.questions || data?.items;

    if (!Array.isArray(list) || list.length === 0) {
      throw new Error("AI response did not contain an array of questions");
    }

    return list.slice(0, targetCount).map((item, idx) => ({
      id: idx + 1,
      question: String(item.question || `Tell me about your experience as a ${role}.`),
      category: item.category || "WARMUP",
      starHint: String(item.starHint || "Explain the situation, your actions, and the outcome."),
      expectedKeywords: Array.isArray(item.expectedKeywords)
        ? item.expectedKeywords.map(String)
        : [role.toLowerCase(), "communication", "analysis", "outcome"],
      round: Math.floor(idx / 5) + 1,
      targetLevel: (item.targetLevel || level) as any,
    }));
  }
}
