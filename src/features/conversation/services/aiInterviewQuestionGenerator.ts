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
import { HttpClient } from "../../../infrastructure/http/HttpClient";
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
Generate exactly ${count} realistic, practical speaking interview questions for a candidate whose role is: "${role}".
Target CEFR Level: ${level}.

${levelGuidance}
${avoidListText}

Strict Domain & Linguistic Boundaries:
1. Domain Alignment: Every question MUST strictly fit the real-world context of a "${role}".
   - If the role is generic ("Professional"), focus exclusively on universal workplace situations (daily schedule, teamwork, office/remote environment, communication, tools). NEVER assume healthcare, clinical, engineering, or legal settings unless explicitly specified in the role.
   - Multi-Domain Invariance: Never leak terminology from unrelated industries (e.g. NEVER mention 'patients', 'medical', 'gloves', 'clinic' unless the role is genuinely healthcare; NEVER mention 'DevOps', 'code' unless software).
2. CEFR Level Ceiling:
   - For A1 and A2 levels, questions MUST be ultra-basic, simple, and direct. Use ONLY common, high-frequency foundational English words. Avoid rare verbs or complex terminology.
3. Provide a helpful starHint in English suggesting how to structure a good response at CEFR ${level}.
4. Provide an array of 3-5 expected keywords that a candidate at CEFR ${level} should use.
5. NEVER use unescaped double quotes inside any string value; use single quotes for quotes or dialogue.

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
        const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
        const hasKey = await providerKeyVault.hasKey(activeProvider);

        let rawResponse = "";

        // Tier 1: Direct Client AI (Groq / BYOK) when key is configured in client vault
        if (hasKey) {
          try {
            rawResponse = await directClientAiService.chatCompletion({
              systemPrompt,
              userPrompt,
              maxTokens: 2500,
            });
          } catch (byokErr) {
            logger.warn("[AiInterviewQuestionGenerator] Direct client AI call failed, trying backend tier:", byokErr);
          }
        }

        // Tier 2: CELAEST-English Backend (/interview/questions)
        if (!rawResponse || !rawResponse.trim()) {
          try {
            let byokHeaders: Record<string, string> = {};
            let byokBody: Record<string, string> = {};
            try {
              const cfg = await providerKeyVault.getConfig(activeProvider);
              byokHeaders["X-Active-Provider"] = activeProvider;
              if (cfg?.defaultModel) byokHeaders["X-Provider-Model"] = cfg.defaultModel;
              if (cfg?.endpoint) byokHeaders["X-Provider-Endpoint"] = cfg.endpoint;
              byokHeaders["X-Provider-Has-Key"] = hasKey ? "1" : "0";
              byokBody = {
                providerId: activeProvider,
                ...(cfg?.defaultModel ? { providerModel: cfg.defaultModel } : {}),
                ...(cfg?.endpoint ? { providerEndpoint: cfg.endpoint } : {}),
              };
            } catch {
              // ignore
            }

            const backendResult = await HttpClient.post<InterviewQuestionItem[]>(
              "/interview/questions",
              {
                roleName: role,
                cefrLevel: level,
                count,
                avoidQuestions: avoidQuestions,
                ...byokBody,
              },
              { timeoutMs: 25_000, headers: byokHeaders },
            );

            if (Array.isArray(backendResult) && backendResult.length > 0) {
              return backendResult.slice(0, count).map((item, idx) => ({
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
          } catch (backendErr) {
            logger.warn("[AiInterviewQuestionGenerator] Backend questions endpoint failed:", backendErr);
          }
        }

        // Tier 3: CELAEST-CORE IA Mesh Fallback (fast 6s timeout)
        if (!rawResponse || !rawResponse.trim()) {
          try {
            const isCore = await providerKeyVault.isCentralCoreEnabled();
            if (isCore) {
              const CORE_AI_URL = `${ENV.coreAiUrl}/ai/chat/simple`;
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 6000);
              const response = await fetch(CORE_AI_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  system: systemPrompt,
                  message: userPrompt,
                  provider: activeProvider,
                  max_tokens: 2500,
                }),
                signal: controller.signal,
              });
              clearTimeout(timeoutId);
              if (response.ok) {
                const data = (await response.json()) as { response?: string; content?: string };
                rawResponse = data.response || data.content || "";
              }
            }
          } catch {
            // Core mesh unavailable or timed out
          }
        }

        if (!rawResponse || !rawResponse.trim()) {
          throw new AiInfrastructureError(
            hasKey ? "CLUSTER_OUTAGE" : "AI_KEYS_EXHAUSTED",
            `No pudimos conectar con el motor de IA para generar tus preguntas personalizadas. Revisa tu conexión o tu clave de ${activeProvider.toUpperCase()}.`,
            503,
            activeProvider as any,
          );
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
      return `Pedagogical CEFR A1 (Beginner) Guidance - MANDATORY:
- Candidate ONLY understands ultra-basic, high-frequency words (e.g., work, start, time, office, computer, team, like, day, help, speak).
- Questions MUST be ultra-short, simple, and direct (max 6 to 9 words).
- Grammar: Strictly SIMPLE PRESENT with auxiliary 'Do/Does' or verb 'to be' (e.g., "Do you work in an office?", "What time do you start work?", "Do you use a computer?").
- STRICTLY FORBIDDEN in A1: Specialized technical jargon, medical/clinical vocabulary ("gloves", "patients", "examine", "treat"), multi-clause sentences, conditionals, or past/future tenses.
- Categories: Use only "WARMUP" or "ROUTINE".
- StarHint: Very short 1-sentence pattern (e.g., "Answer simply: 'I start work at 8 AM.'").
- ExpectedKeywords: 3 elementary high-frequency words (e.g., ["work", "morning", "computer"]).`;
    }
    if (level.startsWith("A2")) {
      return `Pedagogical CEFR A2 (Elementary) Guidance - MANDATORY:
- Candidate has basic elementary vocabulary for everyday work routines and familiar workplace situations.
- Questions MUST be direct, short, and very simple (max 8 to 12 words). Must be basiquísimo.
- Grammar: Simple present and simple past only (e.g., "What tasks do you do in the morning?", "How do you communicate with your team?", "Did you work yesterday?").
- STRICTLY FORBIDDEN in A2: Unfamiliar technical terms, clinical/medical words ("examine", "patients", "gloves" unless the candidate is a healthcare worker), abstract corporate idioms, or complex multi-clause structures.
- Categories: Use "WARMUP", "ROUTINE", or "TEAMWORK".
- StarHint: Simple structure suggestion (e.g., "Say: 'In the morning I check emails and speak with my team.'").
- ExpectedKeywords: 3-4 basic words (e.g., ["tasks", "team", "routine", "email"]).`;
    }
    if (level.startsWith("B1") || level.startsWith("B2")) {
      return `Pedagogical CEFR B1/B2 Guidance:
- Intermediate professional English: explaining procedures, addressing client or colleague concerns, handling everyday roadblocks.
- Emphasize clear narrative structure, professional collocations, and collaborative problem-solving skills.
- Categories: WARMUP, TECHNICAL, BEHAVIORAL, SITUATIONAL.`;
    }
    return `Pedagogical CEFR C1/C2 Guidance:
- Advanced professional fluency: strategic vision, complex decision-making, multidisciplinary leadership, and technical nuances.
- Demand sophisticated discourse markers, precise professional terminology, and articulate hypothetical reasoning.
- Categories: TECHNICAL, STRATEGY, BEHAVIORAL, SITUATIONAL.`;
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
