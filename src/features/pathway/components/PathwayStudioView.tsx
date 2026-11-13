import React, { useEffect, useMemo, useState } from "react";
import { warmProfessorModelCache } from "../../../design-system/components/Professor3D/professorModelCacheService";
import { BridgeModuleTarget } from "../../../domain/entities/LearningPathway";
import { AiUseCaseModalsHost } from "../../../shared/components/AiUseCaseModalsHost";
import { CefrLevelCode } from "../../conversation/services/dynamicQuestionService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { useIsDesktopViewport } from "../hooks/useIsDesktopViewport";
import { useLearningPathway } from "../hooks/useLearningPathway";
import { usePathwayAiModals } from "../hooks/usePathwayAiModals";
import { usePathwayStageSession } from "../hooks/usePathwayStageSession";
import { useProfessorStageState } from "../hooks/useProfessorStageState";
import { PhoneticAudioService } from "../services/PhoneticAudioService";
import { GuideSection } from "./knowledge/GuideHeaderTitle";
import { PathwayAnatomyModal } from "./knowledge/PathwayAnatomyModal";
import { PathwayCurriculumSheet } from "./PathwayCurriculumSheet";
import { PathwayDesktopClassroom } from "./PathwayDesktopClassroom";
import { PathwayMobileTopBar } from "./PathwayMobileTopBar";
import { PathwayProfessorStage } from "./PathwayProfessorStage";
import { PathwaySkeleton } from "./PathwaySkeleton";
import { LiveBoardState } from "./professor-board/LessonBoardBody";
import { AppEcosystemTour } from "./tour/AppEcosystemTour";

export interface PathwayStudioViewProps {
  roleName?: string | undefined; userLevel?: string | undefined; learningGoal?: string | undefined;
  onSelectLevel?: ((level: CefrLevelCode) => void) | undefined; onBackToWorkspace?: (() => void) | undefined;
  onNavigateModule?: ((target: BridgeModuleTarget) => void) | undefined; isActive?: boolean | undefined;
}

export const PathwayStudioView: React.FC<PathwayStudioViewProps> = ({
  roleName = "Professional", userLevel = "A1", learningGoal = "Professional Communication & Fluency",
  onSelectLevel, onNavigateModule, isActive = true,
}) => {
  const isDesktop = useIsDesktopViewport();
  const [curriculumOpen, setCurriculumOpen] = useState(false);
  const [guideSection, setGuideSection] = useState<GuideSection | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const {
    controller: modalController,
    byokOpen,
    paywallOpen,
    openPaywallModal,
    closePaywall,
    openByokModal,
    recoveryState,
    handleAiFailure,
  } = usePathwayAiModals();
  const {
    entitlement,
    isEntitlementLoading,
    canAccessNode,
    refreshEntitlement,
    isByokMode,
  } = modalController;
  const hasBlockingOverlay = Boolean(
    curriculumOpen || guideSection !== null || paywallOpen || byokOpen || tourOpen || recoveryState.isOpen,
  );
  const { pathway, activeNode, activeNodeIndex, isGeneratingAi, selectNode, personalizeWithAi, completeActiveNode } = useLearningPathway({ profession: roleName, cefrLevel: userLevel, learningGoal });

  const session = usePathwayStageSession(activeNode, roleName, completeActiveNode, pathway.cefrLevel);
  useEffect(() => { warmProfessorModelCache(); }, []);
  useEffect(() => {
    if (hasBlockingOverlay || guideSection === null) {
      PhoneticAudioService.stop();
    }
  }, [hasBlockingOverlay, guideSection]);
  useEffect(() => {
    if (isByokMode) {
      void providerKeyVault.hasAnyConfiguredKey().then((hasKey) => {
        if (!hasKey) openByokModal("promo_byok");
      });
    }
  }, [isByokMode, openByokModal]);
  useEffect(() => {
    if (entitlement.hasAccess) { closePaywall(); return; }
    if (!isEntitlementLoading && activeNodeIndex > 0 && pathway.nodes[0]) {
      selectNode(pathway.nodes[0].id);
      openPaywallModal();
    } else if (!isEntitlementLoading && (entitlement.status === "revoked" || entitlement.status === "suspended" || entitlement.status === "cancelled" || entitlement.status === "expired")) {
      openPaywallModal();
    }
  }, [entitlement.hasAccess, entitlement.status, isEntitlementLoading, activeNodeIndex, pathway.nodes, selectNode, openPaywallModal, closePaywall]);
  if (!activeNode?.lessonPayload) return <PathwaySkeleton />;

  const handleSelectNodeGated = (nodeId: string) => {
    const idx = pathway.nodes.findIndex((n) => n.id === nodeId);
    if (idx > 0 && !canAccessNode(idx)) { openPaywallModal(); return; }
    selectNode(nodeId);
    if (idx > 0) {
      void refreshEntitlement().then((fresh) => {
        if (!fresh.hasAccess && pathway.nodes[0]) { selectNode(pathway.nodes[0].id); openPaywallModal(); }
      });
    }
  };

  const masteredCount = pathway.nodes.filter((n) => n.status === "MASTERED" || n.status === "CONSOLIDATED").length;
  const nextUnlocked = pathway.nodes[activeNodeIndex + 1];
  const isConquered = session.isCompletedBanner || activeNode.status === "MASTERED";
  const cefrOrder: CefrLevelCode[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const currentLevelIdx = cefrOrder.indexOf(pathway.cefrLevel as CefrLevelCode);
  const nextLevel =
    currentLevelIdx >= 0 && currentLevelIdx < cefrOrder.length - 1
      ? cefrOrder[currentLevelIdx + 1]
      : undefined;
  const isLastNode = activeNodeIndex === pathway.nodes.length - 1;
  const canAdvanceToNextLevel = Boolean(isLastNode && isConquered && nextLevel && onSelectLevel);
  const canAdvanceNode = Boolean((nextUnlocked && nextUnlocked.status !== "LOCKED") || canAdvanceToNextLevel);
  const professorState = useProfessorStageState({
    node: activeNode, step: session.step, cefrLevel: pathway.cefrLevel, isActive, hasBlockingOverlay,
    isSpeakingAudio: session.speakingText !== null,
    isRecordingMic: session.isRecording, isEvaluatingVoice: session.isEvaluatingVoice,
    isBuildCorrect: session.isBuildCorrect, hasBuildMistake: session.hasBuildMistake,
    isConquered, onPlaySample: session.playAudio, onStepChange: session.setStep,
    onAiError: handleAiFailure, initialOpenAsking: false,
  });

  const handlePersonalizeAi = () => {
    void personalizeWithAi().catch((err) => {
      handleAiFailure(err, handlePersonalizeAi, `Personalizar ruta ${pathway.cefrLevel}`);
    });
  };

  const liveBoard: LiveBoardState = useMemo(() => ({
    nodeOrderIndex: activeNode.orderIndex, activeBeat: professorState.activeBeat,
    activeFormulaCaseIndex: professorState.activeFormulaCaseIndex,
    activeExampleIndex: professorState.activeExampleIndex,
    formulaRevealCount: professorState.formulaRevealCount,
    trapPhase: professorState.trapPhase,
    isDictating: professorState.isDictating,
    isWaitingTrapCheck: professorState.isWaitingTrapCheck,
    trapCheckPassed: professorState.trapCheckPassed,
    isSpeakingEnglish: professorState.isSpeakingEnglishSegment,
    subtitleSpanish: professorState.liveSubtitleSpanish,
    onSelectBeat: professorState.handleSelectBeat,
    onSelectFormulaCase: professorState.handleSelectFormulaCase,
    onAnswerTrapCheck: professorState.handleAnswerTrapCheck,
  }), [activeNode.orderIndex, professorState]);

  const handleNextFoundation = canAdvanceToNextLevel
    ? () => onSelectLevel!(nextLevel!)
    : nextUnlocked && nextUnlocked.status !== "LOCKED"
      ? () => handleSelectNodeGated(nextUnlocked.id)
      : undefined;
  const handlePrev = session.step === "SPEAK" ? () => session.setStep("BUILD") : session.step === "BUILD" ? () => session.setStep("RULE") : activeNodeIndex > 0 ? () => handleSelectNodeGated(pathway.nodes[activeNodeIndex - 1]!.id) : undefined;
  const handleNext = session.step === "RULE" ? () => session.setStep("BUILD") : session.step === "BUILD" ? () => session.setStep("SPEAK") : handleNextFoundation;

  return (
    <div className="relative flex flex-col lg:flex-row h-full w-full bg-[#000001] px-3 sm:px-6 lg:px-8 xl:px-10 pt-2 sm:pt-4 pb-0 lg:pb-4 gap-2 lg:gap-6 xl:gap-8 overflow-hidden select-none">
      {isDesktop ? (
        <PathwayDesktopClassroom
          pathway={pathway} activeNode={activeNode} activeNodeIndex={activeNodeIndex} masteredCount={masteredCount}
          roleName={roleName} session={session} canAdvanceNode={canAdvanceNode} onSelectLevel={onSelectLevel}
          onOpenCurriculum={() => setCurriculumOpen(true)} onOpenAskTutor={() => professorState.setIsAskingOpen((p) => !p)}
          onOpenGuideSection={setGuideSection} onNextNode={handleNextFoundation}
          nextLevelCode={canAdvanceToNextLevel ? nextLevel : undefined}
          onPrevAction={handlePrev} onNextAction={handleNext} onNavigateModule={onNavigateModule}
          liveBoard={liveBoard}
        />
      ) : (
        <PathwayMobileTopBar nodeIndex={activeNodeIndex} currentLevel={pathway.cefrLevel} activeStep={session.step} onSelectStep={session.setStep} onOpenCurriculum={() => setCurriculumOpen(true)} onOpenGuide={() => setGuideSection("structure")} onSelectLevel={onSelectLevel} />
      )}
      <PathwayProfessorStage
        node={activeNode} cefrLevel={pathway.cefrLevel} step={session.step} isActive={isActive} isSpeakingAudio={session.speakingText !== null}
        isRecordingMic={session.isRecording} isMobileUnified={!isDesktop}
        mobileContext={!isDesktop ? { session, isConquered, onNextFoundation: handleNextFoundation, onBridgeNavigate: onNavigateModule } : undefined}
        onPlaySample={session.playAudio}
        onSwitchToPractice={() => { professorState.setIsAskingOpen(false); session.setStep("BUILD"); }}
        stageState={professorState} liveBoard={liveBoard} onAiError={handleAiFailure}
        className="order-2 flex-1 lg:flex-none"
      />
      <PathwayCurriculumSheet open={curriculumOpen} pathway={pathway} activeNodeId={activeNode.id} isGeneratingAi={isGeneratingAi} onClose={() => setCurriculumOpen(false)} onSelectNode={handleSelectNodeGated} onPersonalizeAi={handlePersonalizeAi} />
      <PathwayAnatomyModal isOpen={guideSection !== null} onClose={() => setGuideSection(null)} initialSection={guideSection || "structure"} />
      <AiUseCaseModalsHost controller={modalController} />
      <AppEcosystemTour
        isOpen={tourOpen}
        userId={roleName}
        onClose={() => setTourOpen(false)}
      />
    </div>
  );
};
