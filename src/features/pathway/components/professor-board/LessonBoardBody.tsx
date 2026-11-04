import React from "react";
import { BridgeModuleTarget, PathwayLessonPayload, PathwayStepId } from "../../../../domain/entities/LearningPathway";
import { usePathwayStageSession } from "../../hooks/usePathwayStageSession";
import { LiveClassBeatId } from "../../services/PathwayLectureEngine";
import { LessonTypedText } from "./LessonTypedText";
import { LessonVisualExamples } from "./LessonVisualExamples";
import { MobileLiveRuleStage } from "./live-scenes/MobileLiveRuleStage";
import { MobileBoardBuildStep } from "./MobileBoardBuildStep";
import { MobileBoardSpeakStep } from "./MobileBoardSpeakStep";

export interface MobileBoardInteractiveContext {
  session: ReturnType<typeof usePathwayStageSession>;
  isConquered: boolean;
  onNextFoundation?: (() => void) | undefined;
  onBridgeNavigate?: ((target: BridgeModuleTarget) => void) | undefined;
}

export interface LiveBoardState {
  nodeOrderIndex: number;
  activeBeat: LiveClassBeatId;
  activeFormulaCaseIndex: number;
  activeExampleIndex: number;
  isDictating: boolean;
  isWaitingTrapCheck: boolean;
  trapCheckPassed: boolean;
  isSpeakingEnglish: boolean;
  subtitleSpanish?: string | undefined;
  onSelectBeat: (beat: LiveClassBeatId) => void;
  onSelectFormulaCase: (index: number) => void;
  onAnswerTrapCheck: (isCorrect: boolean) => void;
}

export interface LessonBoardBodyProps {
  lesson?: PathwayLessonPayload | undefined; step: PathwayStepId;
  isMobileUnified: boolean; isShowingExamples: boolean; hasQaOverride: boolean;
  fullText: string; typedText: string; isTyping: boolean;
  speakingSampleText: string | null;
  mobileContext?: MobileBoardInteractiveContext | undefined;
  liveBoard?: LiveBoardState | undefined;
  onFinishTyping: () => void; onPlaySample: (text: string) => void;
  onDismissQaOverride?: (() => void) | undefined;
}

export const LessonBoardBody: React.FC<LessonBoardBodyProps> = ({
  lesson, step, isMobileUnified, isShowingExamples, hasQaOverride,
  fullText, typedText, isTyping, speakingSampleText, mobileContext, liveBoard,
  onFinishTyping, onPlaySample, onDismissQaOverride,
}) => {
  if (hasQaOverride) {
    return (
      <div className="space-y-1.5">
        <LessonTypedText fullText={fullText} typedText={typedText} isTyping={isTyping} onClick={onFinishTyping} />
        {isMobileUnified && onDismissQaOverride && (
          <button type="button" onClick={onDismissQaOverride} className="text-[11px] font-mono text-[#A27FF3] hover:text-white cursor-pointer">
            ← Volver a la pizarra viva
          </button>
        )}
      </div>
    );
  }

  if (isShowingExamples && lesson && (!isMobileUnified || step !== "RULE")) {
    return <LessonVisualExamples lesson={lesson} speakingText={speakingSampleText} onPlayAudio={onPlaySample} />;
  }

  if (isMobileUnified && lesson && mobileContext) {
    const { session, isConquered, onNextFoundation, onBridgeNavigate } = mobileContext;
    if (step === "RULE" && liveBoard) {
      return (
        <MobileLiveRuleStage
          lesson={lesson} nodeOrderIndex={liveBoard.nodeOrderIndex} activeBeat={liveBoard.activeBeat}
          activeFormulaCaseIndex={liveBoard.activeFormulaCaseIndex}
          activeExampleIndex={liveBoard.activeExampleIndex} isDictating={liveBoard.isDictating}
          isSpeakingEnglish={liveBoard.isSpeakingEnglish} speakingSampleText={speakingSampleText}
          trapCheckPassed={liveBoard.trapCheckPassed} subtitleSpanish={liveBoard.subtitleSpanish}
          onSelectBeat={liveBoard.onSelectBeat} onSelectFormulaCase={liveBoard.onSelectFormulaCase}
          onAnswerTrapCheck={liveBoard.onAnswerTrapCheck} onPlaySample={onPlaySample}
        />
      );
    }
    if (step === "BUILD") {
      return <MobileBoardBuildStep challenge={lesson.blockChallenge} availableChips={session.availableChips} placedChips={session.placedChips} isBuildCorrect={session.isBuildCorrect} hasBuildMistake={session.hasBuildMistake} onTapAvailable={session.tapAvailableChip} onRemovePlaced={session.removePlacedChip} onReset={session.resetBlocks} onContinueToSpeak={() => session.setStep("SPEAK")} />;
    }
    if (step === "SPEAK") {
      return <MobileBoardSpeakStep lesson={lesson} conquered={isConquered} isRecording={session.isRecording} isEvaluatingVoice={session.isEvaluatingVoice} isSavingCompletion={session.isSavingCompletion} canSkipWithoutMic={session.canSkipWithoutMic} failedAttempts={session.failedVoiceAttempts} spokenTranscript={session.spokenTranscript} speakingText={session.speakingText} pronunciationResult={session.pronunciationResult} onPlayAudio={session.playAudio} onToggleRecording={() => void session.toggleRecording()} onCompleteWithoutMic={() => void session.completeWithoutMic()} onNextFoundation={onNextFoundation} onBridgeNavigate={onBridgeNavigate} />;
    }
  }

  return <LessonTypedText fullText={fullText} typedText={typedText} isTyping={isTyping} onClick={onFinishTyping} />;
};
