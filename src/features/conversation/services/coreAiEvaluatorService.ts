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
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { directClientAiService, AiInfrastructureError } from "../../settings/services/directClientAiService";

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
  /** LLM's own CEFR estimation based on linguistic analysis. */
  estimatedCefrLevel?: string;
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
  reconciledTranscript?: string;
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

const EVALUATION_CACHE = new Map<
  string,
  TurnEvaluationFeedback & { strategicFeedback?: StrategicFeedbackItem | null }
>();
const MAX_CACHE_SIZE = 100;

function getEvaluationCacheKey(questionId: string | number, roleName: string, text: string, targetLevel: string = "B1"): string {
  return `${questionId}::${roleName}::${targetLevel}::${text.toLowerCase().trim().replace(/\s+/g, " ")}`;
}

export class CoreAiEvaluatorService {
  /**
   * Evaluates user answer using CELAEST-CORE real LLM with graceful local fallback
   */
  public static async evaluate(
    spokenText: string,
    currentQuestion: InterviewQuestionItem,
    roleName: string = "Professional",
    targetLevel?: string,
  ): Promise<TurnEvaluationFeedback & { strategicFeedback?: StrategicFeedbackItem | null }> {
    const cleanText = spokenText.trim();

    if (!cleanText || cleanText.length < 3) {
      return UniversalLinguisticParser.parse(spokenText, currentQuestion);
    }

    const effectiveLevel = targetLevel || currentQuestion.targetLevel || "B1";
    const cacheKey = getEvaluationCacheKey(currentQuestion.id, roleName, cleanText, effectiveLevel);
    const cachedResult = EVALUATION_CACHE.get(cacheKey);
    if (cachedResult) {
      logger.info("[CoreAiEvaluator] Serving evaluation from idempotency cache (0 tokens):", cacheKey);
      return {
        ...cachedResult,
        userSpokenText: cachedResult.reconciledTranscript || cachedResult.userSpokenText || cleanText,
      };
    }

    let modelAnswerDirective = "";
    let strategicFeedbackDirective = "";
    let levelRigorDirective = "";

    if (effectiveLevel.startsWith("A1") || effectiveLevel.startsWith("A2")) {
      modelAnswerDirective = `7. ACHIEVABLE MODEL ANSWER IN ENGLISH (A2-B1 Target Level): The "improvedFullAnswer" field MUST be written in natural, clear, and achievable English (target A2-B1) that an A1/A2 beginner can realistically practice saying without frustration. Use clear sentence structures, everyday professional vocabulary tailored to their profession, and simple connectors (e.g. "I work with...", "In my daily routine, I use...", "because it helps my team"). DO NOT overwhelm the candidate with dense C2 executive idioms or abstract academic vocabulary.`;
      strategicFeedbackDirective = `3. PEDAGOGICAL LEARNING FEEDBACK (A1-A2 Beginner Scaffolding):
   - You are a warm, supportive personal English tutor helping an entry-level professional build speaking confidence. Address candidate as "tú".
   - "title": Inspiring, supportive title in Spanish (e.g. "¡Gran esfuerzo! Aprendamos este patrón clave").
   - "explanation": Celebrate the candidate's effort to communicate. Explain the most crucial grammatical or vocabulary concept in simple, accessible Spanish without academic jargon.
   - "recommendation": Give an educational mini-lesson with a ready-to-speak sentence template in English with Spanish context, e.g.: "Paso a paso: Para tu próxima respuesta, intenta usar esta estructura sencilla: 'I usually work with [Herramienta] because [Razón simple]'. Dilo en voz alta: 'I usually work with React because it is fast'."`;
      levelRigorDirective = `10. LEVEL-CALIBRATED RIGOR & FLEXIBILITY (A1-A2 Beginner / Elementary):
   - PEDAGOGICAL LENIENCY WITH ACCURATE DETECTION: The candidate is an entry-level learner. Prioritize communicative encouragement, but ALWAYS detect and teach foundational beginner mistakes.
   - ZERO TRIVIAL NITPICKS: NEVER penalize natural speech contractions ("I'm", "don't") or natural conversational fillers.
   - FOUNDATIONAL A1/A2 GRAMMAR FLAWS: You MUST flag essential beginner errors:
     1) Past narrative tense mismatch (e.g. 'Yesterday, I go' -> 'Yesterday, I went').
     2) Infinitive of purpose (e.g. 'for buy' -> 'to buy', 'for achieve' -> 'to achieve').
     3) Participle adjectives for states of places/objects (e.g. 'was close' -> 'was closed', 'is broke' -> 'is broken').
     4) Modal auxiliary tense & base form (e.g. 'can't bought' -> 'couldn't buy'). Modals always take the base bare infinitive ('buy', never 'bought'), and in the past use 'couldn't'.
     5) Double negatives (e.g. 'couldn't ... nothing' -> 'couldn't ... anything').
     6) Double verbs / auxiliary misuse (e.g. 'I am help' -> 'I help', 'I am agree' -> 'I agree').
     7) Subject-verb agreement ('he work' -> 'he works').
   - EXHAUSTIVE ERROR CAPTURE: If the beginner makes 2, 3, 4, or 5 distinct errors in their sentence, you MUST capture EVERY SINGLE ONE in "unclearOrErrorWords". Do NOT stop at 1 or 2 errors!
   - If and only if the candidate's sentence is grammatically sound, return "unclearOrErrorWords": [].`;
    } else if (effectiveLevel.startsWith("B1") || effectiveLevel.startsWith("B2")) {
      modelAnswerDirective = `7. PROFESSIONAL STAR MODEL ANSWER IN ENGLISH (B2-C1 Target Level): The "improvedFullAnswer" field MUST be written in fluent, professional corporate English (B2-C1) demonstrating STAR methodology invisibly. Deliver a smooth, confident answer suitable for mid-to-senior interviews in their profession.`;
      strategicFeedbackDirective = `3. PROFESSIONAL STAR COACHING (B1-B2 Intermediate):
   - You are an executive career interview coach. Address candidate as "tú".
   - CRITICAL CEFR CALIBRATION: The candidate is practicing for B1/B2 intermediate interviews. NEVER mention or say "la base fundamental para niveles A1 y A2" or treat the candidate like an elementary beginner.
   - "title": Career-oriented title (e.g. "Estructura profesional y consistencia gramatical").
   - "explanation": Concrete analysis of professional fluency, tense consistency in narrative (e.g. maintaining past simple throughout), avoiding Spanish interference patterns (like double negatives, 'for + verb' purpose, and participle adjective omission), and structural clarity.
   - "recommendation": Actionable coaching on narrative transitions and STAR methodology (Situation, Task, Action, Result) with a concrete corrected example.`;
      levelRigorDirective = `10. LEVEL-CALIBRATED RIGOR & FLEXIBILITY (B1-B2 Intermediate):
   - BALANCED PROFESSIONAL RIGOR: You MUST detect, flag, and explain authentic grammatical, prepositional, and lexical flaws.
   - MANDATORY EXHAUSTIVE ERROR CAPTURE: Always capture EVERY flaw in the candidate's sentence clause by clause:
     1) Narrative past tense consistency across clauses (e.g. 'Yesterday, I go' -> 'Yesterday, I went').
     2) Infinitive of purpose (e.g. 'for buy' -> 'to buy', 'for improve' -> 'to improve', 'for achieve' -> 'to achieve', 'for drive' -> 'to drive').
     3) Participle adjectives for states of businesses/conditions (e.g. 'the store was close' -> 'the store was closed', 'the system was break' -> 'was broken').
     4) Modal auxiliary tense & base form (e.g. 'can't bought' -> 'couldn't buy'). Modals ('can', 'could', 'should', 'would') MUST be followed by bare base infinitive ('buy', never 'bought'), and past context requires 'couldn't'.
     5) Double negatives (e.g. 'couldn't ... nothing' -> 'couldn't ... anything', 'didn't do nothing' -> 'didn't do anything').
     6) Gerunds after prepositions (e.g. 'after make' -> 'after making', 'before deploy' -> 'before deploying', 'without lose' -> 'without losing', 'by check' -> 'by checking').
     7) Preposition errors & missing prepositions (e.g. 'looking how' -> 'looking at how', 'focus in' -> 'focus on', 'listen them' -> 'listen to them').
     8) Modal + to (e.g. 'must to' -> 'must').
     9) Uncountable collective nouns (e.g. 'personnels' -> 'personnel / staff').
     10) Casual sentence fragments (e.g. 'A lot of things.' -> complete professional sentence).
     11) Excessive repetition of basic verbs (e.g. repeating 'use' 3+ times -> suggest 'utilize', 'leverage', 'rely on').
   - EXHAUSTIVE AUDIT MANDATE: You MUST output ALL distinct errors found in the sentence. If a sentence contains 5 distinct errors, you MUST return 5 items in "unclearOrErrorWords". NEVER stop at 2 errors!
   - If and only if the candidate's answer is grammatically sound, natural, and lexically varied, return "unclearOrErrorWords": [].`;
    } else {
      modelAnswerDirective = `7. INVISIBLE STAR MODEL ANSWER IN ENGLISH (C2 Executive Level): The "improvedFullAnswer" field MUST ALWAYS BE WRITTEN IN NATIVE EXECUTIVE ENGLISH (C2 level) demonstrating STAR methodology invisibly. Deliver a continuous, elegant, and natural conversational response suitable for a top-tier executive interview.`;
      strategicFeedbackDirective = `3. EXECUTIVE POLISH & RHETORICAL MASTERY (C1-C2 Executive):
   - You are a senior leadership advisor. Address candidate as "tú".
   - "title": Executive presence and mastery title (e.g. "Síntesis ejecutiva y persuasión estratégica").
   - "explanation": Deep analysis of rhetorical cadence, executive presence, business trade-offs, and elimination of conversational fillers.
   - "recommendation": Advanced framing, business outcome quantification with placeholders like [X]%, and concise, authoritative delivery.`;
      levelRigorDirective = `10. LEVEL-CALIBRATED RIGOR & FLEXIBILITY (C1-C2 Executive Mastery):
   - MAXIMUM RIGOR & UNCOMPROMISING PRECISION: Hold candidate to the highest executive standard. Scrutinize subtle prepositions, precise technical vocabulary, idiomatic naturalness, rhetorical cadence, and conciseness (BLUF).
   - Flag colloquialisms, redundant phrases, and passive voice. Hold candidate to native lead architect or C-level executive standard.`;
    }

    const systemPrompt = `You are an empathetic AI English Mentor for Spanish-speaking professionals preparing for job interviews. Address user as "tú" in all Spanish text. Use growth-oriented language; never punitive.

RULES:
1. HOLISTIC & HONEST SCORING:
   - "grammarScore" (0-100): Evaluates syntactic and grammatical correctness relative to communicative intent.
   - "vocabularyScore" (0-100): Evaluates range, technical precision, and domain depth suitable for their profession and target level (${effectiveLevel}).
   - "clarityScore" (0-100): Evaluates structure, direct relevance to the question, and communicative completeness.
   - "overallScore" (0-100): Balanced overall evaluation reflecting candidate interview readiness.
   - SHORT / EVASIVE ANSWERS: If the candidate gives a very short phrase that lacks professional depth: keep grammarScore accurate (high if no typos), but assign realistic vocabularyScore (30-45%), clarityScore (30-45%), and overallScore (35-50%). In strategicFeedback, explain in Spanish that while the sentence has no grammar errors, it needs to be expanded with concrete examples to effectively answer the interviewer.
   - COMPREHENSIVE TECHNICAL ANSWERS: For well-elaborated answers addressing the question with depth, reward with 85-100% and empty [] for unclearOrErrorWords if natural and correct.
1B. TOP 5 MOST CRITICAL PEDAGOGICAL CORRECTIONS:
   - Scrutinize the candidate's answer and identify grammatical, prepositional, tense, modal, and vocabulary errors.
   - Return AT MOST the 5 most critical errors in "unclearOrErrorWords", prioritized strictly by communicative gravity (how much they impede clarity) and foundational grammar rules for the candidate's level.
   - STRICT CARD LIMIT: You MUST return a maximum of 5 items in "unclearOrErrorWords". NEVER return 6 or more items. If candidate has 10 errors, choose ONLY the 5 highest-gravity errors and omit the rest.
   - For each error, "correctWord" MUST be the complete, grammatically correct standard English replacement for "errorWord" (e.g. if errorWord is "must to fixing", correctWord is "must fix", never an incomplete fragment like "must" or "fixing").
   - If there are fewer than 5 errors, return only the errors that genuinely exist. If there are 0 errors, return [].
2. FALSE COGNATES: Flag Spanish false friends (assist≠attend, resume≠summarize, realize≠implement, pretend≠intend, compromise≠commitment, actual≠current, fastly→quickly, win money→earn/generate revenue, make the work→do the work). Explain in Spanish.
${strategicFeedbackDirective}
4. RIGOROUS GRAMMAR RULE CARDS & ZERO-TYPO ORTHOGRAPHY:
   - ZERO-TYPO ENGLISH ORTHOGRAPHY: When generating corrections in "correctWord" or "betterWay", ensure the spelling strictly follows 100% standard English orthography. Regular past tense verbs MUST include the 'e' in '-ed' (e.g., 'checked', NEVER 'checkd'; 'worked', NEVER 'workd'; 'looked', NEVER 'lookd'; 'stopped', NEVER 'stoped'; 'planned', NEVER 'planed').
   - "explanation": DEBES explicar la regla lingüística o gramatical formal SIEMPRE EN ESPAÑOL con claridad pedagógica y rigor técnico. PROHIBIDO escribir la explicación en inglés y PROHIBIDO poner simples palabras sueltas como "utiliza" o "usa".
   - "translationSpanish": Traducción natural y completa al español de la frase u oración corregida, para que el estudiante entienda el significado exacto de lo que debió decir (e.g. "Ayer fui a la tienda para comprar leche, pero el supermercado estaba cerrado y no pude comprar nada"). PROHIBIDO poner reglas gramaticales o tips en este campo; debe ser únicamente la traducción directa en español de la frase corregida.
5. STRICT JSON VALIDITY & QUOTE RULES:
   - No emojis. No markdown code blocks (no \`\`\`json). Return ONLY a single raw valid JSON object.
   - NEVER use unescaped double quotes (") inside any JSON string values (especially inside "explanation", "recommendation", "betterWay", or "userSaidContext").
   - ALWAYS use single quotes (') for any quotes, examples, dialogue, or labels (e.g. use 'Situation: ...' instead of "Situation: ..."). Unescaped double quotes corrupt the JSON structure.
6. CEFR ESTIMATION: Based on the grammar complexity, vocabulary range, coherence, and error density of the candidate's answer, estimate their CEFR level (A1, A2, B1, B2, C1, or C2) and return it in the "estimatedCefrLevel" field.
${modelAnswerDirective}
8. NO FABRICATED METRICS (HONEST PLACEHOLDERS): In "improvedFullAnswer" and "strategicFeedback", NEVER invent arbitrary numerical metrics, percentages, or performance benchmarks that the candidate did not explicitly state. When framing quantifiable results, you MUST use clear bracketed placeholders like [X]%.
9. NON-ENGLISH GUARD: If the candidate's answer is in Spanish, not in English, or unintelligible noise, do NOT invent fake corrections. Set overallScore: 0, grammarScore: 0, clarityScore: 0, vocabularyScore: 0, estimatedCefrLevel: "A1", unclearOrErrorWords: [], and in strategicFeedback explain in Spanish: title: "Respuesta en español", explanation: "Detectamos que respondiste en español.", recommendation: "Para evaluar tu pronunciación y gramática, por favor responde en inglés a esta pregunta."
${levelRigorDirective}

JSON schema:
{
  "overallScore": number (0-100),
  "grammarScore": number (0-100),
  "clarityScore": number (0-100),
  "vocabularyScore": number (0-100),
  "estimatedCefrLevel": "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
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
  "improvedFullAnswer": string (Model answer IN ENGLISH ONLY matching target level ${effectiveLevel}),
  "strategicFeedback": {
    "title": string (ES),
    "explanation": string (ES, 2nd person tú),
    "recommendation": string (ES, step-by-step with example)
  },
  "keyStrengths": string[],
  "tipsForNextTurn": string
}
CRITICAL: Return exactly ONE valid JSON object matching the schema above. Do NOT output multiple JSON blocks, markdown backticks, or trailing commentary.`;

    const userMessage = `Interview Question: "${currentQuestion.question}"
Candidate Role: ${roleName}
Target CEFR Level: ${effectiveLevel}
Candidate Spoken Answer: "${cleanText}"`;

    try {
      let parsed: LlmEvaluationPayload | null = null;
      const isCoreEnabled = await providerKeyVault.isCentralCoreEnabled();

      if (!isCoreEnabled) {
        // Direct BYOK evaluation with active provider key
        const activeId = (await providerKeyVault.getActiveProviderId()) || "groq";
        const hasKey = await providerKeyVault.hasKey(activeId);
        if (!hasKey) {
          throw new AiInfrastructureError(
            "AI_KEYS_EXHAUSTED",
            `No se encontró una clave privada para ${activeId.toUpperCase()} y el Clúster Central está desactivado.`,
            401,
            activeId,
          );
        }
        const rawJson = await directClientAiService.chatCompletion({
          systemPrompt,
          userPrompt: userMessage,
          providerId: activeId,
          maxTokens: 4096,
        });
        parsed = repairAndParseJson(rawJson);
        if (!parsed) {
          throw new AiInfrastructureError(
            "GATEWAY_TIMEOUT",
            `El modelo ${activeId.toUpperCase()} no devolvió una estructura JSON válida.`,
            500,
            activeId,
          );
        }
      } else {
        // 1. Tier 1: Evaluate via CELAEST-English Backend (Auth, Caching, Rate Limiting, Telemetry)
        try {
          let byokHeaders: Record<string, string> = {};
          let byokBody: Record<string, string> = {};
          try {
            const activeId = await providerKeyVault.getActiveProviderId();
            if (activeId) {
              const cfg = await providerKeyVault.getConfig(activeId);
              const hasKey = await providerKeyVault.hasKey(activeId);
              byokHeaders["X-Active-Provider"] = activeId;
              if (cfg?.defaultModel) byokHeaders["X-Provider-Model"] = cfg.defaultModel;
              if (cfg?.endpoint) byokHeaders["X-Provider-Endpoint"] = cfg.endpoint;
              byokHeaders["X-Provider-Has-Key"] = hasKey ? "1" : "0";
              byokBody = {
                providerId: activeId,
                ...(cfg?.defaultModel ? { providerModel: cfg.defaultModel } : {}),
                ...(cfg?.endpoint ? { providerEndpoint: cfg.endpoint } : {}),
              };
            }
          } catch {
            // Vault read failure must never block evaluation
          }

          parsed = await HttpClient.post<LlmEvaluationPayload>(
            "/interview/evaluate",
            {
              spokenText: cleanText,
              question: currentQuestion.question,
              questionId: String(currentQuestion.id),
              roleName: roleName,
              targetLevel: effectiveLevel,
              ...byokBody,
            },
            { timeoutMs: 25_000, headers: byokHeaders },
          );
        } catch (backendErr: any) {
          logger.warn(
            "[CoreAiEvaluator] Go Backend failed, trying direct Core AI Mesh fallback:",
            backendErr,
          );

          // Identify if backend explicitly failed due to key exhaustion or rate limiting
          const beMsg = String(backendErr?.message || "").toLowerCase();
          const beDetails = String(backendErr?.details || backendErr?.rawErrorDetails || "").toLowerCase();
          const beCode = String(backendErr?.code || "").toLowerCase();
          const isBackendKeyExhaustion =
            beCode === "ai_keys_exhausted" ||
            beMsg.includes("exhausted") ||
            beMsg.includes("cooldown") ||
            beDetails.includes("exhausted") ||
            beDetails.includes("cooldown");

          // 2. Tier 2: Direct Core AI fallback — respect BYOK provider if set
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);

          let fallbackProvider = "groq";
          try {
            const a = await providerKeyVault.getActiveProviderId();
            if (a) fallbackProvider = a;
          } catch {
            // ignore
          }

          const bodyPayload = {
            system: systemPrompt,
            message: userMessage,
            provider: fallbackProvider,
            max_tokens: 4096,
          };

          try {
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
            } else {
              const errBodyText = await response.text().catch(() => "");
              let errJson: any = null;
              try {
                errJson = JSON.parse(errBodyText);
              } catch {
                // ignore
              }
              const errDetails =
                errJson?.details || errJson?.error || errJson?.message || errBodyText;
              const errCode = String(errJson?.code || "");
              const fullErr = `${response.status} ${errCode} ${errDetails}`.toLowerCase();

              if (
                response.status === 429 ||
                errCode === "AI_KEYS_EXHAUSTED" ||
                fullErr.includes("exhausted") ||
                fullErr.includes("cooldown") ||
                fullErr.includes("quota") ||
                fullErr.includes("saldo") ||
                fullErr.includes("all keys")
              ) {
                throw new AiInfrastructureError(
                  "AI_KEYS_EXHAUSTED",
                  typeof errDetails === "string" && errDetails.length > 0
                    ? errDetails
                    : "All AI keys in the pool are exhausted or in cooldown",
                  response.status || 429,
                  fallbackProvider as any,
                  errBodyText,
                );
              }

              if (
                response.status === 401 ||
                response.status === 403 ||
                fullErr.includes("unauthorized") ||
                fullErr.includes("api key")
              ) {
                throw new AiInfrastructureError(
                  "AUTH_DECLINED_KEY",
                  `Clave de ${fallbackProvider.toUpperCase()} no válida o revocada.`,
                  response.status,
                  fallbackProvider as any,
                  errBodyText,
                );
              }

              if (response.status === 504 || fullErr.includes("timeout")) {
                throw new AiInfrastructureError(
                  "GATEWAY_TIMEOUT",
                  `Tiempo de espera agotado al conectar con el motor de IA.`,
                  response.status,
                  fallbackProvider as any,
                  errBodyText,
                );
              }

              throw new AiInfrastructureError(
                "CLUSTER_OUTAGE",
                `Error en el servicio de IA (${response.status}): ${errDetails}`,
                response.status,
                fallbackProvider as any,
                errBodyText,
              );
            }
          } catch (fetchErr: any) {
            clearTimeout(timeoutId);
            if (fetchErr instanceof AiInfrastructureError) {
              throw fetchErr;
            }
            if (isBackendKeyExhaustion) {
              throw new AiInfrastructureError(
                "AI_KEYS_EXHAUSTED",
                backendErr?.message || "All AI keys in the pool are exhausted or in cooldown",
                429,
                fallbackProvider as any,
                JSON.stringify(backendErr?.details || {}),
              );
            }
            throw fetchErr;
          }
        }
      }

      if (parsed) {
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

          // The AI model evaluates and ranks the most critical errors (max 5).
          // Deduplicate if identical phrase keys exist, preserving AI priority.
          const seenErrorKeys = new Set<string>();
          const errors: SpecificErrorItem[] = [];

          for (const err of rawErrors) {
            const key = `${err.errorWord.toLowerCase().trim()}|${err.correctWord.toLowerCase().trim()}`;
            if (!seenErrorKeys.has(key)) {
              seenErrorKeys.add(key);
              errors.push(err);
              if (errors.length >= 5) break;
            }
          }

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
          } else {
            const fallbackEngineFeedback = MasterAiFeedbackEngine.evaluateTurn(cleanText, currentQuestion).strategicFeedback;
            strategicFeedback = fallbackEngineFeedback || {
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
              recommendation: sanitizeFeedbackTone(
                rawTips ||
                  "Estructura tu respuesta siguiendo la metodología STAR (Situación, Tarea, Acción, Resultado) para mayor impacto.",
              ),
            };
          }



          const sanitizeTypos = (str?: string): string => {
            if (!str) return "";
            return str.replace(/\b([a-zA-Z]{2,}k)d\b/g, "$1ed");
          };

          const sanitizedErrors = errors.map((err) => ({
            ...err,
            correctWord: sanitizeTypos(err.correctWord),
            betterWay: sanitizeTypos(err.betterWay),
            explanation: sanitizeFeedbackTone(sanitizeTypos(err.explanation)),
            translationSpanish: sanitizeFeedbackTone(sanitizeTypos(err.translationSpanish)),
          }));

          const finalResult = {
            overallScore: overall,
            grammarScore: grammar,
            clarityScore: clarity,
            vocabularyScore: vocab,
            estimatedCefrLevel: parsed.estimatedCefrLevel,
            userSpokenText: cleanText,
            reconciledTranscript: cleanText,
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

          if (EVALUATION_CACHE.size >= MAX_CACHE_SIZE) {
            const firstKey = EVALUATION_CACHE.keys().next().value;
            if (firstKey) EVALUATION_CACHE.delete(firstKey);
          }
          EVALUATION_CACHE.set(cacheKey, finalResult);

          return finalResult;
        }
    } catch (err: any) {
      logger.warn(`[CoreAiEvaluator] Error in evaluation pipeline:`, err);
      const isCore = await providerKeyVault.isCentralCoreEnabled().catch(() => true);

      // Re-throw any AiInfrastructureError or infrastructure failure so the UI modal can display!
      const errMsg = String(err?.message || err || "").toLowerCase();
      const errDetails = String(err?.rawErrorDetails || err?.details || "").toLowerCase();
      const fullErrStr = `${errMsg} ${errDetails} ${String(err?.code || "")}`.toLowerCase();

      const isInfraError =
        err instanceof AiInfrastructureError ||
        fullErrStr.includes("exhausted") ||
        fullErrStr.includes("cooldown") ||
        fullErrStr.includes("rate_limit") ||
        fullErrStr.includes("rate limit") ||
        fullErrStr.includes("ai_error") ||
        fullErrStr.includes("ai_keys_exhausted") ||
        fullErrStr.includes("insufficient_quota") ||
        fullErrStr.includes("quota") ||
        fullErrStr.includes("saldo") ||
        fullErrStr.includes("auth_declined") ||
        fullErrStr.includes("all keys") ||
        err?.status === 429 ||
        err?.status === 401 ||
        err?.status === 504 ||
        err?.code === "AI_KEYS_EXHAUSTED" ||
        err?.code === "RATE_LIMIT_COOLDOWN" ||
        err?.code === "AUTH_DECLINED_KEY";

      if (!isCore || isInfraError) {
        if (err instanceof AiInfrastructureError) {
          throw err;
        }
        const infraCode =
          fullErrStr.includes("exhausted") ||
          fullErrStr.includes("cooldown") ||
          fullErrStr.includes("quota") ||
          fullErrStr.includes("saldo") ||
          fullErrStr.includes("all keys")
            ? "AI_KEYS_EXHAUSTED"
            : fullErrStr.includes("rate") || err?.status === 429
              ? "RATE_LIMIT_COOLDOWN"
              : fullErrStr.includes("auth") || fullErrStr.includes("unauthorized") || err?.status === 401
                ? "AUTH_DECLINED_KEY"
                : fullErrStr.includes("timeout") || err?.status === 504
                  ? "GATEWAY_TIMEOUT"
                  : "CLUSTER_OUTAGE";

        throw new AiInfrastructureError(
          infraCode,
          err?.message || "AI request failed: all keys exhausted or in cooldown",
          err?.status || 500,
          undefined,
          errDetails || errMsg,
        );
      }
    }

    // When Central Core is deactivated, NEVER simulate or fall back to MasterAiFeedbackEngine!
    const isCore = await providerKeyVault.isCentralCoreEnabled().catch(() => true);
    if (!isCore) {
      throw new AiInfrastructureError(
        "GATEWAY_TIMEOUT",
        "No se pudo completar la evaluación con la clave de IA configurada. Por favor verifica tu cuota o el modelo seleccionado.",
        500,
      );
    }

    // High-fidelity local fallback ONLY when remote Central Core cluster fails or times out.
    logger.warn("[CoreAiEvaluator] Falling back to MasterAiFeedbackEngine.");
    const fallbackResult = MasterAiFeedbackEngine.evaluateTurn(cleanText, currentQuestion);
    if (EVALUATION_CACHE.size >= MAX_CACHE_SIZE) {
      const firstKey = EVALUATION_CACHE.keys().next().value;
      if (firstKey) EVALUATION_CACHE.delete(firstKey);
    }
    EVALUATION_CACHE.set(cacheKey, fallbackResult);
    return fallbackResult;
  }
}
