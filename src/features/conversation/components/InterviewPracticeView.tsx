import React, { useState, useEffect } from "react";
import { ConversationRightPanel } from "./ConversationRightPanel";
import { ConversationOrbHero } from "./ConversationOrbHero";
import { ConversationPromptArea } from "./ConversationPromptArea";
import { ConversationWaveformSpectrum } from "./ConversationWaveformSpectrum";
import { ConversationMicControl } from "./ConversationMicControl";
import { ConversationAudioSettingsModal } from "./ConversationAudioSettingsModal";
import { InterviewAnalysisModal } from "./InterviewAnalysisModal";
import { ResponsiveInterviewHUD } from "./ResponsiveInterviewHUD";
import { SessionCardsSidenav } from "./SessionCardsSidenav";
import { useInterviewSession } from "../hooks/useInterviewSession";

export interface InterviewPracticeViewProps {
  onBackToWorkspace?: () => void;
  onNavigateToMemory?: () => void;
  roleName?: string;
}

export const InterviewPracticeView: React.FC<InterviewPracticeViewProps> = ({
  onBackToWorkspace,
  onNavigateToMemory,
  roleName = "Product Manager",
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
    micVolume,
    userTranscript,
    turnFeedback,
    savedErrorIds,
    setSpeechRate,
    setUserTranscript,
    toggleListening,
    finishTurnManual,
    submitCustomAnswer,
    skipQuestion,
    repeatQuestion,
    takeTime,
    saveSpecificErrorToMemory,
    saveAllErrorsToMemory,
    setShowAnalysisModal,
    showAnalysisModal,
  } = useInterviewSession(roleName);

  const [showAudioSettings, setShowAudioSettings] = useState<boolean>(false);
  const [showControlsDrawer, setShowControlsDrawer] = useState<boolean>(false);

  // Keyboard shortcut listener (Space to pause/resume, Enter to finish speaking)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        showAnalysisModal ||
        showAudioSettings ||
        showControlsDrawer
      ) {
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
    toggleListening,
    finishTurnManual,
    isListening,
    showAnalysisModal,
    showAudioSettings,
    showControlsDrawer,
  ]);

  const handleEndSession = () => {
    if (onBackToWorkspace) {
      onBackToWorkspace();
    }
  };

  const getStatusTitle = () => {
    if (isAiSpeaking) return "Interviewer speaking...";
    if (processingStage === "TRANSCRIBING") return "Transcribiendo con Whisper AI...";
    if (processingStage === "ANALYZING") return "Analizando con Mentor IA...";
    if (processingStage === "PREPARING") return "Estructurando correcciones...";
    if (isThinking) return "Procesando respuesta...";
    if (isPaused) return "Interview paused";
    if (isListening) return "Listening to your answer...";
    return "Ready for your answer";
  };

  const panelProps = {
    currentRound,
    currentQuestion: currentQuestionIndex,
    totalQuestions,
    remainingSeconds,
    speakingSeconds,
    roleName,
    speechRate,
    turnFeedback,
    savedErrorIds,
    onSetSpeechRate: setSpeechRate,
    onSkipQuestion: skipQuestion,
    onRepeatQuestion: repeatQuestion,
    onPauseInterview: toggleListening,
    onEndInterview: handleEndSession,
    onTakeTime: takeTime,
    onSaveSpecificError: saveSpecificErrorToMemory,
    onSaveAllErrors: saveAllErrorsToMemory,
    onOpenAnalysisModal: () => setShowAnalysisModal(true),
  };

  return (
    <div className="relative flex-1 w-full h-full max-h-screen overflow-hidden bg-[#000001] text-white flex flex-col justify-between select-none z-10 animate-[fadeIn_0.4s_ease-out_both] p-1 sm:p-2">
      {/* 1. Clean Responsive HUD (Screens < xl, completely backgroundless and balanced) */}
      <ResponsiveInterviewHUD
        currentRound={currentRound}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        roleName={roleName}
        speechRate={speechRate}
        onSetSpeechRate={setSpeechRate}
        onRepeatQuestion={repeatQuestion}
        onNextQuestion={skipQuestion}
        onOpenDrawer={() => setShowControlsDrawer(true)}
        onOpenAnalysisModal={() => setShowAnalysisModal(true)}
        hasFeedback={!!turnFeedback}
      />

      {/* 2. Main Workspace */}
      <div className="flex-1 w-full max-w-7xl 2xl:max-w-[1800px] mx-auto flex flex-col xl:flex-row items-stretch justify-between px-2 sm:px-6 py-0.5 sm:py-1 gap-4 lg:gap-6 z-10 overflow-hidden h-full min-h-0">
        {/* Center Main Hero Arena: 100% Adaptive Viewport without scroll */}
        <div className="flex-1 w-full h-full flex flex-col justify-between items-center min-h-0 overflow-hidden max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-3 sm:px-6 py-1 sm:py-2 lg:py-4">
          {/* Upper Section: Orb + Status + Question + Live Transcript */}
          <div className="w-full flex flex-col items-center justify-start gap-2 sm:gap-3 shrink-0">
            {/* Glowing Orb & Status */}
            <ConversationOrbHero
              statusText={getStatusTitle()}
              isListening={isListening}
              isAiSpeaking={isAiSpeaking}
              isThinking={isThinking}
              processingStage={processingStage}
            />

            {/* Question & Live Transcript */}
            <ConversationPromptArea
              currentQuestionText={currentQuestion.question}
              userTranscript={userTranscript}
              onTranscriptChange={setUserTranscript}
              onSubmitAnswer={() => {
                if (isListening) {
                  finishTurnManual();
                } else {
                  submitCustomAnswer(userTranscript);
                }
              }}
            />
          </div>

          {/* Middle Section: Waveform Spectrum */}
          <div className="w-full flex items-center justify-center my-0.5 sm:my-1 shrink-0">
            <ConversationWaveformSpectrum
              isListening={isListening || isAiSpeaking}
              animated={isListening || isAiSpeaking}
              micVolume={micVolume}
            />
          </div>

          {/* Bottom Section: Mic / Send Action Controls */}
          <div className="w-full flex flex-col items-center justify-center shrink-0 pb-1">
            <ConversationMicControl
              isListening={isListening}
              isAiSpeaking={isAiSpeaking}
              isThinking={isThinking}
              hasText={userTranscript.trim().length > 0}
              onToggleListening={toggleListening}
              onFinishTurn={finishTurnManual}
              onSubmitText={() => {
                if (isListening) {
                  finishTurnManual();
                } else {
                  submitCustomAnswer(userTranscript);
                }
              }}
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
        onClose={() => setShowControlsDrawer(false)}
        panelProps={panelProps}
      />

      {/* 4. Full Turn Analysis Modal */}
      {showAnalysisModal && turnFeedback && (
        <InterviewAnalysisModal
          feedback={turnFeedback}
          savedErrorIds={savedErrorIds}
          onClose={() => {
            setShowAnalysisModal(false);
            setUserTranscript("");
          }}
          onSaveSpecificError={saveSpecificErrorToMemory}
          onSaveAllErrors={saveAllErrorsToMemory}
          onNavigateToMemory={onNavigateToMemory}
        />
      )}

      {/* 5. Audio & Mic Settings Modal */}
      <ConversationAudioSettingsModal
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
        speechRate={speechRate}
        onSetSpeechRate={setSpeechRate}
        micVolume={micVolume}
      />
    </div>
  );
};
