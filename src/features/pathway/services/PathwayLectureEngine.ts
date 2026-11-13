import { PathwayNode, PathwayStepId, resolveFormulaCases } from "../../../domain/entities/LearningPathway";
import { resolveSpeechProfile } from "../speech/profiles";
import { UNIVERSAL_PHRASES } from "../speech/universalPhrases";
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
  formulaRevealCount?: number | undefined;
  trapPhase?: 0 | 1 | 2 | undefined;
}

export interface BuildLectureScriptOptions {
  cefrLevel?: string | undefined;
  includeReturningWelcome?: boolean | undefined;
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

  public static buildLectureScript(
    node: PathwayNode,
    options?: BuildLectureScriptOptions,
  ): PathwayLectureScript {
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
      const introWelcome = UNIVERSAL_PHRASES.intro_welcome!;
      const introPhilosophy = UNIVERSAL_PHRASES.intro_philosophy!;
      const introMethod = UNIVERSAL_PHRASES.intro_method!;
      segments.push(
        {
          language: "es",
          text: introWelcome.text,
          subtitleSpanish: introWelcome.subtitle,
          badgeLabel: "1. BIENVENIDA & GUÍA DE ESTUDIO",
          beat: "ORIENTATION",
          targetStep: "RULE",
        },
        {
          language: "es",
          text: introPhilosophy.text,
          subtitleSpanish: introPhilosophy.subtitle,
          badgeLabel: "2. MÉTODO NEUROCOGNITIVO",
          beat: "ORIENTATION",
          targetStep: "RULE",
        },
        {
          language: "es",
          text: introMethod.text,
          subtitleSpanish: "Pizarra interactiva, Guía de Estudio arriba (14 bloques + fonética) y botón Preguntar siempre listo.",
          badgeLabel: "3. TU GUÍA DE CLASE",
          beat: "ORIENTATION",
          targetStep: "RULE",
        },
      );
      this.markSoftwareIntroSeen();
    } else if (options?.includeReturningWelcome) {
      const returningPhrase = UNIVERSAL_PHRASES.welcome_returning!;
      segments.push({
        language: "es",
        text: returningPhrase.text,
        subtitleSpanish: returningPhrase.subtitle,
        badgeLabel: "BIENVENIDA · RETOMANDO CLASE",
        beat: "FORMULA",
        formulaRevealCount: 1,
        targetStep: "RULE",
      });
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

    // Bases con guion declarativo aprobado (src/features/pathway/speech/profiles/).
    // Una pista = un idioma. Los textos salen del perfil, no de literales aquí.
    const speechProfile = resolveSpeechProfile(node.orderIndex, topicTitle, options?.cefrLevel);
    if (speechProfile) {
      // BUILD no es un beat de clase: se marca con targetStep. SPEAK lo maneja el hook.
      const LECTURE_BEATS = new Set(["FORMULA", "TRAP", "TRAP_CHECK", "EXAMPLES"]);
      const BADGE_BY_BEAT: Record<string, string> = {
        FORMULA: "FÓRMULA",
        TRAP: "LA TRAMPA DEL ESPAÑOL",
        TRAP_CHECK: "CAZA LA TRAMPA",
        EXAMPLES: "EJEMPLOS",
        BUILD: "ACTIVACIÓN EN PANTALLA",
      };
      for (const m of speechProfile.moments) {
        const isBuild = m.beat === "BUILD";
        if (!isBuild && !LECTURE_BEATS.has(m.beat)) continue;
        const seg: LectureSegment = {
          language: m.language,
          text: m.text,
          badgeLabel: isBuild
            ? "ACTIVACI\u00d3N EN PANTALLA"
            : (m.badgeLabel ?? BADGE_BY_BEAT[m.beat] ?? ""),
          subtitleSpanish: m.subtitle ?? m.canonical ?? m.text,
          targetStep: isBuild ? "BUILD" : "RULE",
        };
        if (!isBuild) seg.beat = m.beat as LiveClassBeatId;
        if (m.cue?.formulaRevealCount !== undefined) seg.formulaRevealCount = m.cue.formulaRevealCount;
        if (m.cue?.activeFormulaCaseIndex !== undefined)
          seg.activeFormulaCaseIndex = m.cue.activeFormulaCaseIndex;
        if (m.cue?.trapPhase !== undefined) seg.trapPhase = m.cue.trapPhase;
        if (m.cue?.activeExampleIndex !== undefined) seg.activeExampleIndex = m.cue.activeExampleIndex;
        if (m.beat === "TRAP_CHECK") seg.pauseAfterForCheck = true;
        segments.push(seg);
      }
      return {
        headline: `Mentoría · ${node.title}`,
        fullOverviewSpanish: segments.map((s) => s.text).join(" "),
        segments,
      };
    }

    // Base 04: Andrew Multilingual Masterclass Protocol (La Trampa de 'Tener' Estados y Edad)
    const isBase04 =
      node.orderIndex === 3 ||
      topicTitle.toLowerCase().includes("trampa de 'tener'") ||
      topicTitle.toLowerCase().includes("trampa de tener");
    if (isBase04) {
      segments.push(
        // VÍA A: Caso 1 (Sensaciones) - Introducción en Español + Modelo Nativo en Inglés Puro
        {
          language: "es",
          text: "El reto de esta base es la trampa de tener... En inglés no tienes hambre ni frío: usas el verbo estar diciendo:",
          subtitleSpanish: "Para sensaciones físicas ('hambre, frío, sed') usamos 'am / is / are', nunca 'have'.",
          badgeLabel: "FÓRMULA · CASO 1 DE 2",
          beat: "FORMULA",
          activeFormulaCaseIndex: 0,
          formulaRevealCount: 1,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "I am hungry now.",
          subtitleSpanish: "I am hungry now. (Tengo hambre ahora)",
          badgeLabel: "MODELO NATIVO",
          beat: "FORMULA",
          activeFormulaCaseIndex: 0,
          formulaRevealCount: 3,
          targetStep: "RULE",
        },
        // VÍA A: Caso 2 (Edad) - Introducción en Español + Modelo Nativo en Inglés Puro
        {
          language: "es",
          text: "Y con la edad pasa exactamente lo mismo: no tienes años, sino que usas el verbo ser... Por ejemplo, para él decimos:",
          subtitleSpanish: "La edad en inglés es parte de quién eres: usamos 'am / is / are', nunca 'have'.",
          badgeLabel: "FÓRMULA · CASO 2 DE 2",
          beat: "FORMULA",
          activeFormulaCaseIndex: 1,
          formulaRevealCount: 1,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "He is 30 years old.",
          subtitleSpanish: "He is 30 years old. (Él tiene 30 años)",
          badgeLabel: "MODELO NATIVO",
          beat: "FORMULA",
          activeFormulaCaseIndex: 1,
          formulaRevealCount: 3,
          targetStep: "RULE",
        },
        // VÍA A: Trampa Desacoplada (Pronunciación Nativa Pura + Sincronización Visual)
        {
          language: "es",
          text: "Fíjate bien en la alerta en rojo de tu pizarra... En español decimos tengo 25 años con el verbo tener... pero en inglés nunca usamos ese verbo para la edad ni para el hambre... Por eso nunca decimos:",
          subtitleSpanish: "En inglés nunca decimos 'I have 25 years'.",
          badgeLabel: "LA TRAMPA DEL ESPAÑOL",
          beat: "TRAP",
          trapPhase: 0,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "I have 25 years.",
          subtitleSpanish: "Error común: I have 25 years (literal del español)",
          badgeLabel: "ERROR COMÚN",
          beat: "TRAP",
          trapPhase: 1,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "Sino que en inglés siempre decimos:",
          subtitleSpanish: "En su lugar decimos:",
          badgeLabel: "LA TRAMPA DEL ESPAÑOL",
          beat: "TRAP",
          trapPhase: 1,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "I am 25 years old.",
          subtitleSpanish: "Forma natural: I am 25 years old.",
          badgeLabel: "FORMA NATURAL",
          beat: "TRAP",
          trapPhase: 2,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "Tu ancla mental para no dudar jamás: la edad y las sensaciones siempre caminan con el verbo tu bi.",
          subtitleSpanish: "La edad y las sensaciones en inglés caminan con 'am/is/are', nunca con 'have'.",
          badgeLabel: "ANCLA MENTAL",
          beat: "TRAP",
          trapPhase: 2,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.",
          subtitleSpanish: "Toca la frase natural en inglés para continuar la clase en vivo.",
          badgeLabel: hasSeenSoftware ? "3. CAZA LA TRAMPA" : "4. CAZA LA TRAMPA",
          beat: "TRAP_CHECK",
          pauseAfterForCheck: true,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "I am hungry and thirsty.",
          subtitleSpanish: "Tengo hambre y sed.",
          badgeLabel: hasSeenSoftware ? "4. MODELO NATIVO" : "5. MODELO NATIVO",
          beat: "EXAMPLES",
          activeExampleIndex: 0,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "Escucha con atención cómo se unen las palabras al decir... I am hungry and thirsty... El secreto de pronunciación es sentir la unión del sujeto con am:... ai am jángri and zérsti.",
          subtitleSpanish: "El secreto de pronunciación es sentir la unión: ai am jángri and zérsti.",
          badgeLabel: hasSeenSoftware ? "5. SECRETO FONÉTICO" : "6. SECRETO FONÉTICO",
          beat: "EXAMPLES",
          activeExampleIndex: 0,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "He is 30 years old.",
          subtitleSpanish: "Él tiene 30 años.",
          badgeLabel: hasSeenSoftware ? "6. EJEMPLO APLICADO" : "7. EJEMPLO APLICADO",
          beat: "EXAMPLES",
          activeExampleIndex: 1,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "Si te surge cualquier duda, toca Preguntar en cualquier momento... Ahora constrúyela tú: voy a abrir las fichas en tu pantalla para activar tu memoria motriz... ¡Adelante, tú puedes!",
          subtitleSpanish: "Arma la oración en orden natural para pasar al reto de voz.",
          badgeLabel: "ACTIVACIÓN EN PANTALLA",
          targetStep: "BUILD",
        },
      );

      return {
        headline: `Mentoría · ${node.title}`,
        fullOverviewSpanish: segments.map((s) => s.text).join(" "),
        segments,
      };
    }

    // Base 05: Andrew Multilingual Masterclass Protocol (Ser o Estar en Negativo & Pregunta)
    const isBase05 =
      node.orderIndex === 4 ||
      topicTitle.toLowerCase().includes("negativo & pregunta") ||
      topicTitle.toLowerCase().includes("negativo y pregunta");
    if (isBase05) {
      segments.push(
        // VÍA A: Caso 1 (01 · Negar (+ not)) - Introducción en Español + Modelo Nativo en Inglés Puro
        {
          language: "es",
          text: "El reto de esta base es dominar negativos y preguntas... Para decir que alguien no está o no es algo, simplemente agregamos la palabra not después del verbo tu bi... Por ejemplo, para él decimos:",
          subtitleSpanish: "Para negar agregamos 'not' después del verbo To Be: He isn't busy right now.",
          badgeLabel: "FÓRMULA · CASO 1 DE 2",
          beat: "FORMULA",
          activeFormulaCaseIndex: 0,
          formulaRevealCount: 1,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "He isn't busy right now.",
          subtitleSpanish: "He isn't busy right now. (Él no está ocupado ahora)",
          badgeLabel: "MODELO NATIVO",
          beat: "FORMULA",
          activeFormulaCaseIndex: 0,
          formulaRevealCount: 3,
          targetStep: "RULE",
        },
        // VÍA A: Caso 2 (02 · Preguntar (Invertir)) - Introducción en Español + Modelo Nativo en Inglés Puro
        {
          language: "es",
          text: "Y para hacer una pregunta en inglés no necesitas una palabra adicional: simplemente inviertes el orden y colocas el verbo antes de la persona... Por ejemplo, para preguntar si tú estás listo decimos:",
          subtitleSpanish: "Para preguntar invertimos el orden: colocamos 'Are' o 'Is' antes de la persona.",
          badgeLabel: "FÓRMULA · CASO 2 DE 2",
          beat: "FORMULA",
          activeFormulaCaseIndex: 1,
          formulaRevealCount: 1,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "Are you ready today?",
          subtitleSpanish: "Are you ready today? (¿Estás listo hoy?)",
          badgeLabel: "MODELO NATIVO",
          beat: "FORMULA",
          activeFormulaCaseIndex: 1,
          formulaRevealCount: 3,
          targetStep: "RULE",
        },
        // VÍA A: Trampa Desacoplada (Pronunciación Nativa Pura + Sincronización Visual)
        {
          language: "es",
          text: "Fíjate bien en la alerta en rojo de tu pizarra... En español solemos preguntar manteniendo el orden afirmativo y solo subiendo el tono de voz... pero en inglés nunca hacemos eso... Por eso nunca decimos:",
          subtitleSpanish: "En preguntas en inglés nunca mantenemos el orden afirmativo: 'You are ready?'.",
          badgeLabel: "LA TRAMPA DEL ESPAÑOL",
          beat: "TRAP",
          trapPhase: 0,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "You are ready?",
          subtitleSpanish: "Error común: You are ready? (orden afirmativo del español)",
          badgeLabel: "ERROR COMÚN",
          beat: "TRAP",
          trapPhase: 1,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "Sino que en inglés siempre invertimos el orden diciendo:",
          subtitleSpanish: "En su lugar decimos:",
          badgeLabel: "LA TRAMPA DEL ESPAÑOL",
          beat: "TRAP",
          trapPhase: 1,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "Are you ready?",
          subtitleSpanish: "Forma natural: Are you ready?",
          badgeLabel: "FORMA NATURAL",
          beat: "TRAP",
          trapPhase: 2,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "Tu ancla mental para no dudar jamás: en preguntas directas con el verbo tu bi, primero colocas el verbo y luego la persona.",
          subtitleSpanish: "Tu ancla mental: To Be siempre va antes del sujeto en preguntas directas.",
          badgeLabel: "ANCLA MENTAL",
          beat: "TRAP",
          trapPhase: 2,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.",
          subtitleSpanish: "Toca la frase natural en inglés para continuar la clase en vivo.",
          badgeLabel: hasSeenSoftware ? "3. CAZA LA TRAMPA" : "4. CAZA LA TRAMPA",
          beat: "TRAP_CHECK",
          pauseAfterForCheck: true,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "Are you ready for the meeting?",
          subtitleSpanish: "¿Estás listo para la reunión?",
          badgeLabel: hasSeenSoftware ? "4. MODELO NATIVO" : "5. MODELO NATIVO",
          beat: "EXAMPLES",
          activeExampleIndex: 0,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "Escucha con atención cómo se unen las palabras al preguntar... Are you ready for the meeting?... El secreto de pronunciación es unir are con you suavemente:... ar yu rédi for de míting.",
          subtitleSpanish: "El secreto de pronunciación es unir are con you: ar yu rédi for de míting.",
          badgeLabel: hasSeenSoftware ? "5. SECRETO FONÉTICO" : "6. SECRETO FONÉTICO",
          beat: "EXAMPLES",
          activeExampleIndex: 0,
          targetStep: "RULE",
        },
        {
          language: "en",
          text: "He isn't busy right now.",
          subtitleSpanish: "Él no está ocupado en este momento.",
          badgeLabel: hasSeenSoftware ? "6. EJEMPLO APLICADO" : "7. EJEMPLO APLICADO",
          beat: "EXAMPLES",
          activeExampleIndex: 1,
          targetStep: "RULE",
        },
        {
          language: "es",
          text: "Si te surge cualquier duda, toca Preguntar en cualquier momento... Ahora constrúyela tú: voy a abrir las fichas en tu pantalla para activar tu memoria motriz... ¡Adelante, tú puedes!",
          subtitleSpanish: "Arma la oración en orden natural para pasar al reto de voz.",
          badgeLabel: "ACTIVACIÓN EN PANTALLA",
          targetStep: "BUILD",
        },
      );

      return {
        headline: `Mentoría · ${node.title}`,
        fullOverviewSpanish: segments.map((s) => s.text).join(" "),
        segments,
      };
    }

    // Base 03: VÍA A desacoplada en fórmula multi-caso (3 usos: intro es + modelo nativo en)
    const isBase03 =
      node.orderIndex === 2 ||
      topicTitle.toLowerCase().includes("ser o estar sin enredos") ||
      topicTitle.toLowerCase().includes("am · is · are");

    if (isBase03 && formulaCases.length > 1) {
      formulaCases.forEach((fCase, idx) => {
        const cleanCaseLabel = fCase.label.replace(/^\d+\s*·\s*/, "");
        segments.push({
          language: "es",
          text:
            idx === 0
              ? `Hoy veremos ${topicTitle} paso a paso en ${formulaCases.length} usos claros. Uso 1, ${cleanCaseLabel}: ${fCase.explanationSpanish}`
              : `Ahora pasemos al uso ${idx + 1}, ${cleanCaseLabel}: ${fCase.explanationSpanish}`,
          subtitleSpanish: fCase.explanationSpanish,
          badgeLabel: `FÓRMULA · USO ${idx + 1} DE ${formulaCases.length}`,
          beat: "FORMULA",
          activeFormulaCaseIndex: idx,
          formulaRevealCount: 1,
          targetStep: "RULE",
        });
        if (fCase.exampleEnglish) {
          segments.push({
            language: "en",
            text: fCase.exampleEnglish,
            subtitleSpanish: `${fCase.exampleEnglish} (modelo nativo)`,
            badgeLabel: "MODELO NATIVO",
            beat: "FORMULA",
            activeFormulaCaseIndex: idx,
            formulaRevealCount: 3,
            targetStep: "RULE",
          });
        }
      });
    } else if (formulaCases.length <= 1) {
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
      text: UNIVERSAL_PHRASES.build_intro!.text,
      subtitleSpanish: UNIVERSAL_PHRASES.build_intro!.subtitle,
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
    let isDispatchingSpeak = false;
    let resolveCurrentSegment: (() => void) | null = null;
    let unregisterExternalStop: (() => void) | null = null;

    if (startIdx < script.segments.length) {
      const firstSeg = script.segments[startIdx]!;
      const firstVoice = firstSeg.language === "en" ? "liam" : spanishVoice;
      void SpeechSynthesisService.prefetch(firstSeg.text, firstVoice);
    }

    const cleanupSession = () => {
      isCancelled = true;
      unregisterExternalStop?.();
      unregisterExternalStop = null;
      const pendingResolve = resolveCurrentSegment;
      resolveCurrentSegment = null;
      pendingResolve?.();
    };

    const stop = () => {
      cleanupSession();
      SpeechSynthesisService.stop();
      onEnd();
    };

    unregisterExternalStop = SpeechSynthesisService.registerExternalStop(() => {
      if (isCancelled || isDispatchingSpeak) return;
      cleanupSession();
      onEnd();
    });

    const run = async () => {
      try {
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

            let segmentSettled = false;
            const completeSegment = () => {
              if (segmentSettled) return;
              segmentSettled = true;
              if (resolveCurrentSegment === completeSegment) {
                resolveCurrentSegment = null;
              }
              resolve();
            };
            resolveCurrentSegment = completeSegment;

            const handlePlayError = (err: any) => {
              const isAutoplay =
                err?.name === "NotAllowedError" ||
                String(err?.message || "").toLowerCase().includes("user didn't interact") ||
                String(err || "").includes("NotAllowedError");
              if (isAutoplay && !SpeechSynthesisService.isMuted()) {
                cleanupSession();
                SpeechSynthesisService.stop();
                if (onAutoplayBlocked) {
                  onAutoplayBlocked();
                } else {
                  onEnd();
                }
                completeSegment();
                return;
              }
              completeSegment();
            };

            isDispatchingSpeak = true;
            try {
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
            } finally {
              isDispatchingSpeak = false;
            }
          });

          if (
            !isCancelled &&
            this.activeSessionId === currentSessionId &&
            segment.pauseAfterForCheck &&
            options?.onPauseForCheck
          ) {
            cleanupSession();
            options.onPauseForCheck(segment.beat || "TRAP_CHECK", i + 1);
            return;
          }

          // Cognitive Breathing Cadence (Ley 5 del Master Standard)
          if (!isCancelled && this.activeSessionId === currentSessionId && i < script.segments.length - 1) {
            const isEnglishModel = segment.language === "en";
            const isCaseIntro = segment.formulaRevealCount === 1;
            const isTrapIntro = segment.trapPhase === 0;
            const cognitivePauseMs = isEnglishModel ? 750 : (isCaseIntro || isTrapIntro) ? 380 : 260;
            await new Promise((res) => setTimeout(res, cognitivePauseMs));
          }
        }

        if (!isCancelled && this.activeSessionId === currentSessionId) {
          cleanupSession();
          onEnd();
        }
      } finally {
        unregisterExternalStop?.();
        unregisterExternalStop = null;
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
