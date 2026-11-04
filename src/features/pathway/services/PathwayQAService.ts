import { PathwayNode } from "../../../domain/entities/LearningPathway";
import { SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";
import { directClientAiService } from "../../settings/services/directClientAiService";

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
}

export interface AskProfessorParams {
  question: string;
  node: PathwayNode;
  profession?: string;
  cefrLevel?: string;
}

function buildProceduralAnswer(params: AskProfessorParams): ProfessorAnswer {
  const { question, node } = params;
  const lesson = node.lessonPayload;
  const firstEx = lesson?.examples[0];
  const exampleEnglish = firstEx?.english || lesson?.voicePractice.sentenceEnglish || "I understand the concept.";
  const exampleSpanish = firstEx?.spanish || lesson?.voicePractice.spanishMeaning || "Entiendo el concepto.";
  const pronunciationTip = firstEx?.pronunciationHint || "Pronuncia con ritmo continuo sin pausar entre palabras.";

  const directAnswer = `Sobre tu duda: en ${node.title}, la regla central es ${lesson?.ruleTaglineSpanish || node.blueprint.nativeIntuitionRule}.`;
  const mentalModel = `En español solemos traducir directamente, pero ${lesson?.commonMistake.whySpanish || node.blueprint.l1InterferenceTrap}. En inglés pensamos en bloques fijos donde el sujeto y el verbo siempre van explícitos.`;

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
  };
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

CRITICAL PEDAGOGICAL CONTRACT:
Answer the student's question directly, clearly and warmly in Spanish. Follow strictly this 3-Layer structure:
1. directAnswer: Clear, crystal-cut answer to the question in 1 or 2 friendly Spanish sentences. No generic filler.
2. mentalModel: Explain WHY English works like this, contrasting with Spanish (L1 interference) so they never make this mistake again.
3. exampleEnglish: A natural, native English sentence showing the solution in real life.
4. exampleSpanish: Exact natural Spanish meaning of that sentence.
5. pronunciationTip: Short phonetic hint on how to sound natural saying that English sentence.

Return ONLY a valid JSON object matching this schema:
{
  "directAnswer": "string in Spanish",
  "mentalModel": "string in Spanish",
  "exampleEnglish": "string in English",
  "exampleSpanish": "string in Spanish",
  "pronunciationTip": "string in Spanish"
}`;

    const userPrompt = `Student question: "${trimmedQuestion}"
Explain clearly why English works this way and give me the best intuitive mental model.`;

    try {
      const raw = await directClientAiService.chatCompletion({
        systemPrompt,
        userPrompt,
        maxTokens: 500,
      });

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.directAnswer === "string" && typeof parsed.exampleEnglish === "string") {
        const directAnswer = parsed.directAnswer.trim();
        const mentalModel = (parsed.mentalModel || "").trim();
        const exampleEnglish = parsed.exampleEnglish.trim();
        const exampleSpanish = (parsed.exampleSpanish || "").trim();
        const pronunciationTip = (parsed.pronunciationTip || "").trim();

        const fullSpeechText = `${directAnswer} ${mentalModel} Por ejemplo: ${exampleEnglish}. Significa: ${exampleSpanish}. ${pronunciationTip}`;
        const speechSegments: QASpeechSegment[] = [
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
        };
      }
    } catch {
      // Fallback seamlessly to procedural answer on network / AI unavailability
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

