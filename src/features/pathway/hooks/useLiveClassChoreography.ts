import { useEffect, useRef, useState } from "react";
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
  onStepChange?: ((step: PathwayStepId) => void) | undefined;
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
    setIsDictating(true);

    void PathwayLectureEngine.playLecture(
      node,
      (_i, seg) => {
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
          onStepChange?.("BUILD");
        }
      },
      () => { setIsDictating(false); setLectureSegment(null); cancelLectureRef.current = null; },
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

    if (!isCorrect) {
      setIsWaitingTrapCheck(true);
      void SpeechSynthesisService.speak(`¡Ojo! Esa es la trampa del español: ${why} Toca la otra opción.`, {
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

    resumeTimerRef.current = setTimeout(proceed, 3800);
    void SpeechSynthesisService.speak("¡Exacto! Cazaste la trampa. Escucha ahora cómo suena en ejemplos reales.", {
      lang: "es", voice: "liam", rate: 0.97, preventSyntheticFallback: true,
      onEnd: () => {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(proceed, 300);
      },
      onError: () => {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(proceed, 900);
      },
    });
  };

  return {
    isDictating, lectureSegment, activeBeat, activeFormulaCaseIndex, activeExampleIndex,
    isWaitingTrapCheck, trapCheckPassed, isTrapCelebrating,
    stopAllLecture: clearTimersAndLecture,
    handleToggleLecture, handleSelectBeat, handleSelectFormulaCase, handleAnswerTrapCheck,
  };
}

