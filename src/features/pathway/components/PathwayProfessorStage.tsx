import React from "react";
import { ProfessorStageCanvas } from "../../../design-system/components/Professor3D";
import { PathwayNode, PathwayStepId } from "../../../domain/entities/LearningPathway";
import { useProfessorStageState } from "../hooks/useProfessorStageState";
import { MobileBoardInteractiveContext } from "./professor-board/LessonBoardBody";
import { ProfessorLessonBoard } from "./professor-board/ProfessorLessonBoard";

export interface PathwayProfessorStageProps {
  node: PathwayNode; step: PathwayStepId; isActive: boolean;
  isSpeakingAudio: boolean; isRecordingMic: boolean; isEvaluatingVoice?: boolean | undefined;
  isBuildCorrect: boolean; hasBuildMistake: boolean; isConquered: boolean;
  isMobileUnified?: boolean | undefined; mobileContext?: MobileBoardInteractiveContext | undefined;
  onPlaySample: (text: string) => void; onStepChange?: ((step: PathwayStepId) => void) | undefined;
  onSwitchToPractice?: (() => void) | undefined; initialOpenAsking?: boolean | undefined; className?: string;
}

export const PathwayProfessorStage: React.FC<PathwayProfessorStageProps> = ({
  node, step, isActive, isSpeakingAudio, isRecordingMic, isEvaluatingVoice = false,
  isBuildCorrect, hasBuildMistake, isConquered, isMobileUnified = false, mobileContext,
  onPlaySample, onStepChange, onSwitchToPractice, initialOpenAsking, className = "",
}) => {
  const s = useProfessorStageState({
    node, step, isActive, isSpeakingAudio, isRecordingMic, isEvaluatingVoice,
    isBuildCorrect, hasBuildMistake, isConquered, onPlaySample, onStepChange, initialOpenAsking,
  });

  const liveBoard = {
    nodeOrderIndex: node.orderIndex, activeBeat: s.activeBeat,
    activeFormulaCaseIndex: s.activeFormulaCaseIndex, activeExampleIndex: s.activeExampleIndex,
    isDictating: s.isDictating, isWaitingTrapCheck: s.isWaitingTrapCheck, trapCheckPassed: s.trapCheckPassed,
    isSpeakingEnglish: s.isSpeakingEnglishSegment, subtitleSpanish: s.liveSubtitleSpanish,
    onSelectBeat: s.handleSelectBeat, onSelectFormulaCase: s.handleSelectFormulaCase,
    onAnswerTrapCheck: s.handleAnswerTrapCheck,
  };

  return (
    <div className={`relative w-full h-full min-h-0 lg:w-[42%] xl:w-[45%] flex flex-col justify-end shrink-0 select-none overflow-hidden pb-20 lg:pb-0 ${className}`}>
      <div className="relative flex-1 min-h-[154px] w-full [container-type:size] flex items-end justify-center pointer-events-none z-0 lg:block lg:flex-none lg:min-h-0 lg:[container-type:normal] lg:absolute lg:inset-0 lg:h-full">
        <div className="pointer-events-auto shrink-0 w-[min(104cqw,118cqh)] h-[min(104cqw,118cqh)] mb-[calc(min(104cqw,118cqh)*-0.17)] transition-[width,height,margin] duration-300 ease-out lg:w-full lg:h-full lg:mb-0">
          <ProfessorStageCanvas
            state={s.animState} preset="tutor-stage" isActive={isActive}
            onTapProfessor={() => s.speech.sampleAudioText && onPlaySample(s.speech.sampleAudioText)}
          />
        </div>
      </div>

      <div className="relative z-10 w-full shrink-0 pointer-events-auto">
        <ProfessorLessonBoard
          lesson={node.lessonPayload} step={step} isMobileUnified={isMobileUnified}
          hasQaOverride={s.hasQaOverride} mobileContext={mobileContext} liveBoard={liveBoard}
          speech={s.speech} mode={s.mode} isShowingExamples={s.isShowingExamples}
          isDictating={s.isDictating} isSpeakingAudio={isSpeakingAudio || s.isAnsweringVoice}
          isAskingOpen={s.isAskingOpen} isAskingQA={s.isAskingQA} suggestedQuestions={s.suggestedQuestions}
          onModeChange={s.setMode} onToggleLecture={s.handleToggleLecture} onPlaySample={s.handlePlaySample}
          onToggleAsking={() => s.setIsAskingOpen((prev) => !prev)} onSubmitQuestion={s.handleAskQuestion}
          onDismissQaOverride={s.clearQaAnswer} onSwitchToPractice={onSwitchToPractice}
        />
      </div>
    </div>
  );
};
export default PathwayProfessorStage;
