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
      className="relative h-dvh w-full overflow-hidden flex flex-col items-center justify-center pb-20 lg:pb-6 select-none"
      style={{ background: "var(--bg-app)", color: "var(--text-primary)" }}
    >
      <LiveStageBackdrop phase={phase} micLevel={micLevel} speakerLevel={speakerLevel} />

      <section className="relative z-10 flex items-center justify-center shrink-0">
        <div className="w-[min(96vw,64dvh)] h-[min(96vw,64dvh)] sm:w-[min(78vw,68dvh)] sm:h-[min(78vw,68dvh)] lg:w-[min(70vw,74dvh)] lg:h-[min(70vw,74dvh)] max-w-[680px] max-h-[680px] flex items-center justify-center">
          <ProfessorStageCanvas
            state={professorState}
            preset="tutor-stage"
            isActive={isActive}
            className="w-full h-full scale-[1.08] sm:scale-[1.06]"
          />
        </div>
      </section>

      <div className="relative z-20 -mt-3 sm:-mt-5">
        <LiveCallPrimaryButton
          phase={phase}
          micLevel={micLevel}
          onStart={() => void startCall()}
          onStop={() => void stopCall()}
        />
      </div>

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
