/**
 * Core AI Evaluator Service
 * Connects directly to the CELAEST-CORE IA-Mesh (http://127.0.0.1:8085/api/v1/ai/chat/simple)
 * Evaluates candidate responses in real time with high-speed LLM inference (Groq Llama 3.3 70B / DeepSeek)
 * and structured JSON educational parsing with False Cognates Hunter.
 */

import { SpecificErrorItem, TurnEvaluationFeedback, InterviewQuestionItem } from "./interviewEngineService";
import { StrategicFeedbackItem } from "./masterAiFeedbackEngine";
import { UniversalLinguisticParser } from "./universalLinguisticParser";

const CORE_AI_URL = "http://127.0.0.1:8085/api/v1/ai/chat/simple";

function cleanNoteText(note: string, explanation?: string): string {
  if (!note) return "";
  let text = note.trim();

  // If note contains the bombillito emoji 💡, extract the concise rule after it
  if (/[💡\uD83D\uDCA1]/.test(text)) {
    const parts = text.split(/[💡\uD83D\uDCA1]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      text = parts[parts.length - 1];
    } else if (parts.length === 1) {
      text = parts[0];
    }
  }

  // Remove any leftover emoji or leading punctuation
  text = text
    .replace(/^[💡\uD83D\uDCA1\s:,-]+/, "")
    .replace(/[💡\uD83D\uDCA1]/g, "")
    .trim();

  if (explanation && text.toLowerCase().trim() === explanation.toLowerCase().trim()) {
    text = text.replace(/^El término '[^']+' se utiliza incorrectamente;\s*/i, "");
  }

  return sanitizeFeedbackTone(text);
}

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

  // 2. Remove all other Unicode emojis, symbols, pictographs, variation selectors
  text = text.replace(
    /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2B50}\u{200D}\u{E0020}-\u{E007F}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{20E3}]/gu,
    ""
  );

  // 3. Transform harsh / punitive phrases into empathetic coaching terminology
  text = text
    .replace(/extremadamente fragmentada,?\s*incomprensible\s*y\s*carece de cualquier estructura coherente/gi, "con ideas clave que necesitan mayor conexión e hilo conductor")
    .replace(/falta total de preparación/gi, "oportunidad de consolidar tu estructura")
    .replace(/falta de preparación/gi, "oportunidad de estructura")
    .replace(/habilidad muy limitada/gi, "habilidad en pleno desarrollo")
    .replace(/incomprensible/gi, "con una idea principal difusa")
    .replace(/extremadamente fragmentada/gi, "con oraciones por enlazar")
    .replace(/carece de cualquier estructura coherente/gi, "cuenta con una estructura por consolidar")
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
 * Resiliently repairs and parses JSON from LLMs, handling truncated strings or unclosed brackets
 */
function repairAndParseJson(raw: string): any | null {
  if (!raw || typeof raw !== "string") return null;

  // 1. Direct standard parse attempt
  const directMatch = raw.match(/\{[\s\S]*\}/);
  if (directMatch) {
    try {
      return JSON.parse(directMatch[0]);
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
    return JSON.parse(s);
  } catch (err) {
    console.warn("[CoreAiEvaluator] JSON repair failed:", err);
    return null;
  }
}

export class CoreAiEvaluatorService {
  /**
   * Evaluates user answer using CELAEST-CORE real LLM with graceful local fallback
   */
  public static async evaluate(
    spokenText: string,
    currentQuestion: InterviewQuestionItem
  ): Promise<TurnEvaluationFeedback & { strategicFeedback?: StrategicFeedbackItem | null }> {
    const cleanText = spokenText.trim();

    if (!cleanText || cleanText.length < 3) {
      return UniversalLinguisticParser.parse(spokenText, currentQuestion);
    }

    const systemPrompt = `You are an empathetic, encouraging, and world-class AI English Mentor & Executive Product Coach.
Your primary mission is to empower professionals to build confidence, elevate their English fluency, and master high-stakes job interviews through constructive, practical, and inspiring mentorship.

CRITICAL MENTORSHIP & TONE PROTOCOLS (MANDATORY):
1. STRICT SECOND PERSON & EMPATHETIC VOICE (HABLA SIEMPRE DE "TÚ"):
   - ALWAYS address the user directly as "Tú" / "Tu respuesta" / "Tus ideas" / "Te recomendamos".
   - NEVER use third-person detached HR recruiter language (NEVER say "El candidato...", "La respuesta del candidato...").
   - Acknowledge the user's effort and courage in expressing complex thoughts in a second language.

2. POSITIVE GROWTH MINDSET & NO HARSH/PUNITIVE JUDGMENTS:
   - NEVER use punitive or dismissive words such as "falta total de preparación", "habilidad muy limitada", "incomprensible", "carece de cualquier estructura coherente", "debe trabajar intensamente".
   - ALWAYS use growth-oriented terminology:
     * Instead of "Falta de preparación" -> "Oportunidad de estructura" / "Estructura por consolidar".
     * Instead of "Incomprensible" / "Extremadamente fragmentada" -> "Idea principal difusa" / "Ideas con gran potencial que requieren mayor conexión".
     * Instead of "Debe trabajar intensamente" -> "Paso a paso: Para tu próxima toma, concéntrate en...".

3. THREE-PART COACHING STRATEGY IN SPANISH (MANDATORY FOR "strategicFeedback"):
   - "title": Short, motivating Spanish title focusing on the coaching opportunity (e.g. "Estructura y Conexión de Ideas", "Enfoque STAR para Mayor Impacto", "Claridad y Hilo Conductor").
   - "explanation": (EN ESPAÑOL) Follow the formula [Apreciación + Diagnóstico Pedagógico Constructivo]:
     * [Apreciación]: Reconoce el valor, el intento o los conceptos clave que el usuario intentó transmitir.
     * [Diagnóstico Pedagógico]: Explica de forma amable y clara qué ocurrió con la estructura o el hilo conductor sin juzgar (ej. "Identificamos ideas valiosas sobre tu rol e interés en el área, pero la estructura de las oraciones se diluyó en el camino. Para preguntas complejas de entrevista, el mayor reto es mantener un hilo conductor claro de principio a fin sin apresurarte.").
   - "recommendation": (EN ESPAÑOL) Follow the formula [Paso a paso con ejemplo concreto]:
     * Proporciona una técnica inmediata y manejable (ej. "Paso a paso: Para tu próxima toma, no intentes responder todo de golpe. Concéntrate en conectar solo 2 oraciones simples usando el modelo STAR (ej: 'In my previous role, I worked on X, and this helped me achieve Y'). Dominar estructuras cortas te dará control y confianza.").
   - "tipsForNextTurn": 1-2 frases alentadoras y prácticas para aplicar inmediatamente en la siguiente pregunta.
   - "keyStrengths": 2-4 conceptos o frases que el usuario intentó o expresó con buena iniciativa comunicativa.

4. THE "CHILL PILL" RULE (DO NOT INVENT ERRORS / NO AI NITPICKING):
   - If the user's response is grammatically correct, natural, and uses appropriate industry terminology (e.g. "highly anticipated", "right after deployment", "triage session", "roll back", "protect user experience", "blameless post-mortem"), you MUST return an EMPTY array \`[]\` for "unclearOrErrorWords".
   - DO NOT PENALIZE SYNONYMS: Do NOT correct valid native phrases just to suggest a personal preference. Only flag genuine errors in grammar, syntax, false cognates, or awkward Spanglish.
   - REWARD EXCELLENCE (95-100%): If the user delivers an articulate, high-impact, C1/C2 senior answer, award 95-100% across all categories.

5. SPANISH FALSE COGNATES & FALSE FRIENDS HUNTER (EXPLAIN PEDAGOGICALLY):
   Pay special attention to FALSE COGNATES typical of Spanish speakers and FLAG them constructively with friendly Spanish notes:
   - "assist to [meetings/events]" (asistir) -> MUST BE "attend [meetings/events]" (assist means ayudar).
   - "resume [a topic/meeting]" (resumir) -> MUST BE "summarize / recap / synthesize" (resume means reanudar).
   - "realize [features/tasks/work]" (realizar) -> MUST BE "build / implement / execute / carry out" (realize means darse cuenta).
   - "pretend [to achieve/do]" (pretender/intentar) -> MUST BE "aim to / intend to / strive to" (pretend means fingir).
   - "compromise" (compromiso laboral) -> MUST BE "commitment / dedication" (compromise means ceder/transigir).
   - "actual / actually" (actual/actualmente) -> MUST BE "current / currently / at present" (actually means en realidad).
   - "fastly" (rápidamente) -> MUST BE "quickly / rapidly" (fastly is not an English word).
   - "win money" (ganar dinero) -> MUST BE "generate revenue / earn a competitive salary".
   - "make the work / make tasks" (hacer el trabajo) -> MUST BE "do the work / complete tasks".
6. STRICT ZERO-EMOJIS MANDATE (PREMIUM EXECUTIVE LUXURY DESIGN):
   - NEVER use any emojis or emoji symbols anywhere in your output (DO NOT use 1️⃣, 2️⃣, 3️⃣, 💡, 🚀, 🎯, ✨, 🏆, 🔥, etc.).
   - Use clean typographic numbering: '1.', '2.', '3.' or 'Paso 1:', 'Paso 2:'.
   - Keep all text executive, elegant, and bespoke without decorative emoji clutter.

Return ONLY a valid JSON object matching this schema, with no markdown fences, no formatting text before or after:
{
  "overallScore": number (0-100),
  "grammarScore": number (0-100),
  "clarityScore": number (0-100),
  "vocabularyScore": number (0-100),
  "improvedFullAnswer": string (C2 Native level model answer tailored to this exact question),
  "strategicFeedback": {
    "title": string (EN ESPAÑOL: Título motivador y constructivo),
    "explanation": string (EN ESPAÑOL: Apreciación + Diagnóstico Pedagógico en 2ª persona 'tú'),
    "recommendation": string (EN ESPAÑOL: Paso a paso con ejemplo práctico y accionable)
  },
  "unclearOrErrorWords": [
    {
      "id": string,
      "errorType": "GRAMMAR" | "VOCABULARY" | "UNCLEAR_WORD",
      "errorWord": string,
      "correctWord": string,
      "userSaidContext": string,
      "betterWay": string,
      "explanation": string (Pedagogical rule explanation),
      "translationSpanish": string (Friendly Spanish learning note),
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const bodyPayload = {
        system: systemPrompt,
        message: userMessage,
        provider: "groq", // Ultra-fast sub-second Groq / IA-Mesh fallback
        max_tokens: 3500,
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
        const data = await response.json();
        const rawContent: string = data.response || data.content || "";

        const parsed = repairAndParseJson(rawContent);

        if (parsed) {
        const rawErrors: SpecificErrorItem[] = Array.isArray(parsed.unclearOrErrorWords)
          ? parsed.unclearOrErrorWords.map((item: any, idx: number) => ({
              id: item.id || `err-ai-${idx}-${Date.now()}`,
              errorType: (item.errorType === "GRAMMAR" || item.errorType === "VOCABULARY" || item.errorType === "UNCLEAR_WORD")
                ? item.errorType
                : item.errorType?.toLowerCase().includes("grammar") ? "GRAMMAR"
                : item.errorType?.toLowerCase().includes("vocab") ? "VOCABULARY" : "UNCLEAR_WORD",
              errorWord: item.errorWord || "(Unclear phrase)",
              correctWord: item.correctWord || "(Recommended phrasing)",
              userSaidContext: item.userSaidContext || cleanText.slice(0, 50),
              betterWay: item.betterWay || item.correctWord || "",
              explanation: item.explanation || "Linguistic correction",
              translationSpanish: cleanNoteText(item.translationSpanish || item.explanation || "", item.explanation),
              cefrLevel: item.cefrLevel || "B2",
              savedToMemory: false,
            }))
          : [];

        // 🛡️ Strict Deduplication: Ensure no identical error or phrase appears twice
        const seenErrorKeys = new Set<string>();
        const errors: SpecificErrorItem[] = [];

        for (const err of rawErrors) {
          const key = `${err.errorWord.toLowerCase().trim()}|${err.correctWord.toLowerCase().trim()}`;
          if (!seenErrorKeys.has(key)) {
            seenErrorKeys.add(key);
            errors.push(err);
          }
        }

        // Count grammar & vocabulary errors to enforce mathematical honesty
        const grammarErrorsCount = errors.filter((e) => e.errorType === "GRAMMAR").length;
        const vocabErrorsCount = errors.filter((e) => e.errorType === "VOCABULARY" || e.errorType === "UNCLEAR_WORD").length;

        // Parse initial scores with fallback across various naming keys
        let grammar = Number(parsed.grammarScore ?? parsed.grammar_score ?? parsed.grammar) || 50;
        let vocab = Number(parsed.vocabularyScore ?? parsed.vocabulary_score ?? parsed.vocabScore ?? parsed.vocabulary) || 50;
        let clarity = Number(parsed.clarityScore ?? parsed.clarity_score ?? parsed.clarity) || 50;
        let overall = Number(parsed.overallScore ?? parsed.overall_score ?? parsed.overall) || 50;

        // Normalize 1-5 scale to 0-100 scale if needed
        if (grammar <= 10 && grammarErrorsCount === 0) grammar = Math.min(100, Math.round(grammar * 20));
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
        const strengthsList: string[] = Array.isArray(parsed.keyStrengths) && parsed.keyStrengths.length > 0
          ? parsed.keyStrengths
          : ["Comunicación directa", "Enfoque estructurado"];

        const rawTips: string = parsed.tipsForNextTurn || "";

        let strategicFeedback: StrategicFeedbackItem | null = null;
        if (parsed.strategicFeedback && (parsed.strategicFeedback.explanation || parsed.strategicFeedback.recommendation)) {
          strategicFeedback = {
            type: "STRATEGIC_WARNING",
            title: sanitizeFeedbackTone(parsed.strategicFeedback.title || "Análisis Estratégico de tu Respuesta"),
            explanation: sanitizeFeedbackTone(
              parsed.strategicFeedback.explanation ||
                (strengthsList.length > 0
                  ? `Articulaste bien conceptos clave como ${strengthsList.slice(0, 2).map((s: string) => `'${s}'`).join(' y ')}.`
                  : "Identificamos buenas ideas en tu respuesta para seguir estructurando.")
            ),
            recommendation: sanitizeFeedbackTone(
              parsed.strategicFeedback.recommendation ||
                (rawTips || "Paso a paso: Para tu próxima toma, conecta 2 oraciones simples usando el modelo STAR.")
            ),
          };
        } else if (rawTips) {
          strategicFeedback = {
            type: "STRATEGIC_WARNING",
            title: "Recomendación Estratégica",
            explanation: sanitizeFeedbackTone(
              strengthsList.length > 0
                ? `Destacaste al abordar ${strengthsList.slice(0, 2).map((s: string) => `'${s}'`).join(' y ')} con iniciativa comunicativa.`
                : "Tu respuesta demuestra entendimiento del rol y ganas de transmitir tu experiencia."
            ),
            recommendation: sanitizeFeedbackTone(rawTips),
          };
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
          improvedFullAnswer: parsed.improvedFullAnswer || UniversalLinguisticParser.parse(cleanText, currentQuestion).improvedFullAnswer,
          unclearOrErrorWords: sanitizedErrors,
          keyStrengths: strengthsList.map((s) => sanitizeFeedbackTone(s)),
          tipsForNextTurn: sanitizeFeedbackTone(rawTips || "¡Gran esfuerzo! Mantén este ritmo y enfócate en conectar tus ideas paso a paso."),
          strategicFeedback,
        };
      }
    }
  } catch (err) {
    console.warn(`[CoreAiEvaluator] IA-Mesh call error or timeout:`, err);
  }

    // High-fidelity local fallback if remote provider fails or times out
    console.warn("[CoreAiEvaluator] Falling back to UniversalLinguisticParser.");
    return UniversalLinguisticParser.parse(cleanText, currentQuestion);
  }
}
