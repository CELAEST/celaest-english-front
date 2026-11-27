import React, { useMemo } from "react";
import { ProfessorStageCanvas } from "../../../design-system/components/Professor3D/ProfessorStageCanvas";
import { warmProfessorModelCache } from "../../../design-system/components/Professor3D/professorModelCacheService";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { AiUseCaseModalsHost } from "../../../shared/components/AiUseCaseModalsHost";
import { useLinguaEntitlement } from "../../../shared/hooks/useLinguaEntitlement";
import { MicHardwareRecoveryModal } from "../../conversation/components/MicHardwareRecoveryModal";
import { useLiveRobotConversation } from "../hooks/useLiveRobotConversation";
import { LiveCallPrimaryButton } from "./LiveCallPrimaryButton";
import { LiveRobotTopBar } from "./LiveRobotTopBar";
import { LiveSessionSummaryCard } from "./LiveSessionSummaryCard";

export interface LinguaLiveRobotViewProps {
  userName?: string;
  userLevel?: string;
  profession?: string;
  learningGoal?: string;
  onSignOut?: () => void;
}

export const LinguaLiveRobotView: React.FC<LinguaLiveRobotViewProps> = ({
  userName = "Professional",
  userLevel = "B1",
  profession = "Professional",
  learningGoal = "Professional Communication & Fluency",
  onSignOut,
}) => {
  React.useEffect(() => {
    warmProfessorModelCache();
  }, []);

  const { isTrial, trialDaysRemaining, entitlement } = useLinguaEntitlement();
  const profile = useMemo(
    () => ({ userName, cefrLevel: userLevel, profession, learningGoal }),
    [userName, userLevel, profession, learningGoal],
  );

  const {
    phase,
    professorState,
    liveCaption,
    userDraft,
    micLevel,
    summary,
    dismissSummary,
    startCall,
    stopCall,
    micModalOpen,
    closeMicModal,
    modalController,
  } = useLiveRobotConversation(profile);

  const handleSignOut = () => {
    void SupabaseAuthAdapter.getInstance().logout().finally(() => {
      onSignOut?.();
    });
  };

  const activeText = phase === "user_listening" && userDraft ? userDraft : liveCaption;

  return (
    <main
      className="relative h-dvh w-full overflow-hidden flex flex-col justify-between"
      style={{ background: "var(--bg-app)", color: "var(--text-primary)" }}
    >
      <LiveRobotTopBar
        isTrial={isTrial}
        trialDaysRemaining={trialDaysRemaining}
        aiRequestsUsed={entitlement.aiRequestsUsed}
        aiRequestsLimit={entitlement.aiRequestsLimit}
        isByokMode={modalController.isByokMode}
        onOpenPaywall={() => modalController.openPaywallModal()}
        onOpenByok={() => modalController.openByokModal("promo_byok")}
        onSignOut={handleSignOut}
      />

      <section className="relative flex-1 min-h-0 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[420px] sm:max-w-[480px] aspect-square max-h-[58dvh]">
          <ProfessorStageCanvas state={professorState} preset="tutor-stage" isActive={true} />
        </div>

        <div className="min-h-[3.25rem] max-w-xl px-4 text-center flex items-center justify-center">
          {activeText && (
            <p
              className="text-sm sm:text-base font-light leading-relaxed line-clamp-2"
              style={{ color: "var(--text-primary)" }}
            >
              {activeText}
            </p>
          )}
        </div>
      </section>

      <LiveCallPrimaryButton
        phase={phase}
        micLevel={micLevel}
        onStart={() => void startCall()}
        onStop={() => void stopCall()}
      />

      {summary && (
        <LiveSessionSummaryCard
          summary={summary}
          onDismiss={dismissSummary}
          onRestart={() => void startCall()}
        />
      )}

      <MicHardwareRecoveryModal
        isOpen={micModalOpen}
        onClose={closeMicModal}
        onResume={() => {
          closeMicModal();
          void startCall();
        }}
      />
      <AiUseCaseModalsHost controller={modalController} />
    </main>
  );
};
