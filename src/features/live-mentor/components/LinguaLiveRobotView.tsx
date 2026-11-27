import React, { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
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
  onExit?: () => void;
}

export const LinguaLiveRobotView: React.FC<LinguaLiveRobotViewProps> = ({
  userName = "Professional",
  userLevel = "B1",
  profession = "Professional",
  learningGoal = "Professional Communication & Fluency",
  isActive = true,
  onExit,
}) => {
  React.useEffect(() => {
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
  } = useLiveRobotConversation(profile);

  const handleExit = () => {
    if (isCallActive) {
      void stopCall();
    }
    onExit?.();
  };

  return (
    <div
      className="relative h-dvh w-full overflow-hidden flex flex-col justify-between select-none"
      style={{ background: "var(--bg-app)", color: "var(--text-primary)" }}
    >
      {onExit && (
        <button
          type="button"
          onClick={handleExit}
          aria-label="Salir a módulos"
          title="Ir a módulos"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 h-9 w-9 rounded-full flex items-center justify-center opacity-45 hover:opacity-100 transition-opacity cursor-pointer"
          style={{ color: "var(--text-primary)" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}

      <section className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
        <div className="w-[min(94vw,78dvh)] h-[min(94vw,78dvh)] sm:w-[min(88vw,82dvh)] sm:h-[min(88vw,82dvh)] flex items-center justify-center">
          <ProfessorStageCanvas
            state={professorState}
            preset="tutor-stage"
            isActive={isActive}
            className="w-full h-full scale-[1.12] sm:scale-[1.18]"
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
