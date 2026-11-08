import { useEffect, useRef, useState } from "react";
import { resolveSpeechProfile, speechMomentText } from "../speech/profiles";
import { PathwayNode, PathwayStepId } from "../../../domain/entities/LearningPathway";
import { MobileAudioUnlocker, SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";
import {
  LectureSegment,
  LiveClassBeatId,
  PathwayLectureEngine,
  PathwayLectureScript,
} from "../services/PathwayLectureEngine";

export interface UseLiveClassChoreographyOptions {
  node: PathwayNode;
  step: PathwayStepId;
  isActive: boolean;
  initialOpenAsking?: boolean | undefined;
  onStepChange?: ((step: PathwayStepId, options?: { skipAudio?: boolean }) => void) | undefined;
  onBeforeLectureStart: () => void;
}

export function useLiveClassChoreography({
  node, step, isActive, initialOpenAsking, onStepChange, onBeforeLectureStart,
}: UseLiveClassChoreographyOptions) {
  const [isDictating, setIsDictating] = useState(false);
  const [lectureSegment, setLectureSegment] = useState<LectureSegment | null>(null);
  const [activeBeat, setActiveBeat] = useState<LiveClassBeatId>("FORMULA");
  const [activeFormulaCaseIndex, setActiveFormulaCaseIndex] = useState(0);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [isWaitingTrapCheck, setIsWaitingTrapCheck] = useState(false);
  const [trapCheckPassed, setTrapCheckPassed] = useState(false);
  const [isTrapCelebrating, setIsTrapCelebrating] = useState(false);
  const [isAutoplayWaiting, setIsAutoplayWaiting] = useState(false);

  const cancelLectureRef = useRef<(() => void) | null>(null);
  const scriptRef = useRef<PathwayLectureScript | null>(null);
  const resumeIndexRef = useRef<number | null>(null);
  const lectureTriggeredStepRef = useRef<PathwayStepId | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimersAndLecture = () => {
    if (resumeTimerRef.current) { clearTimeout(resumeTimerRef.current); resumeTimerRef.current = null; }
    cancelLectureRef.current?.();
    cancelLectureRef.current = null;
    SpeechSynthesisService.stop();
    setIsDictating(false);
    setIsTrapCelebrating(false);
  };

  const ensureScript = (): PathwayLectureScript => {
    if (!scriptRef.current) {
      scriptRef.current = PathwayLectureEngine.buildLectureScript(node);
    }
    return scriptRef.current;
  };

  const startLectureAt = (startIdx = 0) => {
    clearTimersAndLecture();
    onBeforeLectureStart();
    const script = ensureScript();
    const targetSeg = script.segments[startIdx];
    if (targetSeg?.beat) setActiveBeat(targetSeg.beat);
    if (targetSeg?.activeFormulaCaseIndex !== undefined) setActiveFormulaCaseIndex(targetSeg.activeFormulaCaseIndex);
    setActiveExampleIndex(targetSeg?.activeExampleIndex ?? 0);
    setIsWaitingTrapCheck(false);
    setIsAutoplayWaiting(false);
    setIsDictating(true);

    void PathwayLectureEngine.playLecture(
      node,
      (_i, seg) => {
        setIsAutoplayWaiting(false);
        setLectureSegment(seg);
        if (seg.beat) setActiveBeat(seg.beat);
        if (seg.activeFormulaCaseIndex !== undefined) setActiveFormulaCaseIndex(seg.activeFormulaCaseIndex);
        if (seg.activeExampleIndex !== undefined) setActiveExampleIndex(seg.activeExampleIndex);
      },
      () => { setIsDictating(false); setLectureSegment(null); cancelLectureRef.current = null; },
      "liam",
      (s) => {
        if (s === "BUILD") {
          lectureTriggeredStepRef.current = "BUILD";
          onStepChange?.("BUILD", { skipAudio: true });
        }
      },
      () => {
        // Autoplay blocked by mobile browser
        setIsAutoplayWaiting(true);
        setIsDictating(false);
        setLectureSegment(null);
        cancelLectureRef.current = null;
      },
      {
        script,
        startFromIndex: startIdx,
        onPauseForCheck: (beat, nextIdx) => {
          resumeIndexRef.current = nextIdx;
          setIsDictating(false);
          setActiveBeat(beat);
          setIsWaitingTrapCheck(true);
          cancelLectureRef.current = null;
        },
      },
    ).then((c) => { cancelLectureRef.current = c; });
  };

  useEffect(() => {
    if (lectureTriggeredStepRef.current === step) {
      lectureTriggeredStepRef.current = null;
      return;
    }
    if (step !== "RULE") clearTimersAndLecture();
  }, [step]);

  useEffect(() => {
    clearTimersAndLecture();
    scriptRef.current = null;
    resumeIndexRef.current = null;
    setLectureSegment(null);
    setActiveBeat("FORMULA");
    setActiveFormulaCaseIndex(0);
    setActiveExampleIndex(0);
    setIsWaitingTrapCheck(false);
    setTrapCheckPassed(false);

    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isActive && !initialOpenAsking && step === "RULE") {
      timer = setTimeout(() => startLectureAt(0), 120);
    }
    return () => {
      if (timer) clearTimeout(timer);
      clearTimersAndLecture();
    };
  }, [node.id, isActive]);

  const handleToggleLecture = () => {
    MobileAudioUnlocker.unlock();
    if (isDictating) { clearTimersAndLecture(); return; }
    if (step !== "RULE") onStepChange?.("RULE");
    const script = ensureScript();
    const currentIdx = script.segments.findIndex((s) => s.beat === activeBeat);
    startLectureAt(currentIdx >= 0 ? currentIdx : 0);
  };

  const handleSelectBeat = (beat: LiveClassBeatId) => {
    MobileAudioUnlocker.unlock();
    if (step !== "RULE") onStepChange?.("RULE");
    const script = ensureScript();
    setActiveBeat(beat);
    const idx = script.segments.findIndex((s) => s.beat === beat);
    if (idx >= 0) startLectureAt(idx);
  };

  const handleSelectFormulaCase = (caseIndex: number) => {
    MobileAudioUnlocker.unlock();
    if (step !== "RULE") onStepChange?.("RULE");
    const script = ensureScript();
    setActiveBeat("FORMULA");
    setActiveFormulaCaseIndex(caseIndex);
    const idx = script.segments.findIndex(
      (s) => s.beat === "FORMULA" && s.activeFormulaCaseIndex === caseIndex,
    );
    if (idx >= 0) startLectureAt(idx);
  };

  const handleAnswerTrapCheck = (isCorrect: boolean) => {
    MobileAudioUnlocker.unlock();
    clearTimersAndLecture();
    const why = node.lessonPayload?.commonMistake.whySpanish || "Revisa el orden natural en inglés.";
    const speechProfile = resolveSpeechProfile(node.orderIndex, node.title);
    const isBase01 =
      node.orderIndex === 0 ||
      node.title.toLowerCase().includes("orden mágico");
    const isBase02 =
      node.orderIndex === 1 ||
      node.title.toLowerCase().includes("it' fantasma") ||
      node.title.toLowerCase().includes("el it fantasma");
    const isBase03 =
      node.orderIndex === 2 ||
      node.title.toLowerCase().includes("ser o estar sin enredos") ||
      node.title.toLowerCase().includes("am · is · are");
    const isBase04 =
      node.orderIndex === 3 ||
      node.title.toLowerCase().includes("la trampa de 'tener'") ||
      node.title.toLowerCase().includes("la trampa de tener") ||
      node.title.toLowerCase().includes("estados y edad");
    const isBase05 =
      node.orderIndex === 4 ||
      node.title.toLowerCase().includes("negativo & pregunta") ||
      node.title.toLowerCase().includes("negativo y pregunta");

    if (!isCorrect) {
      setIsWaitingTrapCheck(true);
      const trapErrorSpeech =
        speechMomentText(speechProfile, "trapcheck.error") ??
        (isBase01
          ? "¡Mucho ojo! Esa es justo la trampa del español... Recuerda siempre abrir tu frase nombrando a la persona: ya sea I, you, we, o they... Toca la otra opción en tu pantalla."
          : isBase02
          ? "¡Mucho ojo! Esa es justo la trampa del español... En inglés nunca dejes el verbo huérfano: coloca siempre el sujeto neutro It diciendo por ejemplo:... It is cold today... Toca la otra opción en tu pantalla."
          : isBase03
          ? "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que para una sola persona ajena como ella, la pareja fija siempre es... is... diciendo... She is ready... Toca la otra opción en tu pantalla."
          : isBase04
          ? "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que la edad en inglés se dice con am o is, nunca con have... diciendo... I am 25 years old... Toca la otra opción en tu pantalla."
          : isBase05
          ? "¡Mucho ojo! Esa es justo la trampa del español... Recuerda que en preguntas directas colocamos primero el verbo: diciendo... Are you ready?... Toca la otra opción en tu pantalla."
          : `¡Ojo! Esa es la trampa del español: ${why} Toca la otra opción.`);
      void SpeechSynthesisService.speak(trapErrorSpeech, {
        lang: "es", voice: "liam", rate: 0.97, preventSyntheticFallback: true,
      });
      return;
    }

    setTrapCheckPassed(true);
    setIsWaitingTrapCheck(false);
    setIsTrapCelebrating(true);

    const script = ensureScript();
    const examplesIdx = resumeIndexRef.current ?? script.segments.findIndex((s) => s.beat === "EXAMPLES");
    let resumed = false;
    const proceed = () => {
      if (resumed) return;
      resumed = true;
      if (resumeTimerRef.current) { clearTimeout(resumeTimerRef.current); resumeTimerRef.current = null; }
      setIsTrapCelebrating(false);
      if (examplesIdx >= 0) startLectureAt(examplesIdx);
    };

    // Generous 15s safety fallback only in case playback errors or fails completely
    resumeTimerRef.current = setTimeout(proceed, 15000);
    const trapSuccessSpeech =
      speechMomentText(speechProfile, "trapcheck.success") ??
      (isBase01
        ? "¡Exacto! Cazaste la trampa a la perfección... Escucha ahora con atención cómo suena en ejemplos reales."
        : isBase02
        ? "¡Exacto! Cazaste la trampa a la perfección... Nunca dejamos el verbo huérfano... Escucha ahora con atención cómo suena en ejemplos reales."
        : isBase03
        ? "¡Exacto! Cazaste la trampa a la perfección... Una sola persona siempre va con... is... Escucha ahora con atención cómo suena en ejemplos reales."
        : isBase04
        ? "¡Exacto! Cazaste la trampa a la perfección... La edad se dice con el verbo tu bi... Escucha ahora con atención cómo suena en ejemplos reales."
        : isBase05
        ? "¡Exacto! Cazaste la trampa a la perfección... En preguntas siempre invertimos el orden... Escucha ahora con atención cómo suena en ejemplos reales."
        : "¡Exacto! Cazaste la trampa. Escucha ahora cómo suena en ejemplos reales.");
    void SpeechSynthesisService.speak(trapSuccessSpeech, {
      lang: "es", voice: "liam", rate: 0.97, preventSyntheticFallback: true,
      onEnd: () => {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(proceed, 350);
      },
      onError: () => {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        proceed();
      },
    });
  };

  return {
    isDictating, lectureSegment, activeBeat, activeFormulaCaseIndex, activeExampleIndex,
    isWaitingTrapCheck, trapCheckPassed, isTrapCelebrating, isAutoplayWaiting,
    stopAllLecture: clearTimersAndLecture,
    handleToggleLecture, handleSelectBeat, handleSelectFormulaCase, handleAnswerTrapCheck,
  };
}

