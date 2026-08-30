/**
 * Core AI Evaluator Service
 * Connects directly to the CELAEST-CORE IA-Mesh (http://127.0.0.1:8085/api/v1/ai/chat/simple)
 * Evaluates candidate responses in real time with high-speed LLM inference (Groq Llama 3.3 70B / DeepSeek)
 * and structured JSON educational parsing with False Cognates Hunter.
 */

import {
  SpecificErrorItem,
  TurnEvaluationFeedback,
  InterviewQuestionItem,
} from "./interviewEngineService";
import { MasterAiFeedbackEngine, StrategicFeedbackItem } from "./masterAiFeedbackEngine";
import { UniversalLinguisticParser } from "./universalLinguisticParser";
import { normalizeTranslationAndExplanation } from "./linguisticTranslationNormalizer";
import { HttpClient } from "../../../infrastructure/http/HttpClient";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

const CORE_AI_URL = `${ENV.coreAiUrl}/ai/chat/simple`;

export function sanitizeFeedbackTone(raw: string): string {
  if (!raw) return "";
  let text = raw;

  // 1. Convert numbered keycap emojis (1️⃣, 2️⃣, etc.) to clean typographic numbering (1., 2.)
  text = text
    .replace(/1️⃣/g, "1.")
    .replace(/2️⃣/g, "2.")
    .replace(/3️⃣/g, "3.")
    .replace(/4️⃣/g, "4.")
    .replace(/5️⃣/g, "5.")
    .replace(/6️⃣/g, "6.")
    .replace(/7️⃣/g, "7.")
    .replace(/8️⃣/g, "8.")
    .replace(/9️⃣/g, "9.")
    .replace(/0️⃣/g, "0.");

  // 2. Remove all other Unicode emojis and pictographs, then strip the joining /
  //    selection code points that multi-code-point emojis leave behind (variation
  //    selectors, zero-width joiners, keycap enclosers).
  text = text.replace(
    /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{E0020}-\u{E007F}]/gu,
    "",
  );
  text = text.replace(/\p{M}/gu, "");
  text = text.replace(/\u200D/g, "");

  // 3. Transform harsh / punitive phrases into empathetic coaching terminology
  text = text
    .replace(
      /extremadamente fragmentada,?\s*incomprensible\s*y\s*carece de cualquier estructura coherente/gi,
      "con ideas clave que necesitan mayor conexión e hilo conductor",
    )
    .replace(/falta total de preparación/gi, "oportunidad de consolidar tu estructura")
    .replace(/falta de preparación/gi, "oportunidad de estructura")
    .replace(/habilidad muy limitada/gi, "habilidad en pleno desarrollo")
    .replace(/incomprensible/gi, "con una idea principal difusa")
    .replace(/extremadamente fragmentada/gi, "con oraciones por enlazar")
    .replace(
      /carece de cualquier estructura coherente/gi,
      "cuenta con una estructura por consolidar",
    )
    .replace(/trabaje intensamente/gi, "practiques paso a paso")
    .replace(/trabajar intensamente/gi, "practicar paso a paso");

  // 4. Strict 2nd person conversion (Tú / Tu vs. El candidato)
  text = text
    .replace(/\bLa respuesta del candidato\b/gi, "Tu respuesta")
    .replace(/\bla respuesta del candidato\b/gi, "tu respuesta")
    .replace(/\bEl candidato debe\b/gi, "Te recomendamos")
    .replace(/\bel candidato debe\b/gi, "te recomendamos")
    .replace(/\bEl candidato puede\b/gi, "Puedes")
    .replace(/\bel candidato puede\b/gi, "puedes")
    .replace(/\bEl candidato\b/gi, "Tú")
    .replace(/\bel candidato\b/gi, "tú")
    .replace(/\bal candidato\b/gi, "a ti")
    .replace(/\bdel candidato\b/gi, "de tu perfil")
    .replace(/\bsu habilidad\b/gi, "tu habilidad")
    .replace(/\bsus respuestas\b/gi, "tus respuestas")
    .replace(/\bsus ideas\b/gi, "tus ideas")
    .replace(/\bsus motivaciones\b/gi, "tus motivaciones")
    .replace(/\bsu experiencia\b/gi, "tu experiencia");

  // 5. Clean spaces before punctuation and remove duplicate spaces
  text = text.replace(/\s+([.,;:!?])/g, "$1");
  text = text.replace(/[ \t]+/g, " ");

  return text.trim();
}

/**
 * Shape the CELAEST-CORE LLM is instructed to return. All fields are optional
 * because the response may be truncated or partially repaired.
 */
interface LlmEvaluationPayload {
  overallScore?: number;
  grammarScore?: number;
  clarityScore?: number;
  vocabularyScore?: number;
  /** Alternative score key names some provider models emit. */
  overall?: number;
  grammar?: number;
  grammar_score?: number;
  vocabulary?: number;
  vocabulary_score?: number;
  vocabScore?: number;
  clarity?: number;
  clarity_score?: number;
  overall_score?: number;
  improvedFullAnswer?: string;
  strategicFeedback?: {
    title?: string;
    explanation?: string;
    recommendation?: string;
  };
  unclearOrErrorWords?: unknown;
  keyStrengths?: unknown;
  tipsForNextTurn?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const asScore = (value: unknown, fallback = 50): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Pedagogical relevance of a correction: grammar/vocabulary issues and more
 * foundational (lower CEFR) mistakes are prioritized so the learner always sees
 * the 5 most useful corrections first, never an overwhelming wall of notes.
 */
const relevanceScore = (e: SpecificErrorItem): number => {
  const typeWeight = e.errorType === "GRAMMAR" || e.errorType === "VOCABULARY" ? 3 : 2;
  const cefrWeight = ["A1", "A2"].includes(e.cefrLevel)
    ? 3
    : ["B1", "B2"].includes(e.cefrLevel)
      ? 2
      : 1;
  const actionable = e.translationSpanish && e.translationSpanish.trim().length > 0 ? 1 : 0;
  return typeWeight + cefrWeight + actionable;
};

/**
 * Resiliently repairs and parses JSON from LLMs, handling truncated strings or unclosed brackets
 */
function repairAndParseJson(raw: string): LlmEvaluationPayload | null {
  if (!raw || typeof raw !== "string") return null;

  // 1. Direct standard parse attempt
  const directMatch = raw.match(/\{[\s\S]*\}/);
  if (directMatch) {
    try {
      return JSON.parse(directMatch[0]) as LlmEvaluationPayload;
    } catch {
      // Continue to auto-repair
    }
  }

  // 2. Locate first '{'
  const firstBrace = raw.indexOf("{");
  if (firstBrace === -1) return null;
  let s = raw.substring(firstBrace);

  // Clean trailing unclosed strings, dangling keys or incomplete quotes
  s = s.replace(/,\s*""\s*$/, "");
  s = s.replace(/,\s*"[^"]*"\s*:\s*("[^"]*)?$/, "");
  s = s.replace(/,\s*\{[^}]*$/, ""); // unclosed object at tail
  s = s.replace(/,\s*$/, ""); // trailing comma

  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escape = false;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' && !escape) {
      inString = !inString;
    } else if (!inString) {
      if (c === "{") openBraces++;
      else if (c === "}") openBraces--;
      else if (c === "[") openBrackets++;
      else if (c === "]") openBrackets--;
    }
    escape = c === "\\" && !escape;
  }

  // Close unclosed strings
  if (inString) s += '"';
  s = s.replace(/,\s*$/, "");

  // Close open brackets in reverse order
  while (openBrackets > 0) {
    s += "]";
    openBrackets--;
  }
  while (openBraces > 0) {
    s += "}";
    openBraces--;
  }

  try {
    return JSON.parse(s) as LlmEvaluationPayload;
  } catch (err) {
    logger.warn("[CoreAiEvaluator] JSON repair failed:", err);
    return null;
  }
}

export class CoreAiEvaluatorService {
  /**
   * Evaluates user answer using CELAEST-CORE real LLM with graceful local fallback
   */
  public static async evaluate(
    spokenText: string,
    currentQuestion: InterviewQuestionItem,
  ): Promise<TurnEvaluationFeedback & { strategicFeedback?: StrategicFeedbackItem | null }> {
    const cleanText = spokenText.trim();

    if (!cleanText || cleanText.length < 3) {
      return UniversalLinguisticParser.parse(spokenText, currentQuestion);
    }

    const systemPrompt = `You are an empathetic AI English Mentor for Spanish-speaking professionals preparing for job interviews. Address user as "tú" in all Spanish text. Use growth-oriented language; never punitive.

RULES:
1. CHILL PILL: If the answer is grammatically correct and natural, return EMPTY [] for "unclearOrErrorWords". Do NOT penalize synonyms or nitpick valid phrasing. Reward C1/C2 excellence with 95-100%.
2. FALSE COGNATES: Flag Spanish false friends (assist≠attend, resume≠summarize, realize≠implement, pretend≠intend, compromise≠commitment, actual≠current, fastly→quickly, win money→earn/generate revenue, make the work→do the work). Explain in Spanish.
3. STRATEGIC FEEDBACK in Spanish: "title" (motivating), "explanation" (appreciation + constructive diagnosis using "tú"), "recommendation" (actionable step-by-step with example).
4. MAX 5 errors. "explanation" = grammar rule in Spanish. "translationSpanish" = direct Spanish translation of corrected phrase ONLY (no tips).
5. No emojis. No markdown. Return ONLY raw JSON.

JSON schema:
{
  "overallScore": number (0-100),
  "grammarScore": number (0-100),
  "clarityScore": number (0-100),
  "vocabularyScore": number (0-100),
  "improvedFullAnswer": string (C2 model answer for this question),
  "strategicFeedback": {
    "title": string (ES),
    "explanation": string (ES, 2nd person tú),
    "recommendation": string (ES, step-by-step with example)
  },
  "unclearOrErrorWords": [
    {
      "id": string,
      "errorType": "GRAMMAR" | "VOCABULARY" | "UNCLEAR_WORD",
      "errorWord": string,
      "correctWord": string,
      "userSaidContext": string,
      "betterWay": string,
      "explanation": string (grammar rule in Spanish),
      "translationSpanish": string (Spanish translation of corrected phrase only),
      "cefrLevel": "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
    }
  ],
  "keyStrengths": string[],
  "tipsForNextTurn": string
}`;

    const userMessage = `Interview Question: "${currentQuestion.question}"
Candidate Role: Product Manager
Candidate Spoken Answer: "${cleanText}"`;

    try {
      // 1. Tier 1: Evaluate via CELAEST-English Backend (Auth, Caching, Rate Limiting, Telemetry)
      let parsed: LlmEvaluationPayload | null = null;
      try {
        parsed = await HttpClient.post<LlmEvaluationPayload>(
          "/interview/evaluate",
          {
            spokenText: cleanText,
            question: currentQuestion.question,
            questionId: String(currentQuestion.id),
            roleName: "Product Manager",
          },
          { timeoutMs: 25_000 },
        );
      } catch (backendErr) {
        logger.warn(
          "[CoreAiEvaluator] Go Backend failed, trying direct Core AI Mesh fallback:",
          backendErr,
        );

        // 2. Tier 2: Direct Core AI fallback
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const bodyPayload = {
          system: systemPrompt,
          message: userMessage,
          provider: "groq",
          max_tokens: 4096,
        };

        const response = await fetch(CORE_AI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = (await response.json()) as { response?: string; content?: string };
          parsed = repairAndParseJson(data.response || data.content || "");
        }
      }

      if (parsed) {
          // 🧠 Enrich LLM feedback with the deterministic local grammar/spanglish
          // engine so learners always get thorough, actionable corrections even
          // when the model returns only a couple of items.
          const localEngine = MasterAiFeedbackEngine.evaluateTurn(cleanText, currentQuestion);

          const rawErrors: SpecificErrorItem[] = Array.isArray(parsed.unclearOrErrorWords)
            ? parsed.unclearOrErrorWords.filter(isRecord).map((item, idx) => {
                const betterWay = asString(item.betterWay) || asString(item.correctWord);
                const correctWord = asString(item.correctWord, "(Recommended phrasing)");
                const errorWord = asString(item.errorWord, "(Unclear phrase)");
                const rawTrans = asString(item.translationSpanish);
                const rawExpl = asString(item.explanation);

                const normalized = normalizeTranslationAndExplanation(
                  betterWay,
                  errorWord,
                  rawTrans,
                  rawExpl,
                  correctWord,
                );

                return {
                  id: asString(item.id) || `err-ai-${idx}-${Date.now()}`,
                  errorType:
                    item.errorType === "GRAMMAR" ||
                    item.errorType === "VOCABULARY" ||
                    item.errorType === "UNCLEAR_WORD"
                      ? item.errorType
                      : asString(item.errorType).toLowerCase().includes("grammar")
                        ? "GRAMMAR"
                        : asString(item.errorType).toLowerCase().includes("vocab")
                          ? "VOCABULARY"
                          : "UNCLEAR_WORD",
                  errorWord,
                  correctWord: asString(item.correctWord, "(Recommended phrasing)"),
                  userSaidContext: asString(item.userSaidContext, cleanText.slice(0, 50)),
                  betterWay,
                  explanation: normalized.grammarExplanation,
                  translationSpanish: normalized.translationSpanish,
                  cefrLevel: asString(item.cefrLevel, "B2"),
                  savedToMemory: false,
                };
              })
            : [];

          // 🛡️ Merge LLM errors with the local pattern engine, dedupe by phrase,
          // then keep the 5 most pedagogically relevant corrections.
          const mergedErrors: SpecificErrorItem[] = [
            ...rawErrors,
            ...(localEngine.unclearOrErrorWords || []),
          ];

          const seenErrorKeys = new Set<string>();
          const uniqueErrors: SpecificErrorItem[] = [];

          for (const err of mergedErrors) {
            const key = `${err.errorWord.toLowerCase().trim()}|${err.correctWord.toLowerCase().trim()}`;
            if (!seenErrorKeys.has(key)) {
              seenErrorKeys.add(key);
              uniqueErrors.push(err);
            }
          }

          const errors = uniqueErrors
            .map((e) => ({ e, score: relevanceScore(e) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((x) => x.e);

          // Count grammar & vocabulary errors to enforce mathematical honesty
          const grammarErrorsCount = errors.filter((e) => e.errorType === "GRAMMAR").length;
          const vocabErrorsCount = errors.filter(
            (e) => e.errorType === "VOCABULARY" || e.errorType === "UNCLEAR_WORD",
          ).length;

          // Parse initial scores with fallback across various naming keys
          let grammar = asScore(parsed.grammarScore ?? parsed.grammar_score ?? parsed.grammar);
          let vocab = asScore(
            parsed.vocabularyScore ??
              parsed.vocabulary_score ??
              parsed.vocabScore ??
              parsed.vocabulary,
          );
          let clarity = asScore(parsed.clarityScore ?? parsed.clarity_score ?? parsed.clarity);
          let overall = asScore(parsed.overallScore ?? parsed.overall_score ?? parsed.overall);

          // Normalize 1-5 scale to 0-100 scale if needed
          if (grammar <= 10 && grammarErrorsCount === 0)
            grammar = Math.min(100, Math.round(grammar * 20));
          if (vocab <= 10 && vocabErrorsCount === 0) vocab = Math.min(100, Math.round(vocab * 20));
          if (clarity <= 10) clarity = Math.min(100, Math.round(clarity * 20));
          if (overall <= 10) overall = Math.min(100, Math.round(overall * 20));

          // 🌟 If there are 0 errors, celebrate perfection with 95-100%
          if (errors.length === 0) {
            grammar = Math.max(grammar, 98);
            vocab = Math.max(vocab, 96);
            clarity = Math.max(clarity, 96);
            overall = Math.max(overall, 98);
          } else {
            // 🛡️ Mathematical Consistency Clamp when real errors exist:
            if (grammarErrorsCount >= 8) {
              grammar = Math.min(grammar, 15);
            } else if (grammarErrorsCount >= 5) {
              grammar = Math.min(grammar, 25);
            } else if (grammarErrorsCount >= 3) {
              grammar = Math.min(grammar, 40);
            } else if (grammarErrorsCount === 2) {
              grammar = Math.min(grammar, 60);
            } else if (grammarErrorsCount === 1) {
              grammar = Math.min(grammar, 75);
            }

            if (vocabErrorsCount >= 5) {
              vocab = Math.min(vocab, 30);
            } else if (vocabErrorsCount >= 2) {
              vocab = Math.min(vocab, 55);
            }

            const computedOverall = Math.round(grammar * 0.4 + vocab * 0.35 + clarity * 0.25);
            if (errors.length >= 4) {
              overall = Math.min(overall, computedOverall);
            }
          }

          // Dynamic strategic feedback synthesis ensuring no empty/static values
          const rawStrengths: string[] = Array.isArray(parsed.keyStrengths)
            ? parsed.keyStrengths.filter((s): s is string => typeof s === "string")
            : [];
          const strengthsList: string[] =
            rawStrengths.length > 0
              ? rawStrengths
              : ["Comunicación directa", "Enfoque estructurado"];

          const rawTips: string = parsed.tipsForNextTurn || "";

          let strategicFeedback: StrategicFeedbackItem | null = null;
          if (
            parsed.strategicFeedback &&
            (parsed.strategicFeedback.explanation || parsed.strategicFeedback.recommendation)
          ) {
            strategicFeedback = {
              type: "STRATEGIC_WARNING",
              title: sanitizeFeedbackTone(
                parsed.strategicFeedback.title || "Análisis Estratégico de tu Respuesta",
              ),
              explanation: sanitizeFeedbackTone(
                parsed.strategicFeedback.explanation ||
                  (strengthsList.length > 0
                    ? `Articulaste bien conceptos clave como ${strengthsList
                        .slice(0, 2)
                        .map((s: string) => `'${s}'`)
                        .join(" y ")}.`
                    : "Identificamos buenas ideas en tu respuesta para seguir estructurando."),
              ),
              recommendation: sanitizeFeedbackTone(
                parsed.strategicFeedback.recommendation ||
                  rawTips ||
                  "Paso a paso: Para tu próxima toma, conecta 2 oraciones simples usando el modelo STAR.",
              ),
            };
          } else if (rawTips) {
            strategicFeedback = {
              type: "STRATEGIC_WARNING",
              title: "Recomendación Estratégica",
              explanation: sanitizeFeedbackTone(
                strengthsList.length > 0
                  ? `Destacaste al abordar ${strengthsList
                      .slice(0, 2)
                      .map((s: string) => `'${s}'`)
                      .join(" y ")} con iniciativa comunicativa.`
                  : "Tu respuesta demuestra entendimiento del rol y ganas de transmitir tu experiencia.",
              ),
              recommendation: sanitizeFeedbackTone(rawTips),
            };
          }

          if (!strategicFeedback && localEngine.strategicFeedback) {
            strategicFeedback = localEngine.strategicFeedback;
          }

          const sanitizedErrors = errors.map((err) => ({
            ...err,
            explanation: sanitizeFeedbackTone(err.explanation),
            translationSpanish: sanitizeFeedbackTone(err.translationSpanish),
          }));

          return {
            overallScore: overall,
            grammarScore: grammar,
            clarityScore: clarity,
            vocabularyScore: vocab,
            userSpokenText: cleanText,
            improvedFullAnswer:
              parsed.improvedFullAnswer ||
              UniversalLinguisticParser.parse(cleanText, currentQuestion).improvedFullAnswer,
            unclearOrErrorWords: sanitizedErrors,
            keyStrengths: strengthsList.map((s) => sanitizeFeedbackTone(s)),
            tipsForNextTurn: sanitizeFeedbackTone(
              rawTips ||
                "¡Gran esfuerzo! Mantén este ritmo y enfócate en conectar tus ideas paso a paso.",
            ),
            strategicFeedback,
          };
        }
    } catch (err) {
      logger.warn(`[CoreAiEvaluator] IA-Mesh call error or timeout:`, err);
    }

    // High-fidelity local fallback if remote provider fails or times out.
    // Prefer the comprehensive pattern engine over the minimal parser.
    logger.warn("[CoreAiEvaluator] Falling back to MasterAiFeedbackEngine.");
    return MasterAiFeedbackEngine.evaluateTurn(cleanText, currentQuestion);
  }
}
