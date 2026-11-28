import React, { useEffect, useMemo } from "react";
import { ProfessorStageCanvas } from "../../../design-system/components/Professor3D/ProfessorStageCanvas";
import { warmProfessorModelCache } from "../../../design-system/components/Professor3D/professorModelCacheService";
import { AiUseCaseModalsHost } from "../../../shared/components/AiUseCaseModalsHost";
import { MicHardwareRecoveryModal } from "../../conversation/components/MicHardwareRecoveryModal";
import { useLiveRobotConversation } from "../hooks/useLiveRobotConversation";
import { LiveCallPrimaryButton } from "./LiveCallPrimaryButton";
import { LiveSessionSummaryCard } from "./LiveSessionSummaryCard";
import { LiveStageBackdrop } from "./LiveStageBackdrop";

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
    speakerLevel,
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
      className="relative h-dvh w-full overflow-hidden flex flex-col items-center justify-center gap-6 sm:gap-7 pb-20 lg:pb-6 select-none"
      style={{ background: "var(--bg-app)", color: "var(--text-primary)" }}
    >
      <LiveStageBackdrop phase={phase} micLevel={micLevel} speakerLevel={speakerLevel} />

      <section className="relative z-10 flex items-center justify-center shrink-0">
        <div
          className="w-[min(88vw,52dvh)] h-[min(88vw,52dvh)] sm:w-[min(64vw,58dvh)] sm:h-[min(64vw,58dvh)] lg:w-[min(56vw,64dvh)] lg:h-[min(56vw,64dvh)] max-w-[580px] max-h-[580px] flex items-center justify-center"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)",
          }}
        >
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
        speakerLevel={speakerLevel}
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
