import { useEffect, useMemo, useRef, useState } from "react";
import { ProfessorAnimState } from "../../../design-system/components/Professor3D";
import { PathwayNode, PathwayStepId } from "../../../domain/entities/LearningPathway";
import { MobileAudioUnlocker, SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";
import { PathwayQAService, ProfessorAnswer } from "../services/PathwayQAService";
import { buildProfessorSpeech, ProfessorBoardMode } from "../services/professorSpeech";
import { useLiveClassChoreography } from "./useLiveClassChoreography";

export interface UseProfessorStageStateOptions {
  node: PathwayNode; step: PathwayStepId; isActive: boolean; isSpeakingAudio: boolean; isRecordingMic: boolean;
  isEvaluatingVoice?: boolean | undefined;
  isBuildCorrect: boolean; hasBuildMistake: boolean; isConquered: boolean; onPlaySample: (text: string) => void;
  onStepChange?: ((step: PathwayStepId, options?: { skipAudio?: boolean }) => void) | undefined; initialOpenAsking?: boolean | undefined;
}

export function useProfessorStageState({
  node, step, isActive, isSpeakingAudio, isRecordingMic, isEvaluatingVoice = false, isBuildCorrect, hasBuildMistake, isConquered,
  onPlaySample, onStepChange, initialOpenAsking,
}: UseProfessorStageStateOptions) {
  const [mode, setMode] = useState<ProfessorBoardMode>("lesson");
  const [isAskingOpen, setIsAskingOpen] = useState(Boolean(initialOpenAsking));
  const [isAskingQA, setIsAskingQA] = useState(false);
  const [qaAnswer, setQaAnswer] = useState<ProfessorAnswer | null>(null);
  const [isAnsweringVoice, setIsAnsweringVoice] = useState(false);
  const [isAiAudioPlaying, setIsAiAudioPlaying] = useState<boolean>(() => SpeechSynthesisService.isAiPlaying());
  const cancelQARef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return SpeechSynthesisService.subscribePlaybackState(setIsAiAudioPlaying);
  }, []);

  const clearQaOnly = () => {
    cancelQARef.current?.(); cancelQARef.current = null;
    setIsAnsweringVoice(false); setQaAnswer(null);
  };

  const choreography = useLiveClassChoreography({
    node, step, isActive, initialOpenAsking, onStepChange,
    onBeforeLectureStart: () => { clearQaOnly(); setMode("lesson"); },
  });

  useEffect(() => { if (initialOpenAsking) setIsAskingOpen(true); }, [initialOpenAsking]);
  useEffect(() => {
    if (isAskingOpen) {
      choreography.stopAllLecture();
    }
  }, [isAskingOpen]);
  useEffect(() => { setMode("lesson"); clearQaOnly(); }, [step, node.id]);

  const handleAskQuestion = async (question: string) => {
    MobileAudioUnlocker.unlock();
    choreography.stopAllLecture();
    clearQaOnly();
    setIsAskingOpen(true);
    setIsAskingQA(true);
    try {
      const answer = await PathwayQAService.askProfessor({ question, node });
      setQaAnswer(answer);
      setIsAskingQA(false);
      setIsAnsweringVoice(false);
      // Zero audio execution: Liam answers visually and silently to preserve voice immersion
    } catch {
      setIsAskingQA(false);
      setIsAnsweringVoice(false);
    }
  };

  const animState: ProfessorAnimState = useMemo(() => {
    // 1. Actively recording microphone: inquisitive tilt + ear radar rings
    if (isRecordingMic) return "listening";

    // 2. Actively speaking / dictating: moving vocal mouth + audio waveforms
    // Whenever mentor voice is active (lecture, explanation, QA, or feedback), mouth MUST move!
    if (isSpeakingAudio || choreography.isDictating || isAnsweringVoice || isAiAudioPlaying) {
      return "explaining";
    }

    // 3. Victory / celebratory moments (only when not actively speaking):
    // - Right after answering trap check correctly
    // - When tiles in BUILD are correctly assembled
    // - In SPEAK step when conquering the base / victory banner is shown
    if (
      choreography.isTrapCelebrating ||
      (step === "BUILD" && isBuildCorrect) ||
      (step === "SPEAK" && isConquered)
    ) {
      return "celebrating";
    }

    // 4. Thinking / Analyzing / Expectant observation: cyan cyber scanning line
    if (
      isAskingQA ||
      isEvaluatingVoice ||
      choreography.isWaitingTrapCheck ||
      choreography.activeBeat === "TRAP" ||
      choreography.activeBeat === "TRAP_CHECK" ||
      hasBuildMistake ||
      (step === "BUILD" && !isBuildCorrect)
    ) {
      return "thinking";
    }

    // 5. Default calm idle: OLED pill eyes with realistic blinking
    return "idle";
  }, [
    isRecordingMic,
    isSpeakingAudio,
    choreography.isDictating,
    choreography.activeBeat,
    isAnsweringVoice,
    isAiAudioPlaying,
    choreography.isTrapCelebrating,
    isBuildCorrect,
    isConquered,
    isAskingQA,
    isEvaluatingVoice,
    choreography.isWaitingTrapCheck,
    hasBuildMistake,
    step,
  ]);

  const speech = useMemo(() => buildProfessorSpeech({
    node, step, mode, activeBeat: choreography.activeBeat,
    activeFormulaCaseIndex: choreography.activeFormulaCaseIndex,
    isBuildCorrect, hasBuildMistake, isConquered, isRecordingMic,
    lectureSegment: choreography.lectureSegment, qaAnswer, isAskingQA,
  }), [node, step, mode, choreography.activeBeat, choreography.activeFormulaCaseIndex, isBuildCorrect, hasBuildMistake, isConquered, isRecordingMic, choreography.lectureSegment, qaAnswer, isAskingQA]);

  const suggestedQuestions = useMemo(() => [
    node.blueprint?.l1InterferenceTrap ? "¿Por qué se confunde con el español?" : "¿Por qué en español decimos diferente?",
    `¿Cuál es la clave en ${node.title || "esta regla"}?`, "Dame un ejemplo aplicado al trabajo",
  ], [node]);

  const isShowingExamples =
    mode === "examples" ||
    Boolean(
      step === "RULE" && (
        choreography.lectureSegment?.language === "en" ||
        choreography.lectureSegment?.badgeLabel.includes("MODELO NATIVO") ||
        choreography.lectureSegment?.badgeLabel.includes("SECRETO FONÉTICO")
      )
    );

  return {
    mode, setMode, isDictating: choreography.isDictating,
    isAutoplayWaiting: choreography.isAutoplayWaiting,
    activeBeat: choreography.activeBeat,
    activeFormulaCaseIndex: choreography.activeFormulaCaseIndex,
    activeExampleIndex: choreography.activeExampleIndex,
    formulaRevealCount: choreography.lectureSegment?.formulaRevealCount,
    trapPhase: choreography.lectureSegment?.trapPhase,
    isWaitingTrapCheck: choreography.isWaitingTrapCheck, trapCheckPassed: choreography.trapCheckPassed,
    isSpeakingEnglishSegment: choreography.isDictating && choreography.lectureSegment?.language === "en",
    liveSubtitleSpanish: choreography.lectureSegment?.subtitleSpanish,
    isAskingOpen, setIsAskingOpen, isAskingQA, setIsAskingQA, animState, speech, suggestedQuestions, isShowingExamples, isAnsweringVoice,
    hasQaOverride: Boolean(isAskingQA || qaAnswer),
    clearQaAnswer: clearQaOnly,
    handleToggleLecture: choreography.handleToggleLecture,
    handleSelectBeat: choreography.handleSelectBeat,
    handleSelectFormulaCase: choreography.handleSelectFormulaCase,
    handleAnswerTrapCheck: choreography.handleAnswerTrapCheck,
    handleAskQuestion,
    handlePlaySample: (t: string) => { MobileAudioUnlocker.unlock(); onPlaySample(t); },
  };
}
