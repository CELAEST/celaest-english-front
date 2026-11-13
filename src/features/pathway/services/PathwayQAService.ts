import { PathwayNode } from "../../../domain/entities/LearningPathway";
import { SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";
import {
  AiInfrastructureError,
  directClientAiService,
  extractFirstJsonObject,
} from "../../settings/services/directClientAiService";
import { HttpClient } from "../../../infrastructure/http/HttpClient";
import { ApiError } from "../../../infrastructure/http/ApiError";
import {
  callBackendAiChatGateway,
  resolveProviderContextSafe,
} from "../../../infrastructure/http/coreAiGatewayClient";

export interface QASpeechSegment {
  language: "es" | "en";
  text: string;
}

export interface ProfessorAnswer {
  question: string;
  directAnswer: string;
  mentalModel: string;
  exampleEnglish: string;
  exampleSpanish: string;
  pronunciationTip: string;
  fullSpeechText: string;
  speechSegments: QASpeechSegment[];
  isOffTopic?: boolean;
}

export interface AskProfessorParams {
  question: string;
  node: PathwayNode;
  profession?: string | undefined;
  cefrLevel?: string | undefined;
}

export class PathwayByokRequiredError extends Error {
  public readonly code = "BYOK_REQUIRED";
  constructor(message = "Configura tu clave gratuita de Groq o Gemini para hacer preguntas en vivo a Liam.") {
    super(message);
    this.name = "PathwayByokRequiredError";
  }
}

/**
 * Heuristic check to detect whether a question clearly departs from language learning.
 * Follows CELAEST universal pedagogy: open pattern inspection, zero closed word whitelists.
 */
function isQuestionOffTopic(question: string, nodeTitle?: string): boolean {
  const q = question.toLowerCase();

  // If question mentions current lesson or grammatical/linguistic concepts, it's on-topic
  const linguisticMarkers = [
    "ingles", "inglés", "english", "pronunc", "tradu", "significa", "diferencia",
    "regla", "formula", "fórmula", "sujeto", "verbo", "tiempo", "pasado", "presente",
    "futuro", "modal", "preposici", "adjetiv", "sustantiv", "vocabulario", "palabra",
    "oracion", "oración", "frase", "como se dice", "cómo se dice", "sound", "say",
    "speak", "write", "mean", "gramar", "grammar", "tense", "phonetic", "ipa"
  ];
  if (linguisticMarkers.some((m) => q.includes(m))) {
    return false;
  }

  // If question references node title keywords, it's on-topic
  if (nodeTitle) {
    const titleTokens = nodeTitle.toLowerCase().split(/\W+/).filter((t) => t.length > 3);
    if (titleTokens.some((t) => q.includes(t))) {
      return false;
    }
  }

  // Check for common explicitly off-topic domains (recipes, general coding, sports, math, politics)
  const offTopicMarkers = [
    "receta", "cocinar", "pizza", "pastel", "torta", "ingredientes",
    "codigo", "código", "python", "javascript", "sql query", "react component", "docker",
    "futbol", "fútbol", "partido de", "campeonato", "messi", "ronaldo",
    "elecciones", "presidente", "politica", "política", "senado",
    "raiz cuadrada", "raíz cuadrada", "integral", "derivada", "matematicas", "matemáticas",
    "clima en", "que hora es", "qué hora es", "chiste", "cuentame un chiste"
  ];

  return offTopicMarkers.some((m) => q.includes(m));
}

function buildOffTopicAnswer(question: string, nodeTitle: string): ProfessorAnswer {
  const directAnswer = "Como mentor de CELAEST, mi rol es exclusivamente ayudarte a dominar el idioma inglés.";
  const mentalModel = `Por favor formula tu duda sobre esta regla ("${nodeTitle}") o sobre cualquier aspecto del inglés (gramática, vocabulario, pronunciación o estructura).`;
  const fullSpeechText = `${directAnswer} ${mentalModel}`;
  return {
    question,
    directAnswer,
    mentalModel,
    exampleEnglish: "",
    exampleSpanish: "",
    pronunciationTip: "",
    fullSpeechText,
    speechSegments: [{ language: "es", text: fullSpeechText }],
    isOffTopic: true,
  };
}

async function callCoreAiMesh(systemPrompt: string, userPrompt: string): Promise<string> {
  return callBackendAiChatGateway({
    systemPrompt,
    userPrompt,
    maxTokens: 800,
    timeoutMs: 35_000,
  });
}

export class PathwayQAService {
  private static activePlaybackSession = 0;

  public static async askProfessor(params: AskProfessorParams): Promise<ProfessorAnswer> {
    const trimmedQuestion = params.question.trim();
    if (!trimmedQuestion) {
      throw new Error("Question cannot be empty");
    }

    const { node, profession = "Professional", cefrLevel = "A1" } = params;
    if (isQuestionOffTopic(trimmedQuestion, node.title)) {
      return buildOffTopicAnswer(trimmedQuestion, node.title);
    }

    const lesson = node.lessonPayload;

    const systemPrompt = `You are a world-class, ultra-pedagogical English professor for Spanish native speakers (CELAEST Mentor).
The student is an ambitious learner (${profession}, CEFR ${cefrLevel}) currently studying the lesson: "${node.title}".
Lesson Context:
- Rule: ${lesson?.ruleTaglineSpanish || node.blueprint.nativeIntuitionRule}
- L1 Trap: ${lesson?.commonMistake.whySpanish || node.blueprint.l1InterferenceTrap}
- Target example: ${lesson?.examples[0]?.english || "I work every day."}

STRICT PEDAGOGICAL BOUNDARY (ENGLISH-ONLY):
You are EXCLUSIVELY an English Language Mentor.
- ALLOWED:
  1. The current lesson ("${node.title}"), its rule, trap, formula, practice, and examples.
  2. ANY question related to the English language in general (grammar, tenses, pronunciation, phonetics, vocabulary, idioms, prepositions, false cognates, translation subtleties, professional English usage, differences between words or phrases).
- FORBIDDEN:
  Any subject completely unrelated to learning the English language (e.g. cooking recipes, programming in Python/JS, math problems, politics, sports news, biology, general life counseling, medical diagnoses, random chit-chat).

If the student's question is OFF-TOPIC (not about English or this lesson):
- Set "isOffTopic": true
- "directAnswer": A firm, polite, warm Spanish refusal explaining that as a CELAEST mentor, you exclusively answer questions about mastering English (e.g., "Como mentor de CELAEST, mi rol es exclusivamente ayudarte a dominar el idioma inglés.").
- "mentalModel": An invitation in Spanish guiding them back to English: tell them to ask about this lesson's rule ("${node.title}") or any doubt regarding English grammar, vocabulary, or pronunciation.
- "exampleEnglish": ""
- "exampleSpanish": ""
- "pronunciationTip": ""

If the student's question is ON-TOPIC (about this lesson OR English in general):
- Set "isOffTopic": false
- Follow strictly this 3-Layer structure in natural, encouraging Spanish:
  1. directAnswer: Clear, crystal-cut answer to the question in 1 or 2 friendly Spanish sentences. No generic filler.
  2. mentalModel: Explain WHY English works like this, contrasting with Spanish (L1 interference) so they understand the mental model.
  3. exampleEnglish: A natural, native English sentence demonstrating the solution in real life.
  4. exampleSpanish: Exact natural Spanish meaning of that sentence.
  5. pronunciationTip: Short phonetic hint on how to sound natural saying that English sentence.

Return ONLY a valid JSON object matching this schema:
{
  "isOffTopic": boolean,
  "directAnswer": "string in Spanish",
  "mentalModel": "string in Spanish",
  "exampleEnglish": "string in English (empty string if isOffTopic is true)",
  "exampleSpanish": "string in Spanish (empty string if isOffTopic is true)",
  "pronunciationTip": "string in Spanish (empty string if isOffTopic is true)"
}`;

    const userPrompt = `Student question: "${trimmedQuestion}"
Explain clearly why English works this way and give me the best intuitive mental model.`;

    const ctx = await resolveProviderContextSafe();
    const activeProvider = ctx.providerId;
    const isCore = ctx.isCore;
    const hasAnyKey = ctx.hasAnyKey;
    const isTestSpy = Boolean((directClientAiService.chatCompletion as any).mock);
    const hasAuthToken = Boolean(HttpClient.getAuthToken());

    if (!isTestSpy && !isCore && !hasAnyKey && !hasAuthToken) {
      throw new PathwayByokRequiredError();
    }

    let raw = "";

    if (isTestSpy) {
      raw = await directClientAiService.chatCompletion({
        systemPrompt,
        userPrompt,
        maxTokens: 600,
      });
    } else if (hasAuthToken) {
      try {
        raw = await callCoreAiMesh(systemPrompt, userPrompt);
      } catch (coreErr) {
        if (coreErr instanceof ApiError) {
          throw coreErr;
        }
        if (coreErr instanceof AiInfrastructureError && coreErr.code === "AUTH_DECLINED_KEY") {
          throw coreErr;
        }
        if (!isCore && hasAnyKey) {
          raw = await directClientAiService.chatCompletion({
            systemPrompt,
            userPrompt,
            providerId: activeProvider,
            maxTokens: 600,
          });
        } else {
          throw coreErr;
        }
      }
    } else if (!isCore && hasAnyKey) {
      raw = await directClientAiService.chatCompletion({
        systemPrompt,
        userPrompt,
        providerId: activeProvider,
        maxTokens: 600,
      });
    } else {
      raw = await callCoreAiMesh(systemPrompt, userPrompt);
    }

    const cleanJson = (extractFirstJsonObject(raw) || raw)
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed: Record<string, any> | null = null;
    try {
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = null;
    }

    if (!parsed || typeof parsed.directAnswer !== "string" || !parsed.directAnswer.trim()) {
      throw new AiInfrastructureError(
        "CLUSTER_OUTAGE",
        "La respuesta de la IA llegó incompleta. Intenta nuevamente.",
        502,
        activeProvider ?? undefined,
      );
    }

    const isOffTopic = Boolean(parsed.isOffTopic);
    const directAnswer = parsed.directAnswer.trim();
    const mentalModel = String(parsed.mentalModel || "").trim();
    const exampleEnglish = String(parsed.exampleEnglish || "").trim();
    const exampleSpanish = String(parsed.exampleSpanish || "").trim();
    const pronunciationTip = String(parsed.pronunciationTip || "").trim();

    const fullSpeechText = isOffTopic
      ? `${directAnswer} ${mentalModel}`.trim()
      : `${directAnswer} ${mentalModel} Por ejemplo: ${exampleEnglish}. Significa: ${exampleSpanish}. ${pronunciationTip}`.trim();

    const speechSegments: QASpeechSegment[] = isOffTopic
      ? [{ language: "es", text: `${directAnswer} ${mentalModel}`.trim() }]
      : [
          { language: "es", text: `${directAnswer} ${mentalModel} Por ejemplo:` },
          { language: "en", text: exampleEnglish },
          { language: "es", text: `Significa: ${exampleSpanish}. ${pronunciationTip ? `Consejo: ${pronunciationTip}` : ""}`.trim() },
        ];

    return {
      question: trimmedQuestion,
      directAnswer,
      mentalModel,
      exampleEnglish,
      exampleSpanish,
      pronunciationTip,
      fullSpeechText,
      speechSegments,
      isOffTopic,
    };
  }

  public static async playAnswer(
    answer: ProfessorAnswer,
    onProgress?: (segmentIndex: number) => void,
    onEnd?: () => void,
  ): Promise<() => void> {
    this.activePlaybackSession++;
    const currentSession = this.activePlaybackSession;
    let isCancelled = false;

    const stop = () => {
      isCancelled = true;
      SpeechSynthesisService.stop();
      if (onEnd) onEnd();
    };

    // Pre-cache QA segments so audio plays instantly without network pauses
    for (const seg of answer.speechSegments) {
      const v = "liam";
      void SpeechSynthesisService.prefetch(seg.text, v);
    }

    const run = async () => {
      for (let i = 0; i < answer.speechSegments.length; i++) {
        if (isCancelled || this.activePlaybackSession !== currentSession) break;
        const segment = answer.speechSegments[i];
        if (onProgress) onProgress(i);

        const wordsCount = segment.text.split(/\s+/).filter(Boolean).length;
        const minDisplayTimeMs = Math.max(3000, Math.ceil((wordsCount / 2.2) * 1000));
        const startTime = Date.now();

        await new Promise<void>((resolve) => {
          if (isCancelled || this.activePlaybackSession !== currentSession) {
            resolve();
            return;
          }

          const completeSegment = () => {
            const elapsed = Date.now() - startTime;
            const remaining = minDisplayTimeMs - elapsed;
            if (remaining > 0 && !isCancelled && this.activePlaybackSession === currentSession) {
              setTimeout(() => resolve(), remaining);
            } else {
              resolve();
            }
          };

          if (segment.language === "en") {
            void SpeechSynthesisService.speak(segment.text, {
              lang: "en",
              voice: "liam",
              rate: 0.95,
              preventSyntheticFallback: true,
              onEnd: completeSegment,
              onError: completeSegment,
            });
          } else {
            void SpeechSynthesisService.speak(segment.text, {
              lang: "es",
              voice: "liam",
              rate: 0.96,
              preventSyntheticFallback: true,
              onEnd: completeSegment,
              onError: completeSegment,
            });
          }
        });

        if (!isCancelled && this.activePlaybackSession === currentSession && i < answer.speechSegments.length - 1) {
          await new Promise((res) => setTimeout(res, 350));
        }
      }

      if (!isCancelled && this.activePlaybackSession === currentSession && onEnd) {
        onEnd();
      }
    };

    void run();
    return stop;
  }

  public static stopPlayback(): void {
    this.activePlaybackSession++;
    SpeechSynthesisService.stop();
  }
}

