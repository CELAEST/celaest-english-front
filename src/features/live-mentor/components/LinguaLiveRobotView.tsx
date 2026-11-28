import React, { useEffect, useMemo, useState } from "react";
import { ProfessorStageCanvas } from "../../../design-system/components/Professor3D/ProfessorStageCanvas";
import { warmProfessorModelCache } from "../../../design-system/components/Professor3D/professorModelCacheService";
import { AiUseCaseModalsHost } from "../../../shared/components/AiUseCaseModalsHost";
import { MicHardwareRecoveryModal } from "../../conversation/components/MicHardwareRecoveryModal";
import {
  getStoredLiveBackdrop,
  LiveBackdropId,
  setStoredLiveBackdrop,
} from "../data/liveStageBackdrops";
import { useLiveRobotConversation } from "../hooks/useLiveRobotConversation";
import { LiveBackdropPicker } from "./LiveBackdropPicker";
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
  const [backdropId, setBackdropId] = useState<LiveBackdropId>(() => getStoredLiveBackdrop());

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

  const handleSelectBackdrop = (id: LiveBackdropId) => {
    setBackdropId(id);
    setStoredLiveBackdrop(id);
  };

  return (
    <div
      className="relative h-dvh w-full overflow-hidden flex flex-col items-center justify-between pt-16 pb-[88px] px-4 lg:pt-8 lg:pb-10 lg:px-28 select-none"
      style={{ background: "var(--bg-app)", color: "var(--text-primary)" }}
    >
      <LiveStageBackdrop
        backdropId={backdropId}
        phase={phase}
        micLevel={micLevel}
        speakerLevel={speakerLevel}
      />

      <LiveBackdropPicker
        selectedId={backdropId}
        onSelect={handleSelectBackdrop}
        isCallActive={isCallActive}
      />

      <section className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center py-2 pointer-events-none">
        <div className="h-full w-full max-w-[min(94vw,640px)] max-h-[min(100%,94vw)] sm:max-w-[min(82vw,680px)] sm:max-h-[min(100%,82vw)] lg:max-w-[min(72vw,820px)] lg:max-h-[min(100%,72vw)] flex items-center justify-center">
          <ProfessorStageCanvas
            state={professorState}
            preset="tutor-stage"
            isActive={isActive}
            className="w-full h-full"
          />
        </div>
      </section>

      <div className="relative z-20 shrink-0 pt-2 lg:pt-4">
        <LiveCallPrimaryButton
          phase={phase}
          micLevel={micLevel}
          speakerLevel={speakerLevel}
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
