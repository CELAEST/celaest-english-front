import { PathwayNode, PathwayStepId, resolveFormulaCases } from "../../../domain/entities/LearningPathway";
import { getSoftwareGuideOrientationText, LectureSegment, LiveClassBeatId, PathwayLectureEngine } from "./PathwayLectureEngine";
import { ProfessorAnswer } from "./PathwayQAService";

export type ProfessorBoardMode = "lesson" | "examples" | "software";

export interface ProfessorSpeech {
  eyebrow: string;
  headline: string;
  text: string;
  sampleAudioText: string | null;
}

export interface ProfessorSpeechContext {
  node: PathwayNode;
  step: PathwayStepId;
  mode: ProfessorBoardMode;
  activeBeat?: LiveClassBeatId | undefined;
  activeFormulaCaseIndex?: number | undefined;
  isBuildCorrect: boolean;
  hasBuildMistake: boolean;
  isConquered: boolean;
  isRecordingMic: boolean;
  lectureSegment: LectureSegment | null;
  qaAnswer?: ProfessorAnswer | null;
  isAskingQA?: boolean;
}

const softwareSpeech = (ctx: ProfessorSpeechContext): ProfessorSpeech => {
  const lesson = ctx.node.lessonPayload;
  if (ctx.step === "RULE") {
    return {
      eyebrow: "Guía de Estudio",
      headline: "Cómo funciona la regla",
      text: "En CELAEST dominas cada base en 3 pasos: la Regla (entiendes la estructura sin traducir literalmente), la Práctica (ensamblas las piezas para forjar memoria motriz) y el Habla (grabas tu voz para certificar tu fluidez). Recuerda que arriba en la cabecera tienes la Guía de Estudio con los 14 Bloques de Estructura y el Alfabeto Fonético completo para apoyarte en cualquier momento.",
      sampleAudioText: lesson?.examples[0]?.english ?? null,
    };
  }
  if (ctx.step === "BUILD") {
    return {
      eyebrow: "Guía",
      headline: "Cómo funciona la práctica",
      text: "Esta fase forja reflejos automáticos: toca las fichas en el orden exacto en que las dirías en inglés. Si te equivocas recibirás una pista inmediata y podrás tocar cualquier ficha colocada para reorganizarla. Al completar la oración se desbloquea el entrenamiento de voz.",
      sampleAudioText: lesson?.blockChallenge.targetTokens.join(" ") ?? null,
    };
  }
  return {
    eyebrow: "Guía",
    headline: "Cómo funciona la certificación de voz",
    text: "Aquí evalúo tu voz en tiempo real: toca el micrófono, permite el acceso del navegador y pronuncia la frase con calma. Analizo tu fonética y ritmo. Al aprobar, la base queda certificada y conectas con tus módulos de entrevistas y redacción profesional.",
    sampleAudioText: lesson?.voicePractice.sentenceEnglish ?? null,
  };
};

const buildStepSpeech = (ctx: ProfessorSpeechContext): ProfessorSpeech => {
  const lesson = ctx.node.lessonPayload!;
  const target = lesson.blockChallenge.targetTokens.join(" ");
  if (ctx.isBuildCorrect) {
    return {
      eyebrow: "Práctica",
      headline: "Construcción perfecta",
      text: `Exacto. ${lesson.blockChallenge.successTipSpanish} Colocaste todas las piezas en orden natural. Avanza al paso Habla para entrenar tu voz.`,
      sampleAudioText: target,
    };
  }
  if (ctx.hasBuildMistake) {
    return {
      eyebrow: "Práctica",
      headline: "Una pista del maestro",
      text: `${lesson.blockChallenge.mistakeHintSpanish} Toca una ficha para reorganizarla y piensa en la estructura directa, sin traducir del español.`,
      sampleAudioText: null,
    };
  }
  return {
    eyebrow: "Práctica",
    headline: "Tu turno de construir",
    text: `Ordena las piezas para expresar: “${lesson.blockChallenge.promptSpanish}”. Toca las palabras en orden natural: primero el sujeto y luego el verbo base.`,
    sampleAudioText: null,
  };
};

const speakStepSpeech = (ctx: ProfessorSpeechContext): ProfessorSpeech => {
  const lesson = ctx.node.lessonPayload!;
  const sentence = lesson.voicePractice.sentenceEnglish;
  if (ctx.isConquered) {
    return {
      eyebrow: "Habla",
      headline: "Base conquistada",
      text: `Excelente pronunciación. Conquistaste esta base. ${lesson.bridgeModule.reasonSpanish} Ya estás listo para avanzar.`,
      sampleAudioText: sentence,
    };
  }
  if (ctx.isRecordingMic) {
    return {
      eyebrow: "Habla",
      headline: "Te escucho",
      text: `Pronuncia con calma: “${sentence}”. Mantén tu ritmo natural.`,
      sampleAudioText: null,
    };
  }
  const hint = lesson.voicePractice.pronunciationHint ? ` (guía: [${lesson.voicePractice.pronunciationHint}])` : "";
  return {
    eyebrow: "Habla",
    headline: "Entrena tu voz",
    text: `Escúchame decir “${sentence}”${hint}. Luego toca el micrófono y dila tú para certificar tu avance.`,
    sampleAudioText: sentence,
  };
};

export function buildProfessorSpeech(ctx: ProfessorSpeechContext): ProfessorSpeech {
  const { node, step, mode, lectureSegment, qaAnswer, isAskingQA } = ctx;
  const baseLabel = `Base ${String(node.orderIndex + 1).padStart(2, "0")}`;

  if (isAskingQA) {
    return {
      eyebrow: "Mentoría Activa",
      headline: "Analizando tu pregunta...",
      text: "Estoy consultando la estructura lingüística y preparando la mejor explicación para ti. Un momento...",
      sampleAudioText: null,
    };
  }

  if (qaAnswer) {
    return {
      eyebrow: "Mentoría Personalizada",
      headline: `Respuesta a tu duda`,
      text: `${qaAnswer.directAnswer} ${qaAnswer.mentalModel} Ejemplo: “${qaAnswer.exampleEnglish}” (${qaAnswer.exampleSpanish}). ${qaAnswer.pronunciationTip ? `Secreto: ${qaAnswer.pronunciationTip}` : ""}`,
      sampleAudioText: qaAnswer.exampleEnglish,
    };
  }

  if (step === "RULE" && lectureSegment) {
    const topicTitle = node.title.replace(/[«»"']/g, "").trim();
    const isIntro = lectureSegment.beat === "ORIENTATION";
    const cleanBadge = lectureSegment.badgeLabel.replace(/^\d+\.\s*/, "");
    return {
      eyebrow: isIntro ? "Bienvenida & Guía" : `${baseLabel} · ${cleanBadge}`,
      headline: isIntro ? "¡Hola! Soy Liam, tu mentor" : topicTitle,
      text: lectureSegment.text,
      sampleAudioText: lectureSegment.language === "en" ? lectureSegment.text : null,
    };
  }

  const lesson = node.lessonPayload;
  if (!lesson) {
    return { eyebrow: "Introducción", headline: node.title, text: node.blueprint.objectiveSpanish, sampleAudioText: null };
  }
  if (mode === "software") return softwareSpeech(ctx);
  if (step === "BUILD") return buildStepSpeech(ctx);
  if (step !== "RULE") return speakStepSpeech(ctx);

  if (ctx.activeBeat === "TRAP_CHECK") {
    return {
      eyebrow: `${baseLabel} · Reto en Vivo`,
      headline: "Caza la trampa del español",
      text: "Toca la frase que suena natural en inglés para continuar la explicación.",
      sampleAudioText: lesson.commonMistake.correct,
    };
  }
  if (ctx.activeBeat === "TRAP") {
    return {
      eyebrow: `${baseLabel} · Contraste`,
      headline: "La trampa del español",
      text: lesson.commonMistake.whySpanish,
      sampleAudioText: lesson.commonMistake.correct,
    };
  }
  if (ctx.activeBeat === "EXAMPLES") {
    return {
      eyebrow: `${baseLabel} · Modelo Nativo`,
      headline: "Ejemplos en acción",
      text: lesson.examples[0]?.spanish || lesson.ruleTaglineSpanish,
      sampleAudioText: lesson.examples[0]?.english ?? null,
    };
  }

  const cases = resolveFormulaCases(lesson);
  if (cases.length >= 1) {
    const idx = Math.min(ctx.activeFormulaCaseIndex ?? 0, cases.length - 1);
    const activeCase = cases[idx]!;
    return {
      eyebrow: cases.length > 1 ? `${baseLabel} · Uso ${idx + 1} de ${cases.length}` : `${baseLabel} · Fórmula`,
      headline: node.title.replace(/[«»"']/g, "").trim(),
      text: activeCase.explanationSpanish,
      sampleAudioText: activeCase.exampleEnglish ?? lesson.examples[0]?.english ?? null,
    };
  }

  return getConnectedIntroSpeech(node);
}

function getConnectedIntroSpeech(node: PathwayNode): ProfessorSpeech {
  const baseLabel = `Base ${String(node.orderIndex + 1).padStart(2, "0")}`;
  const isFirstTime = !PathwayLectureEngine.isSoftwareIntroSeen();

  if (isFirstTime && node.orderIndex === 0) {
    const text = getSoftwareGuideOrientationText();
    return {
      eyebrow: "Bienvenida & Guía",
      headline: "¡Hola! Soy Liam, tu mentor",
      text,
      sampleAudioText: text,
    };
  }

  const topicTitle = node.title.replace(/[«»"']/g, "").trim();
  const objective = node.blueprint?.objectiveSpanish
    ? node.blueprint.objectiveSpanish.replace(/[«»"']/g, "").trim()
    : node.lessonPayload?.ruleTaglineSpanish.replace(/[«»"']/g, "").trim() || "";

  const introText = `El reto de hoy es ${topicTitle}. ${objective}. Sigue la explicación aquí mismo o toca Preguntar para cualquier duda.`;
  return {
    eyebrow: baseLabel,
    headline: topicTitle,
    text: introText,
    sampleAudioText: null,
  };
}
