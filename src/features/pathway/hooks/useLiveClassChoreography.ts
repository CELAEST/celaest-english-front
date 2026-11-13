import { useEffect, useRef, useState } from "react";
import { resolveSpeechProfile, speechMomentText } from "../speech/profiles";
import { UNIVERSAL_PHRASES } from "../speech/universalPhrases";
import { PathwayNode, PathwayStepId } from "../../../domain/entities/LearningPathway";
import { MobileAudioUnlocker, SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";
import {
  LectureSegment,
  LiveClassBeatId,
  PathwayLectureEngine,
  PathwayLectureScript,
} from "../services/PathwayLectureEngine";

const SESSION_WELCOMED_KEY = "celaest:tutor:session_welcomed";

export interface UseLiveClassChoreographyOptions {
  node: PathwayNode;
  step: PathwayStepId;
  cefrLevel?: string | undefined;
  isActive: boolean;
  hasBlockingOverlay?: boolean | undefined;
  initialOpenAsking?: boolean | undefined;
  onStepChange?: ((step: PathwayStepId, options?: { skipAudio?: boolean }) => void) | undefined;
  onBeforeLectureStart: () => void;
}

export function useLiveClassChoreography({
  node, step, cefrLevel, isActive, hasBlockingOverlay = false, initialOpenAsking, onStepChange, onBeforeLectureStart,
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
  const lastSegmentIndexRef = useRef<number>(0);
  const pausedSegmentIndexRef = useRef<number | null>(null);
  const lectureTriggeredStepRef = useRef<PathwayStepId | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasBlockingOverlayRef = useRef<boolean>(hasBlockingOverlay);
  hasBlockingOverlayRef.current = hasBlockingOverlay;

  const clearTimersAndLecture = () => {
    if (resumeTimerRef.current) { clearTimeout(resumeTimerRef.current); resumeTimerRef.current = null; }
    cancelLectureRef.current?.();
    cancelLectureRef.current = null;
    SpeechSynthesisService.stop();
    setIsDictating(false);
    setIsTrapCelebrating(false);
  };

  useEffect(() => {
    if (hasBlockingOverlay) {
      clearTimersAndLecture();
    }
  }, [hasBlockingOverlay]);

  const ensureScript = (): PathwayLectureScript => {
    if (!scriptRef.current) {
      let includeReturningWelcome = false;
      if (PathwayLectureEngine.isSoftwareIntroSeen() && typeof window !== "undefined") {
        try {
          if (!sessionStorage.getItem(SESSION_WELCOMED_KEY)) {
            sessionStorage.setItem(SESSION_WELCOMED_KEY, "1");
            includeReturningWelcome = true;
          }
        } catch {
          // ignore storage unavailability
        }
      }
      scriptRef.current = PathwayLectureEngine.buildLectureScript(node, {
        cefrLevel,
        includeReturningWelcome,
      });
    }
    return scriptRef.current;
  };

  const startLectureAt = (startIdx = 0) => {
    clearTimersAndLecture();
    onBeforeLectureStart();
    const script = ensureScript();
    lastSegmentIndexRef.current = startIdx;
    pausedSegmentIndexRef.current = null;
    const targetSeg = script.segments[startIdx];
    if (targetSeg?.beat) setActiveBeat(targetSeg.beat);
    if (targetSeg?.activeFormulaCaseIndex !== undefined) setActiveFormulaCaseIndex(targetSeg.activeFormulaCaseIndex);
    setActiveExampleIndex(targetSeg?.activeExampleIndex ?? 0);
    setIsWaitingTrapCheck(false);
    setIsAutoplayWaiting(false);
    setIsDictating(true);

    void PathwayLectureEngine.playLecture(
      node,
      (i, seg) => {
        lastSegmentIndexRef.current = i;
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
    lastSegmentIndexRef.current = 0;
    pausedSegmentIndexRef.current = null;
    setLectureSegment(null);
    setActiveBeat("FORMULA");
    setActiveFormulaCaseIndex(0);
    setActiveExampleIndex(0);
    setIsWaitingTrapCheck(false);
    setTrapCheckPassed(false);

    let timer: ReturnType<typeof setTimeout> | null = null;
    if (
      isActive &&
      !initialOpenAsking &&
      !hasBlockingOverlayRef.current &&
      step === "RULE"
    ) {
      timer = setTimeout(() => {
        if (!hasBlockingOverlayRef.current) {
          startLectureAt(0);
        }
      }, 120);
    }
    return () => {
      if (timer) clearTimeout(timer);
      clearTimersAndLecture();
    };
  }, [node.id, isActive]);

  const handleToggleLecture = () => {
    MobileAudioUnlocker.unlock();
    if (isDictating || SpeechSynthesisService.isAiPlaying()) {
      pausedSegmentIndexRef.current = lastSegmentIndexRef.current;
      clearTimersAndLecture();
      return;
    }
    if (step !== "RULE") onStepChange?.("RULE");
    const script = ensureScript();
    if (
      pausedSegmentIndexRef.current !== null &&
      pausedSegmentIndexRef.current >= 0 &&
      pausedSegmentIndexRef.current < script.segments.length
    ) {
      startLectureAt(pausedSegmentIndexRef.current);
      return;
    }
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
    const speechProfile = resolveSpeechProfile(node.orderIndex, node.title, cefrLevel);

    if (!isCorrect) {
      setIsWaitingTrapCheck(true);
      const trapErrorSpeech =
        speechMomentText(speechProfile, "trapcheck.error") ??
        UNIVERSAL_PHRASES.trap_fail!.text;
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
      UNIVERSAL_PHRASES.trap_pass!.text;
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

