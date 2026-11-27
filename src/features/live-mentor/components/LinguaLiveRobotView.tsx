import React, { useEffect, useMemo } from "react";
import { ProfessorStageCanvas } from "../../../design-system/components/Professor3D/ProfessorStageCanvas";
import { warmProfessorModelCache } from "../../../design-system/components/Professor3D/professorModelCacheService";
import { AiUseCaseModalsHost } from "../../../shared/components/AiUseCaseModalsHost";
import { MicHardwareRecoveryModal } from "../../conversation/components/MicHardwareRecoveryModal";
import { useLiveRobotConversation } from "../hooks/useLiveRobotConversation";
import { LiveCallPrimaryButton } from "./LiveCallPrimaryButton";
import { LiveSessionSummaryCard } from "./LiveSessionSummaryCard";

export interface LinguaLiveRobotViewProps {
  userName?: string;
  userLevel?: string;
  profession?: string;
  learningGoal?: string;
  isActive?: boolean;
  onCallActiveChange?: (active: boolean) => void;
}

export const LinguaLiveRobotView: React.FC<LinguaLiveRobotViewProps> = ({
  userName = "Professional",
  userLevel = "B1",
  profession = "Professional",
  learningGoal = "Professional Communication & Fluency",
  isActive = true,
  onCallActiveChange,
}) => {
  useEffect(() => {
    warmProfessorModelCache();
  }, []);

  const profile = useMemo(
    () => ({ userName, cefrLevel: userLevel, profession, learningGoal }),
    [userName, userLevel, profession, learningGoal],
  );

  const {
    phase,
    isCallActive,
    professorState,
    micLevel,
    summary,
    dismissSummary,
    startCall,
    stopCall,
    micModalOpen,
    closeMicModal,
    modalController,
  } = useLiveRobotConversation(profile, isActive);

  useEffect(() => {
    onCallActiveChange?.(isCallActive);
  }, [isCallActive, onCallActiveChange]);

  useEffect(() => {
    if (!isActive && isCallActive) {
      void stopCall();
    }
  }, [isActive, isCallActive, stopCall]);

  return (
    <div
      className="relative h-dvh w-full overflow-hidden flex flex-col items-center justify-center gap-4 sm:gap-6 pb-20 lg:pb-2 select-none"
      style={{ background: "var(--bg-app)", color: "var(--text-primary)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, var(--accent-violet-subtle) 0%, transparent 56%)",
        }}
      />

      <section className="relative z-10 flex items-center justify-center shrink-0">
        <div className="w-[min(78vw,46dvh)] h-[min(78vw,46dvh)] sm:w-[min(62vw,52dvh)] sm:h-[min(62vw,52dvh)] lg:w-[min(56dvh,490px)] lg:h-[min(56dvh,490px)] xl:w-[min(58dvh,530px)] xl:h-[min(58dvh,530px)] flex items-center justify-center">
          <ProfessorStageCanvas
            state={professorState}
            preset="tutor-stage"
            isActive={isActive}
            className="w-full h-full"
          />
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
    </div>
  );
};
