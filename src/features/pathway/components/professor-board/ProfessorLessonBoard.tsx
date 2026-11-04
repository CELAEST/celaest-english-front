import React from "react";
import { PathwayLessonPayload, PathwayStepId } from "../../../../domain/entities/LearningPathway";
import { useTypewriter } from "../../hooks/useTypewriter";
import type { ProfessorBoardMode, ProfessorSpeech } from "../../services/professorSpeech";
import { LessonBoardActions } from "./LessonBoardActions";
import { LessonBoardBody, LiveBoardState, MobileBoardInteractiveContext } from "./LessonBoardBody";
import { LessonBoardHeader } from "./LessonBoardHeader";
import { LessonBoardPracticeCta } from "./LessonBoardPracticeCta";
import { LessonQuestionAnnex } from "./LessonQuestionAnnex";
import { LiveClassBeatBar } from "./live-scenes/LiveClassBeatBar";

export interface ProfessorLessonBoardProps {
  lesson?: PathwayLessonPayload | undefined; step?: PathwayStepId | undefined;
  isMobileUnified?: boolean | undefined; hasQaOverride?: boolean | undefined;
  mobileContext?: MobileBoardInteractiveContext | undefined;
  liveBoard?: LiveBoardState | undefined;
  speech: ProfessorSpeech; mode: ProfessorBoardMode; isDictating: boolean; isSpeakingAudio: boolean;
  isShowingExamples?: boolean | undefined; isAskingOpen?: boolean | undefined; isAskingQA?: boolean | undefined;
  suggestedQuestions?: string[] | undefined;
  onModeChange: (mode: ProfessorBoardMode) => void; onToggleLecture: () => void;
  onPlaySample: (text: string) => void; onToggleAsking?: (() => void) | undefined;
  onSubmitQuestion?: ((question: string) => Promise<void>) | undefined;
  onDismissQaOverride?: (() => void) | undefined; onSwitchToPractice?: (() => void) | undefined;
}

export const ProfessorLessonBoard: React.FC<ProfessorLessonBoardProps> = ({
  lesson, step = "RULE", isMobileUnified = false, hasQaOverride = false, mobileContext, liveBoard,
  speech, mode, isDictating, isSpeakingAudio, isShowingExamples = false,
  isAskingOpen = false, isAskingQA = false, suggestedQuestions,
  onModeChange, onToggleLecture, onPlaySample, onToggleAsking, onSubmitQuestion,
  onDismissQaOverride, onSwitchToPractice,
}) => {
  const cps = isDictating || isSpeakingAudio ? 17 : 55;
  const { typed, progress, isDone, finish } = useTypewriter(speech.text, cps);
  const showLiveBeatBar = Boolean(isMobileUnified && step === "RULE" && !hasQaOverride && liveBoard);
  const showRuleBuildCta = Boolean(onSwitchToPractice && step === "RULE" && !hasQaOverride);

  return (
    <section className="relative z-10 shrink-0 max-h-[54dvh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:max-h-none lg:overflow-hidden rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)]">
      <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" aria-hidden />
      <div className="absolute left-0 top-0 h-px bg-white/40 transition-[width] duration-150 ease-linear" style={{ width: `${progress * 100}%` }} aria-hidden />
      <div className="flex flex-col gap-2 px-3.5 sm:px-5 pb-2.5 sm:pb-3 pt-3 sm:pt-3.5">
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
        {isAskingOpen && onSubmitQuestion && onToggleAsking && (
          <LessonQuestionAnnex isSubmitting={isAskingQA} suggestedQuestions={suggestedQuestions} onClose={onToggleAsking} onSubmit={onSubmitQuestion} />
        )}
        <LessonBoardActions isDictating={isDictating} isSpeakingAudio={isSpeakingAudio} canPlaySample={Boolean(speech.sampleAudioText)} isAskingOpen={isAskingOpen} onToggleLecture={onToggleLecture} onToggleAsking={onToggleAsking} onPlaySample={() => speech.sampleAudioText && onPlaySample(speech.sampleAudioText)} />
        {showRuleBuildCta && onSwitchToPractice && (
          <div className="pt-1 border-t border-white/[0.06] lg:hidden">
            <LessonBoardPracticeCta onClick={onSwitchToPractice} />
          </div>
        )}
      </div>
    </section>
  );
};
