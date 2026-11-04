import { PathwayNode, PathwayStepId, resolveFormulaCases } from "../../../domain/entities/LearningPathway";
import { SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";

export type LiveClassBeatId =
  | "ORIENTATION"
  | "FORMULA"
  | "TRAP"
  | "TRAP_CHECK"
  | "EXAMPLES";

export interface LectureSegment {
  language: "es" | "en";
  text: string;
  badgeLabel: string;
  beat?: LiveClassBeatId | undefined;
  subtitleSpanish?: string | undefined;
  activeFormulaCaseIndex?: number | undefined;
  activeExampleIndex?: number | undefined;
  pauseAfterForCheck?: boolean | undefined;
  targetStep?: PathwayStepId | undefined;
}

export interface PlayLectureOptions {
  script?: PathwayLectureScript | undefined;
  startFromIndex?: number | undefined;
  onPauseForCheck?: ((beat: LiveClassBeatId, resumeIndex: number) => void) | undefined;
}

export interface PathwayLectureScript {
  headline: string;
  fullOverviewSpanish: string;
  segments: LectureSegment[];
}

export const SOFTWARE_GUIDE_ORIENTATION_TEXT =
  "¡Hola! Qué gusto saludarte. Soy Liam, tu mentor personal en CELAEST. Te voy a acompañar en cada paso para que hables inglés con total seguridad. Mira tu pantalla: a la izquierda tienes tu pizarra de clase con la regla visual, el ensamblaje de bloques y la certificación de tu voz. Arriba en tu cabecera tienes una ayuda clave: la Guía de Estudio. Ábrela en cualquier momento para consultar la Estructura de los 14 Bloques de inglés y el Alfabeto Fonético completo con audios reales. Y aquí a tu derecha estaré siempre a tu lado para resolver tus dudas con el botón Preguntar. Esta orientación te la comparto solo esta vez para que conozcas tus herramientas. ¡Entremos directo a la clase!";

export const MOBILE_SOFTWARE_GUIDE_ORIENTATION_TEXT =
  "¡Hola! Qué gusto saludarte. Soy Liam, tu mentor personal en CELAEST. Te voy a acompañar cara a cara en cada paso para que hables inglés con total seguridad. Aquí debajo de mí tienes tu tarjeta interactiva con la regla visual, el armado de fichas y el reto de voz, todo sin salir de esta pantalla. Arriba tienes la Guía de Estudio: ábrela cuando quieras para consultar los 14 Bloques de inglés y el Alfabeto Fonético con audios reales. Y aquí mismo tienes Preguntar para resolver cualquier duda. ¡Entremos directo a la clase!";

function isMobileClassroomViewport(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.innerWidth === "number" && window.innerWidth > 0 && window.innerWidth < 1024;
}

export function getSoftwareGuideOrientationText(isMobile = isMobileClassroomViewport()): string {
  return isMobile ? MOBILE_SOFTWARE_GUIDE_ORIENTATION_TEXT : SOFTWARE_GUIDE_ORIENTATION_TEXT;
}

const SOFTWARE_INTRO_KEY = "celaest:tutor:software_explained:v2";

export class PathwayLectureEngine {
  private static activeSessionId = 0;

  public static isSoftwareIntroSeen(): boolean {
    try {
      if (typeof window === "undefined") return false;
      return localStorage.getItem(SOFTWARE_INTRO_KEY) === "1";
    } catch {
      return false;
    }
  }

  public static markSoftwareIntroSeen(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(SOFTWARE_INTRO_KEY, "1");
      }
    } catch {
      // ignore
    }
  }

  public static buildLectureScript(node: PathwayNode): PathwayLectureScript {
    const lesson = node.lessonPayload;
    if (!lesson) {
      return {
        headline: node.title,
        fullOverviewSpanish: node.blueprint.objectiveSpanish,
        segments: [
          {
            language: "es",
            text: `Bienvenido a ${node.title}. En esta sesión aprenderás a ${node.blueprint.objectiveSpanish.toLowerCase()}.`,
            badgeLabel: "INTRODUCCIÓN",
          },
        ],
      };
    }

    const firstExample = lesson.examples[0];
    const secondExample = lesson.examples[1];
    const rawEnglishSample = firstExample?.english || lesson.voicePractice.sentenceEnglish;
    const cleanSample = rawEnglishSample.replace(/[.!?]+$/, "").trim();
    const rawPhonetic = firstExample?.pronunciationHint || "";
    const cleanPhonetic = rawPhonetic
      ? `El truco de pronunciación es ${rawPhonetic.replace(/^[«"']|[»"']$/g, "").trim()}.`
      : "Une el sujeto con el verbo en un solo golpe de voz, sin pausar en el medio.";

    const segments: LectureSegment[] = [];

    const isMobile = isMobileClassroomViewport();
    const surfaceRef = isMobile ? "aquí debajo en tu tarjeta" : "en tu pizarra";
    const hasSeenSoftware = this.isSoftwareIntroSeen();
    if (!hasSeenSoftware) {
      segments.push({
        language: "es",
        text: getSoftwareGuideOrientationText(isMobile),
        subtitleSpanish: "Tu pizarra viva sincronizada, retos en mitad de clase y Guía de Estudio arriba.",
        badgeLabel: "1. BIENVENIDA & GUÍA DE ESTUDIO",
        beat: "ORIENTATION",
        targetStep: "RULE",
      });
      this.markSoftwareIntroSeen();
    }

    const cleanWrong = (lesson.commonMistake.wrong || "").replace(/[.!?«»"']/g, "").trim();
    const cleanCorrect = (lesson.commonMistake.correct || "").replace(/[.!?«»"']/g, "").trim();
    const topicTitle = node.title.replace(/[«»"']/g, "").trim();
    const objective = node.blueprint?.objectiveSpanish
      ? node.blueprint.objectiveSpanish.replace(/[«»"']/g, "").trim()
      : lesson.ruleTaglineSpanish.replace(/[«»"']/g, "").trim();

    const formulaCases = resolveFormulaCases(lesson);
    const trapWhy = (lesson.commonMistake.whySpanish || node.blueprint.l1InterferenceTrap).replace(/[«»"']/g, "").trim();
    const anchorRule = (node.blueprint.nativeIntuitionRule || lesson.ruleTaglineSpanish).replace(/[«»"']/g, "").trim();

    if (formulaCases.length <= 1) {
      const singleCase = formulaCases[0]!;
      const formulaLabels = singleCase.segments
        .map((s) => s.label.replace(/^\d+\.\s*/, "").toLowerCase())
        .join(", luego ");
      segments.push({
        language: "es",
        text: `El reto de esta base es ${topicTitle}. ${objective}. Mira cómo se ilumina la fórmula pieza por pieza ${surfaceRef}: primero ${formulaLabels}.`,
        subtitleSpanish: singleCase.explanationSpanish,
        badgeLabel: hasSeenSoftware ? "1. PROPÓSITO REAL" : "2. PROPÓSITO REAL",
        beat: "FORMULA",
        activeFormulaCaseIndex: 0,
        targetStep: "RULE",
      });
    } else {
      formulaCases.forEach((fCase, idx) => {
        const cleanCaseLabel = fCase.label.replace(/^\d+\s*·\s*/, "");
        const sampleClause = fCase.exampleEnglish
          ? ` Ejemplo: "${fCase.exampleEnglish.replace(/[.]+$/, "")}".`
          : "";
        const text =
          idx === 0
            ? `Hoy veremos ${topicTitle} paso a paso en ${formulaCases.length} usos claros. Uso 1, ${cleanCaseLabel}: ${fCase.explanationSpanish}${sampleClause}`
            : `Ahora pasemos al uso ${idx + 1}, ${cleanCaseLabel}: ${fCase.explanationSpanish}${sampleClause}`;
        segments.push({
          language: "es",
          text,
          subtitleSpanish: fCase.explanationSpanish,
          badgeLabel: `FÓRMULA · USO ${idx + 1} DE ${formulaCases.length}`,
          beat: "FORMULA",
          activeFormulaCaseIndex: idx,
          targetStep: "RULE",
        });
      });
    }

    segments.push(
      {
        language: "es",
        text: `Fíjate bien en la alerta en rojo ${surfaceRef}. ${trapWhy} Por eso tachamos "${cleanWrong}" y decimos "${cleanCorrect}". Tu ancla mental: ${anchorRule}.`,
        subtitleSpanish: trapWhy,
        badgeLabel: hasSeenSoftware ? "2. LA TRAMPA DEL ESPAÑOL" : "3. LA TRAMPA DEL ESPAÑOL",
        beat: "TRAP",
        targetStep: "RULE",
      },
      {
        language: "es",
        text: `¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.`,
        subtitleSpanish: "Toca la frase natural en inglés para continuar la clase en vivo.",
        badgeLabel: hasSeenSoftware ? "3. CAZA LA TRAMPA" : "4. CAZA LA TRAMPA",
        beat: "TRAP_CHECK",
        pauseAfterForCheck: true,
        targetStep: "RULE",
      },
      {
        language: "en",
        text: rawEnglishSample,
        subtitleSpanish: firstExample?.spanish || lesson.voicePractice.spanishMeaning,
        badgeLabel: hasSeenSoftware ? "4. MODELO NATIVO" : "5. MODELO NATIVO",
        beat: "EXAMPLES",
        activeExampleIndex: 0,
        targetStep: "RULE",
      },
      {
        language: "es",
        text: `Escucha con atención cómo se unen las palabras al decir "${cleanSample}". ${cleanPhonetic}`,
        subtitleSpanish: cleanPhonetic,
        badgeLabel: hasSeenSoftware ? "5. SECRETO FONÉTICO" : "6. SECRETO FONÉTICO",
        beat: "EXAMPLES",
        activeExampleIndex: 0,
        targetStep: "RULE",
      },
    );

    if (secondExample?.english) {
      segments.push({
        language: "en",
        text: secondExample.english,
        subtitleSpanish: secondExample.spanish,
        badgeLabel: hasSeenSoftware ? "6. EJEMPLO APLICADO" : "7. EJEMPLO APLICADO",
        beat: "EXAMPLES",
        activeExampleIndex: 1,
        targetStep: "RULE",
      });
    }

    segments.push({
      language: "es",
      text: `Si te surge cualquier duda, toca "Preguntar" abajo. Ahora constrúyela tú: abro las fichas ${surfaceRef} para activar tu memoria motriz. ¡Adelante!`,
      subtitleSpanish: "Arma la oración en orden natural para pasar al reto de voz.",
      badgeLabel: "ACTIVACIÓN EN PANTALLA",
      targetStep: "BUILD",
    });

    const fullOverviewSpanish = segments.map((s) => s.text).join(" ");

    return {
      headline: `Mentoría · ${node.title}`,
      fullOverviewSpanish,
      segments,
    };
  }

  public static async playLecture(
    node: PathwayNode,
    onProgress: (segmentIndex: number, currentSegment: LectureSegment) => void,
    onEnd: () => void,
    spanishVoice: string = "liam",
    onStepTrigger?: (step: PathwayStepId) => void,
    onAutoplayBlocked?: () => void,
    options?: PlayLectureOptions,
  ): Promise<() => void> {
    this.activeSessionId++;
    const currentSessionId = this.activeSessionId;

    const script = options?.script ?? this.buildLectureScript(node);
    const startIdx = Math.max(0, Math.min(options?.startFromIndex ?? 0, script.segments.length));
    let isCancelled = false;

    if (startIdx < script.segments.length) {
      const firstSeg = script.segments[startIdx]!;
      const firstVoice = firstSeg.language === "en" ? "liam" : spanishVoice;
      void SpeechSynthesisService.prefetch(firstSeg.text, firstVoice);
    }

    const stop = () => {
      isCancelled = true;
      SpeechSynthesisService.stop();
      onEnd();
    };

    const run = async () => {
      for (let i = startIdx; i < script.segments.length; i++) {
        if (isCancelled || this.activeSessionId !== currentSessionId) break;

        const segment = script.segments[i]!;
        if (segment.targetStep && onStepTrigger) {
          onStepTrigger(segment.targetStep);
        }
        onProgress(i, segment);

        // Prioritized lookahead: prefetch strictly the NEXT segment in background while current segment speaks
        if (i + 1 < script.segments.length) {
          const nextSeg = script.segments[i + 1]!;
          const nextVoice = nextSeg.language === "en" ? "liam" : spanishVoice;
          void SpeechSynthesisService.prefetch(nextSeg.text, nextVoice);
        }

        await new Promise<void>((resolve) => {
          if (isCancelled || this.activeSessionId !== currentSessionId) {
            resolve();
            return;
          }

          const completeSegment = () => {
            resolve();
          };

          const handlePlayError = (err: any) => {
            const isAutoplay =
              err?.name === "NotAllowedError" ||
              String(err?.message || "").toLowerCase().includes("user didn't interact") ||
              String(err || "").includes("NotAllowedError");
            if (isAutoplay) {
              isCancelled = true;
              SpeechSynthesisService.stop();
              if (onAutoplayBlocked) {
                onAutoplayBlocked();
              } else {
                onEnd();
              }
              resolve();
              return;
            }
            completeSegment();
          };

          if (segment.language === "en") {
            void SpeechSynthesisService.speak(segment.text, {
              lang: "en",
              voice: "liam",
              rate: 0.95,
              preventSyntheticFallback: true,
              onEnd: completeSegment,
              onError: handlePlayError,
            });
          } else {
            void SpeechSynthesisService.speak(segment.text, {
              lang: "es",
              voice: spanishVoice,
              rate: 0.96,
              preventSyntheticFallback: true,
              onEnd: completeSegment,
              onError: handlePlayError,
            });
          }
        });

        if (
          !isCancelled &&
          this.activeSessionId === currentSessionId &&
          segment.pauseAfterForCheck &&
          options?.onPauseForCheck
        ) {
          options.onPauseForCheck(segment.beat || "TRAP_CHECK", i + 1);
          return;
        }

        // Crisp, natural human breath pause between concepts (180ms)
        if (!isCancelled && this.activeSessionId === currentSessionId && i < script.segments.length - 1) {
          await new Promise((res) => setTimeout(res, 180));
        }
      }

      if (!isCancelled && this.activeSessionId === currentSessionId) {
        onEnd();
      }
    };

    void run();

    return stop;
  }

  public static stopLecture(): void {
    this.activeSessionId++;
    SpeechSynthesisService.stop();
  }
}
