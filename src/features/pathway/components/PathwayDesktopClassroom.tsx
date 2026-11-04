import React from "react";
import { BridgeModuleTarget, LearningPathway, PathwayNode } from "../../../domain/entities/LearningPathway";
import { CefrLevelCode } from "../../conversation/services/dynamicQuestionService";
import { usePathwayStageSession } from "../hooks/usePathwayStageSession";
import { GuideSection } from "./knowledge/GuideHeaderTitle";
import { PathwayBottomBar } from "./PathwayBottomBar";
import { PathwayLessonHeader } from "./PathwayLessonHeader";
import { PathwayBlockBuilderStep } from "./stages/PathwayBlockBuilderStep";
import { PathwayVisualRuleStep } from "./stages/PathwayVisualRuleStep";
import { PathwayVoiceUnlockStep } from "./stages/PathwayVoiceUnlockStep";

export interface PathwayDesktopClassroomProps {
  pathway: LearningPathway; activeNode: PathwayNode; activeNodeIndex: number;
  masteredCount: number; roleName: string; session: ReturnType<typeof usePathwayStageSession>;
  canAdvanceNode: boolean; onSelectLevel?: ((level: CefrLevelCode) => void) | undefined;
  onOpenCurriculum: () => void; onOpenAskTutor: () => void;
  onOpenGuideSection: (section: GuideSection) => void;
  onNextNode?: (() => void) | undefined; onPrevAction?: (() => void) | undefined;
  onNextAction?: (() => void) | undefined; onNavigateModule?: ((target: BridgeModuleTarget) => void) | undefined;
}

export const PathwayDesktopClassroom: React.FC<PathwayDesktopClassroomProps> = ({
  pathway, activeNode, activeNodeIndex, masteredCount, roleName, session, canAdvanceNode,
  onSelectLevel, onOpenCurriculum, onOpenAskTutor, onOpenGuideSection,
  onNextNode, onPrevAction, onNextAction, onNavigateModule,
}) => {
  const lesson = activeNode.lessonPayload!;

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 min-w-0 z-10 order-1">
      <PathwayLessonHeader
        nodeIndex={activeNodeIndex} totalNodes={pathway.nodes.length} masteredCount={masteredCount}
        currentLevel={pathway.cefrLevel} roleName={roleName} activeStep={session.step}
        onSelectStep={session.setStep} onSelectLevel={onSelectLevel} onOpenCurriculum={onOpenCurriculum}
        onOpenTutor={() => onOpenAskTutor()} onOpenAnatomy={() => onOpenGuideSection("structure")}
        onOpenKnowledge={(tab) => onOpenGuideSection(tab === "phonetics" ? "phonetics" : "structure")}
        nodeTitle={activeNode.title}
      />
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 flex flex-col justify-center">
        {session.step === "RULE" && (
          <PathwayVisualRuleStep
            title={activeNode.title} focus={activeNode.competencyFocus} lesson={lesson}
            speakingText={session.speakingText} onPlayAudio={session.playAudio}
            onContinueToBuild={() => session.setStep("BUILD")}
            onOpenAnatomy={() => onOpenGuideSection("structure")}
            onOpenKnowledge={(tab) => onOpenGuideSection(tab === "phonetics" ? "phonetics" : "structure")}
          />
        )}
        {session.step === "BUILD" && (
          <PathwayBlockBuilderStep
            challenge={lesson.blockChallenge} availableChips={session.availableChips} placedChips={session.placedChips}
            isBuildCorrect={session.isBuildCorrect} hasBuildMistake={session.hasBuildMistake}
            onTapAvailable={session.tapAvailableChip} onRemovePlaced={session.removePlacedChip}
            onReset={session.resetBlocks} onContinueToSpeak={() => session.setStep("SPEAK")}
          />
        )}
        {session.step === "SPEAK" && (
          <PathwayVoiceUnlockStep
            lesson={lesson} isNodeMastered={activeNode.status === "MASTERED"} isCompletedBanner={session.isCompletedBanner}
            isRecording={session.isRecording} isEvaluatingVoice={session.isEvaluatingVoice}
            isSavingCompletion={session.isSavingCompletion} canSkipWithoutMic={session.canSkipWithoutMic}
            failedAttempts={session.failedVoiceAttempts} spokenTranscript={session.spokenTranscript}
            speakingText={session.speakingText} pronunciationResult={session.pronunciationResult}
            onPlayAudio={session.playAudio} onToggleRecording={() => void session.toggleRecording()}
            onCompleteWithoutMic={() => void session.completeWithoutMic()}
            onNextFoundation={canAdvanceNode ? onNextNode : undefined} onBridgeNavigate={onNavigateModule}
          />
        )}
      </div>
      <PathwayBottomBar
        activeStep={session.step} nodeIndex={activeNodeIndex} totalNodes={pathway.nodes.length}
        masteryIndex={pathway.masteryIndex} onPrev={onPrevAction} onNext={onNextAction}
        nextLabel={session.step === "SPEAK" ? "Siguiente clase" : "Siguiente paso"}
      />
    </div>
  );
};
