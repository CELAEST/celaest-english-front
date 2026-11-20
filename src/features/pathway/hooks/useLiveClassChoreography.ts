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

function isSeedNodeId(id: string): boolean {
  return /^guide-/i.test(id);
}

function shouldStartWithOrientation(step: PathwayStepId): boolean {
  return step === "RULE" && !PathwayLectureEngine.isSoftwareIntroSeen();
}

function buildContextSignature(node: PathwayNode, cefrLevel?: string): string {
  return `${node.id}|${cefrLevel ?? ""}`;
}

export interface UseLiveClassChoreographyOptions {
  node: PathwayNode;
  step: PathwayStepId;
  cefrLevel?: string | undefined;
  isActive: boolean;
  hasBlockingOverlay?: boolean | undefined;
  initialOpenAsking?: boolean | undefined;
  onStepChange?: ((step: PathwayStepId, options?: { skipAudio?: boolean }) => void) | undefined;
  onBeforeLectureStart: () => void;
  onAutoGuideSectionChange?: ((section: "structure" | "phonetics" | null) => void) | undefined;
}

export function useLiveClassChoreography({
  node, step, cefrLevel, isActive, hasBlockingOverlay = false, initialOpenAsking, onStepChange, onBeforeLectureStart, onAutoGuideSectionChange,
}: UseLiveClassChoreographyOptions) {
  const [isDictating, setIsDictating] = useState(false);
  const [lectureSegment, setLectureSegment] = useState<LectureSegment | null>(null);
  const [activeBeat, setActiveBeatState] = useState<LiveClassBeatId>(() =>
    shouldStartWithOrientation(step) ? "ORIENTATION" : "FORMULA",
  );
  const [activeFormulaCaseIndex, setActiveFormulaCaseIndex] = useState(0);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [isWaitingTrapCheck, setIsWaitingTrapCheck] = useState(false);
  const [trapCheckPassed, setTrapCheckPassed] = useState(false);
  const [isTrapCelebrating, setIsTrapCelebrating] = useState(false);
  const [isAutoplayWaiting, setIsAutoplayWaiting] = useState(false);

  const activeBeatRef = useRef<LiveClassBeatId>(activeBeat);
  const setActiveBeat = (beat: LiveClassBeatId) => {
    activeBeatRef.current = beat;
    setActiveBeatState(beat);
  };

  const latestContextRef = useRef<{ node: PathwayNode; cefrLevel?: string | undefined }>({
    node,
    cefrLevel,
  });
  latestContextRef.current = { node, cefrLevel };

  const cancelLectureRef = useRef<(() => void) | null>(null);
  const lectureRunSeqRef = useRef<number>(0);
  const startedOrientationRef = useRef<boolean>(false);
  const scriptRef = useRef<PathwayLectureScript | null>(null);
  const scriptContextKeyRef = useRef<string>("");
  const completedOrientationThisSessionRef = useRef<boolean>(false);
  const resumeIndexRef = useRef<number | null>(null);
  const lastSegmentIndexRef = useRef<number>(0);
  const pausedSegmentIndexRef = useRef<number | null>(null);
  const lectureTriggeredStepRef = useRef<PathwayStepId | null>(null);
  const orientationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guideSwitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isGuideDemoOpenRef = useRef<boolean>(false);
  const autoGuideCallbackRef = useRef(onAutoGuideSectionChange);
  autoGuideCallbackRef.current = onAutoGuideSectionChange;
  const hasBlockingOverlayRef = useRef<boolean>(hasBlockingOverlay);
  hasBlockingOverlayRef.current = hasBlockingOverlay;

  // Preserve an active or pending intro session when the temporary seed node swaps to its hydrated backend counterpart
  const committedNodeRef = useRef<{ id: string; orderIndex: number; title: string; key: number }>({
    id: node.id,
    orderIndex: node.orderIndex,
    title: node.title,
    key: 0,
  });
  if (committedNodeRef.current.id !== node.id) {
    const prev = committedNodeRef.current;
    const isInOrientation =
      activeBeatRef.current === "ORIENTATION" || !PathwayLectureEngine.isSoftwareIntroSeen();
    const isSeedToBackendHydration =
      isSeedNodeId(prev.id) &&
      !isSeedNodeId(node.id) &&
      prev.orderIndex === node.orderIndex &&
      prev.title === node.title;
    const shouldPreserveRunningSession = isInOrientation || isSeedToBackendHydration;

    committedNodeRef.current = {
      id: node.id,
      orderIndex: node.orderIndex,
      title: node.title,
      key: shouldPreserveRunningSession ? prev.key : prev.key + 1,
    };
  }
  const lectureSessionKey = committedNodeRef.current.key;

  const cancelAutoGuideDemo = () => {
    if (guideSwitchTimerRef.current) {
      clearTimeout(guideSwitchTimerRef.current);
      guideSwitchTimerRef.current = null;
    }
    if (isGuideDemoOpenRef.current) {
      isGuideDemoOpenRef.current = false;
      autoGuideCallbackRef.current?.(null);
    }
  };

  const clearTimersAndLecture = (options?: { stopAudio?: boolean }) => {
    const shouldStopAudio = options?.stopAudio ?? true;
    lectureRunSeqRef.current++;
    cancelAutoGuideDemo();
    if (orientationTimerRef.current) { clearTimeout(orientationTimerRef.current); orientationTimerRef.current = null; }
    if (resumeTimerRef.current) { clearTimeout(resumeTimerRef.current); resumeTimerRef.current = null; }
    if (shouldStopAudio) {
      cancelLectureRef.current?.();
      cancelLectureRef.current = null;
      SpeechSynthesisService.stop();
    } else {
      cancelLectureRef.current = null;
      PathwayLectureEngine.cancelPendingLoop();
    }
    setIsDictating(false);
    setIsTrapCelebrating(false);
  };

  useEffect(() => {
    if (hasBlockingOverlay) {
      clearTimersAndLecture();
    }
  }, [hasBlockingOverlay]);

  const ensureScript = (forceRebuild = false): PathwayLectureScript => {
    const { node: currentNode, cefrLevel: currentCefr } = latestContextRef.current;
    const currentKey = buildContextSignature(currentNode, currentCefr);
    const contextHydratedAfterIntro =
      activeBeatRef.current !== "ORIENTATION" && scriptContextKeyRef.current !== currentKey;
    if (!scriptRef.current || forceRebuild || contextHydratedAfterIntro) {
      scriptRef.current = PathwayLectureEngine.buildLectureScript(currentNode, {
        cefrLevel: currentCefr,
        includeReturningWelcome: false,
      });
      scriptContextKeyRef.current = currentKey;
    }
    return scriptRef.current;
  };

  const dismissOrientationAsSeen = () => {
    if (!PathwayLectureEngine.isSoftwareIntroSeen()) {
      completedOrientationThisSessionRef.current = true;
      PathwayLectureEngine.markSoftwareIntroSeen();
      scriptRef.current = null;
      scriptContextKeyRef.current = "";
      lastSegmentIndexRef.current = 0;
      pausedSegmentIndexRef.current = null;
    }
  };

  const startLectureAt = (
    startIdx = 0,
    runOptions?: { stopAfterOrientation?: boolean },
  ) => {
    clearTimersAndLecture();
    const runSeq = lectureRunSeqRef.current;
    onBeforeLectureStart();
    const { node: activeLectureNode } = latestContextRef.current;
    const script = ensureScript();
    const shouldStopAfterOrientation = runOptions?.stopAfterOrientation ?? false;
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
      activeLectureNode,
      (i, seg) => {
        if (lectureRunSeqRef.current !== runSeq) return;
        lastSegmentIndexRef.current = i;
        setIsAutoplayWaiting(false);
        setLectureSegment(seg);
        if (seg.beat) setActiveBeat(seg.beat);
        if (seg.activeFormulaCaseIndex !== undefined) setActiveFormulaCaseIndex(seg.activeFormulaCaseIndex);
        if (seg.activeExampleIndex !== undefined) setActiveExampleIndex(seg.activeExampleIndex);

        if (seg.guideShowcase === "structure-then-phonetics") {
          if (guideSwitchTimerRef.current) {
            clearTimeout(guideSwitchTimerRef.current);
            guideSwitchTimerRef.current = null;
          }
          isGuideDemoOpenRef.current = true;
          autoGuideCallbackRef.current?.("structure");
          guideSwitchTimerRef.current = setTimeout(() => {
            guideSwitchTimerRef.current = null;
            if (lectureRunSeqRef.current === runSeq && isGuideDemoOpenRef.current) {
              autoGuideCallbackRef.current?.("phonetics");
            }
          }, 5450);
        } else {
          cancelAutoGuideDemo();
        }
      },
      () => {
        if (lectureRunSeqRef.current !== runSeq) return;
        cancelAutoGuideDemo();
        setIsDictating(false);
        setLectureSegment(null);
        cancelLectureRef.current = null;
      },
      "liam",
      (s) => {
        if (lectureRunSeqRef.current !== runSeq) return;
        if (s === "BUILD") {
          lectureTriggeredStepRef.current = "BUILD";
          onStepChange?.("BUILD", { skipAudio: true });
        }
      },
      () => {
        if (lectureRunSeqRef.current !== runSeq) return;
        // Autoplay blocked by browser: stay calm and silent until explicit click
        cancelAutoGuideDemo();
        setIsAutoplayWaiting(true);
        setIsDictating(false);
        setLectureSegment(null);
        cancelLectureRef.current = null;
      },
      {
        script,
        startFromIndex: startIdx,
        stopAfterOrientation: shouldStopAfterOrientation,
        onSegmentEnd: (_idx, seg) => {
          if (lectureRunSeqRef.current !== runSeq) return;
          if (seg.guideShowcase === "structure-then-phonetics") {
            cancelAutoGuideDemo();
          }
        },
        onOrientationCompleted: () => {
          if (lectureRunSeqRef.current !== runSeq) return null;
          cancelAutoGuideDemo();
          completedOrientationThisSessionRef.current = true;
          setActiveBeat("FORMULA");
          if (shouldStopAfterOrientation) {
            scriptRef.current = null;
            scriptContextKeyRef.current = "";
            lastSegmentIndexRef.current = 0;
            pausedSegmentIndexRef.current = null;
            return null;
          }
          const latest = latestContextRef.current;
          if (buildContextSignature(latest.node, latest.cefrLevel) === scriptContextKeyRef.current) {
            return null;
          }
          return ensureScript(true);
        },
        onPauseForCheck: (beat, nextIdx) => {
          if (lectureRunSeqRef.current !== runSeq) return;
          resumeIndexRef.current = nextIdx;
          setIsDictating(false);
          setActiveBeat(beat);
          setIsWaitingTrapCheck(true);
          cancelLectureRef.current = null;
        },
      },
    ).then((c) => {
      if (lectureRunSeqRef.current !== runSeq) {
        c();
        return;
      }
      cancelLectureRef.current = c;
    });
  };

  useEffect(() => {
    if (lectureTriggeredStepRef.current === step) {
      lectureTriggeredStepRef.current = null;
      return;
    }
    if (step !== "RULE") clearTimersAndLecture({ stopAudio: false });
  }, [step]);

  useEffect(() => {
    clearTimersAndLecture();
    startedOrientationRef.current = false;
    scriptRef.current = null;
    scriptContextKeyRef.current = "";
    resumeIndexRef.current = null;
    lastSegmentIndexRef.current = 0;
    pausedSegmentIndexRef.current = null;
    setLectureSegment(null);
    setActiveBeat(shouldStartWithOrientation(step) ? "ORIENTATION" : "FORMULA");
    setActiveFormulaCaseIndex(0);
    setActiveExampleIndex(0);
    setIsWaitingTrapCheck(false);
    setTrapCheckPassed(false);
    setIsAutoplayWaiting(false);

    return () => {
      clearTimersAndLecture();
    };
  }, [lectureSessionKey]);

  useEffect(() => {
    if (!isActive) {
      clearTimersAndLecture();
      return;
    }
    if (
      !startedOrientationRef.current &&
      shouldStartWithOrientation(step) &&
      !initialOpenAsking &&
      !hasBlockingOverlayRef.current
    ) {
      if (orientationTimerRef.current) clearTimeout(orientationTimerRef.current);
      orientationTimerRef.current = setTimeout(() => {
        orientationTimerRef.current = null;
        if (!hasBlockingOverlayRef.current && !startedOrientationRef.current && shouldStartWithOrientation(step)) {
          startedOrientationRef.current = true;
          startLectureAt(0, { stopAfterOrientation: false });
        }
      }, 120);
      return () => {
        if (orientationTimerRef.current) {
          clearTimeout(orientationTimerRef.current);
          orientationTimerRef.current = null;
        }
      };
    }
  }, [lectureSessionKey, isActive]);

  const handleToggleLecture = () => {
    MobileAudioUnlocker.unlock();
    if (isDictating || SpeechSynthesisService.isAiPlaying()) {
      pausedSegmentIndexRef.current = lastSegmentIndexRef.current;
      clearTimersAndLecture();
      return;
    }
    if (step !== "RULE") onStepChange?.("RULE", { skipAudio: true });
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
    const wasPlaying = isDictating || SpeechSynthesisService.isAiPlaying();
    const wasOrientation = activeBeatRef.current === "ORIENTATION";
    if (step !== "RULE") onStepChange?.("RULE", { skipAudio: true });
    if (beat !== "ORIENTATION") {
      dismissOrientationAsSeen();
    }
    const script = ensureScript();
    setActiveBeat(beat);
    const idx = script.segments.findIndex((s) => s.beat === beat);

    // Skipping orientation ("Ir a la regla" / tab switch from ORIENTATION) must land quietly on FORMULA waiting for "Comenzar Clase"
    if (wasOrientation && beat !== "ORIENTATION") {
      clearTimersAndLecture();
      setLectureSegment(null);
      pausedSegmentIndexRef.current = idx >= 0 ? idx : 0;
      return;
    }

    if (wasPlaying && idx >= 0) {
      startLectureAt(idx);
    } else if (idx >= 0) {
      setLectureSegment(null);
      pausedSegmentIndexRef.current = idx;
    }
  };

  const handleSelectFormulaCase = (caseIndex: number) => {
    MobileAudioUnlocker.unlock();
    const wasPlaying = isDictating || SpeechSynthesisService.isAiPlaying();
    const wasOrientation = activeBeatRef.current === "ORIENTATION";
    if (step !== "RULE") onStepChange?.("RULE", { skipAudio: true });
    dismissOrientationAsSeen();
    const script = ensureScript();
    setActiveBeat("FORMULA");
    setActiveFormulaCaseIndex(caseIndex);
    const idx = script.segments.findIndex(
      (s) => s.beat === "FORMULA" && s.activeFormulaCaseIndex === caseIndex,
    );
    if (wasOrientation) {
      clearTimersAndLecture();
      setLectureSegment(null);
      pausedSegmentIndexRef.current = idx >= 0 ? idx : 0;
      return;
    }
    if (wasPlaying && idx >= 0) {
      startLectureAt(idx);
    } else if (idx >= 0) {
      setLectureSegment(null);
      pausedSegmentIndexRef.current = idx;
    }
  };

  const handleAnswerTrapCheck = (isCorrect: boolean) => {
    MobileAudioUnlocker.unlock();
    clearTimersAndLecture();
    const { node: currentNode, cefrLevel: currentCefr } = latestContextRef.current;
    const speechProfile = resolveSpeechProfile(currentNode.orderIndex, currentNode.title, currentCefr);

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
    stopAllLecture: clearTimersAndLecture, cancelAutoGuideDemo,
    handleToggleLecture, handleSelectBeat, handleSelectFormulaCase, handleAnswerTrapCheck,
  };
}

