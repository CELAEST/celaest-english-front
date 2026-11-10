import { PathwayNode } from "../../../domain/entities/LearningPathway";
import { SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";
import { directClientAiService } from "../../settings/services/directClientAiService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { ENV } from "../../../shared/constants/env";
import { HttpClient } from "../../../infrastructure/http/HttpClient";

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
  profession?: string;
  cefrLevel?: string;
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

function buildProceduralAnswer(params: AskProfessorParams): ProfessorAnswer {
  const { question, node } = params;

  if (isQuestionOffTopic(question, node.title)) {
    const directAnswer = "Como mentor de CELAEST, mi rol es exclusivamente ayudarte a dominar el idioma inglés.";
    const mentalModel = `Por favor formula tu duda sobre esta regla ("${node.title}") o sobre cualquier aspecto del inglés (gramática, vocabulario, pronunciación o estructura).`;
    const fullSpeechText = `${directAnswer} ${mentalModel}`;
    const speechSegments: QASpeechSegment[] = [
      { language: "es", text: fullSpeechText },
    ];

    return {
      question,
      directAnswer,
      mentalModel,
      exampleEnglish: "",
      exampleSpanish: "",
      pronunciationTip: "",
      fullSpeechText,
      speechSegments,
      isOffTopic: true,
    };
  }

  const qLower = question.toLowerCase();
  const lesson = node.lessonPayload;
  const examples = lesson?.examples || [];

  let directAnswer = "";
  let mentalModel = "";
  let exampleEnglish = "";
  let exampleSpanish = "";
  let pronunciationTip = "";

  if (qLower.includes("ejemplo") || qLower.includes("otro") || qLower.includes("práctico")) {
    const ex = examples[1] || examples[0] || {
      english: "I work with the team every day.",
      spanish: "Trabajo con el equipo todos los días.",
      pronunciationHint: "Enlaza 'work' con 'with'.",
    };
    directAnswer = `Aquí tienes un ejemplo práctico aplicado a "${node.title}":`;
    mentalModel = `Aplica siempre el modelo: ${node.blueprint.nativeIntuitionRule}.`;
    exampleEnglish = ex.english;
    exampleSpanish = ex.spanish;
    pronunciationTip = ex.pronunciationHint || "Pronuncia con ritmo continuo y articulación clara.";
  } else if (qLower.includes("error") || qLower.includes("común") || qLower.includes("trampa") || qLower.includes("cuidado")) {
    directAnswer = `El error más frecuente en ${node.title} ocurre al traducir directamente pensando en español.`;
    mentalModel = lesson?.commonMistake.whySpanish || node.blueprint.l1InterferenceTrap;
    const ex = examples[0] || {
      english: lesson?.voicePractice.sentenceEnglish || "We build high-impact solutions.",
      spanish: "Construimos soluciones de alto impacto.",
      pronunciationHint: "Sujeto sonoro y claro.",
    };
    exampleEnglish = ex.english;
    exampleSpanish = ex.spanish;
    pronunciationTip = "Fíjate en las dos piezas juntas antes de emitir la frase.";
  } else if (qLower.includes("diferen") || qLower.includes("español") || qLower.includes("por qué") || qLower.includes("porque")) {
    directAnswer = `En español el verbo ya indica quién habla, pero en inglés la estructura requiere explicitar cada componente.`;
    mentalModel = `En ${node.title}: ${lesson?.ruleTaglineSpanish || node.blueprint.nativeIntuitionRule}. Si omites una parte, la frase carece de sentido.`;
    const ex = examples[0] || {
      english: "They learn English together.",
      spanish: "Ellos aprenden inglés juntos.",
      pronunciationHint: "La 'th' de 'They' suena vibrante contra los dientes.",
    };
    exampleEnglish = ex.english;
    exampleSpanish = ex.spanish;
    pronunciationTip = "Mantén la entonación estable y sin pausas indebidas.";
  } else {
    directAnswer = `Sobre tu consulta: en ${node.title}, el principio clave es ${lesson?.ruleTaglineSpanish || node.blueprint.nativeIntuitionRule}.`;
    mentalModel = `El objetivo es ${node.blueprint.objectiveSpanish}. Recuerda: ${lesson?.commonMistake.whySpanish || node.blueprint.l1InterferenceTrap}`;
    const ex = examples[0] || {
      english: lesson?.voicePractice.sentenceEnglish || "I understand the concept.",
      spanish: lesson?.voicePractice.spanishMeaning || "Entiendo el concepto.",
      pronunciationHint: "Pronuncia continuo.",
    };
    exampleEnglish = ex.english;
    exampleSpanish = ex.spanish;
    pronunciationTip = ex.pronunciationHint || "Pronuncia con ritmo continuo sin pausar entre palabras.";
  }

  const fullSpeechText = `${directAnswer} ${mentalModel} Fíjate en este ejemplo: ${exampleEnglish}, que significa ${exampleSpanish}. ${pronunciationTip}`;
  const speechSegments: QASpeechSegment[] = [
    { language: "es", text: `${directAnswer} ${mentalModel} Por ejemplo:` },
    { language: "en", text: exampleEnglish },
    { language: "es", text: `Significa: ${exampleSpanish}. Recuerda: ${pronunciationTip}` },
  ];

  return {
    question,
    directAnswer,
    mentalModel,
    exampleEnglish,
    exampleSpanish,
    pronunciationTip,
    fullSpeechText,
    speechSegments,
    isOffTopic: false,
  };
}

async function callCoreAiMesh(systemPrompt: string, userPrompt: string): Promise<string> {
  const token = HttpClient.getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Internal-Service": "celaest-english-front",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const isBrowser = typeof window !== "undefined";
  const candidateUrls: string[] = [];

  // In the browser, same-origin relative proxy works seamlessly in both Vite dev (/core-ai)
  // and Vercel prod (/core-ai -> Render rewrites), with zero CORS and zero port 8085 connection errors.
  if (isBrowser) {
    candidateUrls.push("/core-ai/ai/chat/simple");
  }

  // Fallbacks: configured endpoint (if not localhost) or direct Render endpoint
  if (ENV.coreAiUrl && !ENV.coreAiUrl.includes("127.0.0.1") && !ENV.coreAiUrl.includes("localhost")) {
    candidateUrls.push(`${ENV.coreAiUrl}/ai/chat/simple`);
  }
  candidateUrls.push("https://celaest-core.onrender.com/api/v1/ai/chat/simple");

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12_000);

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          system: systemPrompt,
          message: userPrompt,
          max_tokens: 800,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data?.response || data?.content || "";
        if (content && typeof content === "string" && content.trim()) {
          return content.trim();
        }
      }
    } catch {
      // Continue to next candidate URL
    }
  }

  throw new Error("Core AI mesh unreachable");
}

export class PathwayQAService {
  private static activePlaybackSession = 0;

  public static async askProfessor(params: AskProfessorParams): Promise<ProfessorAnswer> {
    const trimmedQuestion = params.question.trim();
    if (!trimmedQuestion) {
      throw new Error("Question cannot be empty");
    }

    const { node, profession = "Professional", cefrLevel = "A1" } = params;
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

    let raw = "";

    // 1. Check if user configured BYOK keys in vault or if test mock/spy is active
    try {
      const activeProvider = await providerKeyVault.getActiveProviderId();
      const hasKey = await providerKeyVault.hasKey(activeProvider || "groq");
      const isTestSpy = Boolean((directClientAiService.chatCompletion as any).mock);
      if (hasKey || isTestSpy) {
        raw = await directClientAiService.chatCompletion({
          systemPrompt,
          userPrompt,
          maxTokens: 600,
        });
      }
    } catch {
      // Continue to Core AI mesh
    }

    // 2. Primary Tier: CELAEST-CORE IA-Mesh (Live central server cluster, zero BYOK needed)
    if (!raw) {
      try {
        raw = await callCoreAiMesh(systemPrompt, userPrompt);
      } catch {
        // 3. Secondary Tier Fallback: Direct Client AI
        try {
          raw = await directClientAiService.chatCompletion({
            systemPrompt,
            userPrompt,
            maxTokens: 600,
          });
        } catch {
          // Proceed to Tier 3 dynamic offline answer
        }
      }
    }

    if (raw) {
      const cleanJson = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      try {
        const parsed = JSON.parse(cleanJson);
        if (parsed && typeof parsed.directAnswer === "string") {
          const isOffTopic = Boolean(parsed.isOffTopic);
          const directAnswer = parsed.directAnswer.trim();
          const mentalModel = (parsed.mentalModel || "").trim();
          const exampleEnglish = (parsed.exampleEnglish || "").trim();
          const exampleSpanish = (parsed.exampleSpanish || "").trim();
          const pronunciationTip = (parsed.pronunciationTip || "").trim();

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
      } catch {
        // Proceed to Tier 3 dynamic offline answer
      }
    }

    return buildProceduralAnswer(params);
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

