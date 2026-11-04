import { useEffect, useMemo, useRef, useState } from "react";
import { ProfessorAnimState } from "../../../design-system/components/Professor3D";
import { PathwayNode, PathwayStepId } from "../../../domain/entities/LearningPathway";
import { MobileAudioUnlocker } from "../../conversation/services/speechSynthesisService";
import { PathwayQAService, ProfessorAnswer } from "../services/PathwayQAService";
import { buildProfessorSpeech, ProfessorBoardMode } from "../services/professorSpeech";
import { useLiveClassChoreography } from "./useLiveClassChoreography";

export interface UseProfessorStageStateOptions {
  node: PathwayNode; step: PathwayStepId; isActive: boolean; isSpeakingAudio: boolean; isRecordingMic: boolean;
  isEvaluatingVoice?: boolean | undefined;
  isBuildCorrect: boolean; hasBuildMistake: boolean; isConquered: boolean; onPlaySample: (text: string) => void;
  onStepChange?: ((step: PathwayStepId) => void) | undefined; initialOpenAsking?: boolean | undefined;
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
  const cancelQARef = useRef<(() => void) | null>(null);

  const clearQaOnly = () => {
    cancelQARef.current?.(); cancelQARef.current = null;
    setIsAnsweringVoice(false); setQaAnswer(null);
  };

  const choreography = useLiveClassChoreography({
    node, step, isActive, initialOpenAsking, onStepChange,
    onBeforeLectureStart: () => { clearQaOnly(); setMode("lesson"); },
  });

  useEffect(() => { if (initialOpenAsking) setIsAskingOpen(true); }, [initialOpenAsking]);
  useEffect(() => { setMode("lesson"); clearQaOnly(); }, [step, node.id]);

  const handleAskQuestion = async (question: string) => {
    MobileAudioUnlocker.unlock();
    choreography.stopAllLecture();
    clearQaOnly();
    setIsAskingOpen(false);
    setIsAskingQA(true);
    try {
      const answer = await PathwayQAService.askProfessor({ question, node });
      setQaAnswer(answer); setIsAskingQA(false); setIsAnsweringVoice(true);
      cancelQARef.current = await PathwayQAService.playAnswer(answer, undefined, () => {
        setIsAnsweringVoice(false); cancelQARef.current = null;
      });
    } catch { setIsAskingQA(false); setIsAnsweringVoice(false); }
  };

  const animState: ProfessorAnimState = useMemo(() => {
    if (isRecordingMic) return "listening";
    if (isAskingQA || isEvaluatingVoice) return "thinking";
    if (isConquered || choreography.isTrapCelebrating || (step === "BUILD" && isBuildCorrect)) return "celebrating";
    if (isSpeakingAudio || choreography.isDictating || isAnsweringVoice) return "explaining";
    return "idle";
  }, [
    isRecordingMic, isAskingQA, isEvaluatingVoice, isConquered,
    choreography.isTrapCelebrating, choreography.isDictating, step, isBuildCorrect, isSpeakingAudio, isAnsweringVoice,
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
    activeBeat: choreography.activeBeat,
    activeFormulaCaseIndex: choreography.activeFormulaCaseIndex,
    activeExampleIndex: choreography.activeExampleIndex,
    isWaitingTrapCheck: choreography.isWaitingTrapCheck, trapCheckPassed: choreography.trapCheckPassed,
    isSpeakingEnglishSegment: choreography.isDictating && choreography.lectureSegment?.language === "en",
    liveSubtitleSpanish: choreography.lectureSegment?.subtitleSpanish,
    isAskingOpen, setIsAskingOpen, isAskingQA, animState, speech, suggestedQuestions, isShowingExamples, isAnsweringVoice,
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
