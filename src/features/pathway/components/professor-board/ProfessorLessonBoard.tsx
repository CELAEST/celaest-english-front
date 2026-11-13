import React from "react";
import { PathwayLessonPayload, PathwayNode, PathwayStepId } from "../../../../domain/entities/LearningPathway";
import { useTypewriter } from "../../hooks/useTypewriter";
import type { ProfessorBoardMode, ProfessorSpeech } from "../../services/professorSpeech";
import { LessonBoardActions } from "./LessonBoardActions";
import { LessonBoardBody, LiveBoardState, MobileBoardInteractiveContext } from "./LessonBoardBody";
import { LessonBoardHeader } from "./LessonBoardHeader";
import { LessonBoardPracticeCta } from "./LessonBoardPracticeCta";
import { LessonBoardChatMode } from "./chat";
import { LiveClassBeatBar } from "./live-scenes/LiveClassBeatBar";

export interface ProfessorLessonBoardProps {
  lesson?: PathwayLessonPayload | undefined;
  node?: PathwayNode | undefined;
  cefrLevel?: string | undefined;
  step?: PathwayStepId | undefined;
  isMobileUnified?: boolean | undefined;
  hasQaOverride?: boolean | undefined;
  isAutoplayWaiting?: boolean | undefined;
  mobileContext?: MobileBoardInteractiveContext | undefined;
  liveBoard?: LiveBoardState | undefined;
  speech: ProfessorSpeech;
  mode: ProfessorBoardMode;
  isDictating: boolean;
  isSpeakingAudio: boolean;
  isShowingExamples?: boolean | undefined;
  isAskingOpen?: boolean | undefined;
  isAskingQA?: boolean | undefined;
  suggestedQuestions?: string[] | undefined;
  onModeChange: (mode: ProfessorBoardMode) => void;
  onToggleLecture: () => void;
  onPlaySample: (text: string) => void;
  onToggleAsking?: (() => void) | undefined;
  onSubmitQuestion?: ((question: string) => Promise<void>) | undefined;
  onDismissQaOverride?: (() => void) | undefined;
  onSwitchToPractice?: (() => void) | undefined;
  onThinkingChange?: ((isThinking: boolean) => void) | undefined;
  onAiError?: ((err: unknown, retryFn: () => void, previewText?: string) => void) | undefined;
}

export const ProfessorLessonBoard: React.FC<ProfessorLessonBoardProps> = ({
  lesson,
  node,
  cefrLevel,
  step = "RULE",
  isMobileUnified = false,
  hasQaOverride = false,
  isAutoplayWaiting = false,
  mobileContext,
  liveBoard,
  speech,
  mode,
  isDictating,
  isSpeakingAudio,
  isShowingExamples = false,
  isAskingOpen = false,
  isAskingQA: _isAskingQA = false,
  suggestedQuestions,
  onModeChange,
  onToggleLecture,
  onPlaySample,
  onToggleAsking,
  onSubmitQuestion: _onSubmitQuestion,
  onDismissQaOverride,
  onSwitchToPractice,
  onThinkingChange,
  onAiError,
}) => {
  const cps = isDictating || isSpeakingAudio ? 17 : 55;
  const { typed, progress, isDone, finish } = useTypewriter(speech.text, cps);
  const showLiveBeatBar = Boolean(isMobileUnified && step === "RULE" && !hasQaOverride && liveBoard);
  const showRuleBuildCta = Boolean(onSwitchToPractice && step === "RULE" && !hasQaOverride);
  const baseCode = String((node?.orderIndex ?? 0) + 1).padStart(2, "0");

  return (
    <section className={`relative z-10 shrink-0 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)] ${
      isAskingOpen
        ? "h-[54dvh] sm:h-[480px] lg:h-[480px] flex flex-col overflow-hidden"
        : "max-h-[54dvh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:max-h-none lg:overflow-hidden"
    }`}>
      <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" aria-hidden />
      <div className="absolute left-0 top-0 h-px bg-white/40 transition-[width] duration-150 ease-linear" style={{ width: `${progress * 100}%` }} aria-hidden />
      <div className={`flex flex-col px-3.5 sm:px-5 ${isAskingOpen ? "flex-1 min-h-0 pt-3 pb-3 overflow-hidden" : "gap-2 pb-2.5 sm:pb-3 pt-3 sm:pt-3.5"}`}>
        {isAskingOpen ? (
          <LessonBoardChatMode
            node={node}
            cefrLevel={cefrLevel}
            baseCode={baseCode}
            suggestedQuestions={suggestedQuestions}
            onClose={() => onToggleAsking?.()}
            onThinkingChange={onThinkingChange}
            onAiError={onAiError}
          />
        ) : (
          <>
            <LessonBoardHeader eyebrow={speech.eyebrow} headline={speech.headline} mode={mode} isMobileUnified={isMobileUnified} hideTabs={showLiveBeatBar} onModeChange={onModeChange} />
            {showLiveBeatBar && liveBoard && (
              <LiveClassBeatBar activeBeat={liveBoard.activeBeat} trapCheckPassed={liveBoard.trapCheckPassed} isWaitingTrapCheck={liveBoard.isWaitingTrapCheck} onSelectBeat={liveBoard.onSelectBeat} />
            )}
            <LessonBoardBody
              lesson={lesson} step={step} isMobileUnified={isMobileUnified}
              isShowingExamples={isShowingExamples} hasQaOverride={hasQaOverride}
              fullText={speech.text} typedText={typed} isTyping={!isDone}
              speakingSampleText={isSpeakingAudio ? speech.sampleAudioText : null}
              mobileContext={mobileContext} liveBoard={liveBoard}
              onFinishTyping={finish} onPlaySample={onPlaySample} onDismissQaOverride={onDismissQaOverride}
            />
            <LessonBoardActions isDictating={isDictating} isSpeakingAudio={isSpeakingAudio} canPlaySample={Boolean(speech.sampleAudioText)} isAskingOpen={isAskingOpen} isAutoplayWaiting={isAutoplayWaiting} onToggleLecture={onToggleLecture} onToggleAsking={onToggleAsking} onPlaySample={() => speech.sampleAudioText && onPlaySample(speech.sampleAudioText)} />
            {showRuleBuildCta && onSwitchToPractice && (
              <div className="pt-1 border-t border-white/[0.06] lg:hidden">
                <LessonBoardPracticeCta onClick={onSwitchToPractice} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
