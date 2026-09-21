import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ConversationRightPanel } from "./ConversationRightPanel";
import { ConversationOrbHero } from "./ConversationOrbHero";
import { ConversationPromptArea } from "./ConversationPromptArea";
import { ConversationWaveformSpectrum } from "./ConversationWaveformSpectrum";
import { ConversationMicControl } from "./ConversationMicControl";
import { ConversationAudioSettingsModal } from "./ConversationAudioSettingsModal";
import { MicHardwareRecoveryModal } from "./MicHardwareRecoveryModal";
import { AiInfrastructureRecoveryModal } from "../../lab/components/AiInfrastructureRecoveryModal";
import { InterviewAnalysisModal } from "./InterviewAnalysisModal";
import { ResponsiveInterviewHUD } from "./ResponsiveInterviewHUD";
import { SessionCardsSidenav } from "./SessionCardsSidenav";
import { useInterviewSession } from "../hooks/useInterviewSession";

import { CefrLevelCode, normalizeCefr } from "../services/dynamicQuestionService";

export interface InterviewPracticeViewProps {
  onBackToWorkspace?: () => void;
  onNavigateToMemory?: () => void;
  roleName?: string;
  userLevel?: string;
  onSelectLevel?: (level: CefrLevelCode) => void;
  isActive?: boolean;
}

export const InterviewPracticeView: React.FC<InterviewPracticeViewProps> = ({
  onBackToWorkspace,
  onNavigateToMemory,
  roleName = "Professional",
  userLevel,
  onSelectLevel,
  isActive = true,
}) => {
  const {
    isListening,
    isAiSpeaking,
    isThinking,
    isPaused,
    processingStage,
    currentRound,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    remainingSeconds,
    speakingSeconds,
    speechRate,
    userTranscript,
    speechNotice,
    clearTranscript,
    turnFeedback,
    savedErrorIds,
    setSpeechRate,
    setUserTranscript,
    toggleListening,
    finishTurnManual,
    skipQuestion,
    repeatQuestion,
    takeTime,
    saveSpecificErrorToMemory,
    saveAllErrorsToMemory,
    selectedVoice,
    setSelectedVoice,
    setShowAnalysisModal,
    showAnalysisModal,
    isMicRecoveryModalOpen,
    setIsMicRecoveryModalOpen,
    resumeFromMicRecovery,
    isRecoveryModalOpen,
    setIsRecoveryModalOpen,
    infrastructureErrorScenario,
    recoveryCooldown,
    resumeFromRecoveryModal,
    activeCefrLevel,
    setActiveCefrLevel,
  } = useInterviewSession(roleName, userLevel, isActive);

  const [showAudioSettings, setShowAudioSettings] = useState<boolean>(false);
  const [showControlsDrawer, setShowControlsDrawer] = useState<boolean>(false);

  // Keyboard shortcut listener (Space to pause/resume, Enter to finish speaking) - Only active when view is active
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const activeEl = document.activeElement as HTMLElement | null;
      const isTextEditing =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTextEditing || showAnalysisModal || showAudioSettings || showControlsDrawer) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        toggleListening();
      } else if (e.code === "Enter" && isListening) {
        e.preventDefault();
        finishTurnManual();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isActive,
    toggleListening,
    finishTurnManual,
    isListening,
    showAnalysisModal,
    showAudioSettings,
    showControlsDrawer,
  ]);

  const handleEndSession = useCallback(() => {
    if (onBackToWorkspace) {
      onBackToWorkspace();
    }
  }, [onBackToWorkspace]);

  const handleOpenAnalysisModal = useCallback(() => setShowAnalysisModal(true), []);
  const handleCloseAnalysisModal = useCallback(() => {
    setShowAnalysisModal(false);
    setUserTranscript("");
  }, [setUserTranscript]);
  const handleOpenControlsDrawer = useCallback(() => setShowControlsDrawer(true), []);
  const handleCloseControlsDrawer = useCallback(() => setShowControlsDrawer(false), []);
  const handleRepeatQuestion = useCallback(() => repeatQuestion(), [repeatQuestion]);
  const handleSubmitAnswer = useCallback((text?: string) => {
    finishTurnManual(text);
  }, [finishTurnManual]);

  const statusTitle = useMemo(() => {
    if (isAiSpeaking) return "Interviewer speaking...";
    if (processingStage === "TRANSCRIBING") return "Transcribiendo con Whisper AI...";
    if (processingStage === "ANALYZING") return "Analizando con Mentor IA...";
    if (processingStage === "PREPARING") return "Estructurando correcciones...";
    if (isThinking) return "Procesando respuesta...";
    if (isPaused) return "Interview paused";
    if (isListening) return "Listening to your answer...";
    if (speechNotice) return "Micrófono en pausa";
    return "Ready for your answer";
  }, [
    isAiSpeaking,
    processingStage,
    isThinking,
    isPaused,
    isListening,
    speechNotice,
  ]);

  const handleSetLevel = useCallback(
    (level: string) => {
      const norm = normalizeCefr(level);
      setActiveCefrLevel(norm);
      if (onSelectLevel) {
        onSelectLevel(norm as CefrLevelCode);
      }
    },
    [setActiveCefrLevel, onSelectLevel],
  );

  const panelProps = useMemo(
    () => ({
      currentRound,
      currentQuestion: currentQuestionIndex,
      totalQuestions,
      remainingSeconds,
      speakingSeconds,
      roleName,
      userLevel: activeCefrLevel,
      speechRate,
      isListening,
      isPaused,
      turnFeedback,
      savedErrorIds,
      onSetSpeechRate: setSpeechRate,
      onSetLevel: handleSetLevel,
      onSkipQuestion: skipQuestion,
      onRepeatQuestion: repeatQuestion,
      onPauseInterview: toggleListening,
      onEndInterview: handleEndSession,
      onTakeTime: takeTime,
      onSaveSpecificError: saveSpecificErrorToMemory,
      onSaveAllErrors: saveAllErrorsToMemory,
      onOpenAnalysisModal: handleOpenAnalysisModal,
    }),
    [
      currentRound,
      currentQuestionIndex,
      totalQuestions,
      remainingSeconds,
      speakingSeconds,
      roleName,
      activeCefrLevel,
      speechRate,
      isListening,
      isPaused,
      turnFeedback,
      savedErrorIds,
      setSpeechRate,
      handleSetLevel,
      skipQuestion,
      repeatQuestion,
      toggleListening,
      handleEndSession,
      takeTime,
      saveSpecificErrorToMemory,
      saveAllErrorsToMemory,
      handleOpenAnalysisModal,
    ],
  );

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-1 w-full h-full max-h-screen overflow-hidden bg-[#000001] text-white flex flex-col justify-between select-none z-10 py-1 sm:py-2"
    >
      {/* 1. Clean Responsive HUD (Screens < xl, completely backgroundless and balanced) */}
      <ResponsiveInterviewHUD
        currentRound={currentRound}
        currentQuestion={currentQuestionIndex}
        totalQuestions={totalQuestions}
        roleName={roleName}
        userLevel={activeCefrLevel}
        speechRate={speechRate}
        onSetSpeechRate={setSpeechRate}
        onSetLevel={handleSetLevel}
        onRepeatQuestion={handleRepeatQuestion}
        onNextQuestion={skipQuestion}
        onOpenDrawer={handleOpenControlsDrawer}
        onOpenAnalysisModal={handleOpenAnalysisModal}
        hasFeedback={!!turnFeedback}
      />

      {/* 2. Main Workspace */}
      <div className="flex-1 w-full max-w-7xl 2xl:max-w-[1800px] mx-auto flex flex-col xl:flex-row items-stretch justify-between px-4 sm:px-6 py-0.5 sm:py-1 gap-4 lg:gap-6 z-10 overflow-hidden h-full min-h-0">
        {/* Center Main Hero Arena: 100% Adaptive Viewport without scroll */}
        <div className="flex-1 w-full h-full flex flex-col justify-between items-center min-h-0 overflow-hidden max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-0 sm:px-4 py-1 sm:py-2 lg:py-4">
          {/* Upper Section: Orb + Status + Question + Live Transcript */}
          <div className="w-full flex flex-col items-center justify-start gap-1.5 sm:gap-3 shrink-0">
            {/* Glowing Orb & Status */}
            <ConversationOrbHero
              statusText={statusTitle}
              isListening={isListening}
              isAiSpeaking={isAiSpeaking}
              isThinking={isThinking}
              processingStage={processingStage}
              isActive={isActive}
            />

            {/* Question & Live Transcript — blindado contra crash si currentQuestion aún no hidrata */}
            <ConversationPromptArea
              currentQuestionText={currentQuestion?.question ?? "Tell me about your recent project and your role in it."}
              userTranscript={userTranscript}
              selectedVoice={selectedVoice}
              onSelectVoice={setSelectedVoice}
              onRepeatQuestion={handleRepeatQuestion}
              onClearTranscript={clearTranscript}
              onTranscriptChange={setUserTranscript}
              onSubmitAnswer={handleSubmitAnswer}
            />
          </div>

          {/* Middle Section: Waveform Spectrum */}
          <div className="w-full flex items-center justify-center my-0 sm:my-1 shrink-0">
            <ConversationWaveformSpectrum
              isListening={isListening || isAiSpeaking}
              animated={isListening || isAiSpeaking}
            />
          </div>

          {/* Bottom Section: Mic / Send Action Controls */}
          <div className="w-full flex flex-col items-center justify-center shrink-0 pb-16 sm:pb-20 lg:pb-1">
            <ConversationMicControl
              isListening={isListening}
              isAiSpeaking={isAiSpeaking}
              isThinking={isThinking}
              hasText={userTranscript.trim().length > 0}
              onToggleListening={toggleListening}
              onFinishTurn={handleSubmitAnswer}
              onSubmitText={handleSubmitAnswer}
              onClearText={clearTranscript}
            />
          </div>
        </div>

        {/* Right Column: Desktop Sidebar Stack (xl and above) */}
        <div className="w-full xl:w-[320px] 2xl:w-[360px] hidden xl:flex flex-col space-y-3.5 shrink-0 h-full overflow-y-auto no-scrollbar py-1 min-h-0">
          <ConversationRightPanel {...panelProps} />
        </div>
      </div>

      {/* 3. Floating Sidenav Cards with Vignette Degradado (No container box) */}
      <SessionCardsSidenav
        isOpen={showControlsDrawer}
        onClose={handleCloseControlsDrawer}
        panelProps={panelProps}
      />

      {/* 4. Full Turn Analysis Modal */}
      {showAnalysisModal && turnFeedback && (
        <InterviewAnalysisModal
          feedback={turnFeedback}
          savedErrorIds={savedErrorIds}
          onClose={handleCloseAnalysisModal}
          onSaveSpecificError={saveSpecificErrorToMemory}
          onSaveAllErrors={saveAllErrorsToMemory}
          onNavigateToMemory={onNavigateToMemory}
        />
      )}

      {/* 5. Audio & Mic Settings Modal */}
      {showAudioSettings && (
        <ConversationAudioSettingsModal
          isOpen={showAudioSettings}
          onClose={() => setShowAudioSettings(false)}
          speechRate={speechRate}
          onSetSpeechRate={setSpeechRate}
        />
      )}

      {/* 6. Luxury Hardware Resilience Mic Recovery Modal */}
      {isMicRecoveryModalOpen && (
        <MicHardwareRecoveryModal
          isOpen={isMicRecoveryModalOpen}
          onClose={() => setIsMicRecoveryModalOpen(false)}
          onResume={resumeFromMicRecovery}
        />
      )}

      {/* 7. Luxury AI Infrastructure Recovery Modal */}
      {isRecoveryModalOpen && (
        <AiInfrastructureRecoveryModal
          isOpen={isRecoveryModalOpen}
          scenario={infrastructureErrorScenario}
          cooldown={recoveryCooldown}
          contextType="speaking"
          bufferDetail={{ durationSeconds: speakingSeconds }}
          onClose={() => setIsRecoveryModalOpen(false)}
          onImmediateResume={resumeFromRecoveryModal}
        />
      )}
    </motion.div>
  );
};
