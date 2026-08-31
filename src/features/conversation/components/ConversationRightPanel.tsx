import React, { useState, useMemo } from "react";
import { SpecificErrorItem } from "../services/interviewEngineService";
import { ComprehensiveTurnFeedback } from "../services/masterAiFeedbackEngine";

const SPEED_OPTIONS = [
  { label: "0.75x Slow", value: 0.75 },
  { label: "0.90x Relaxed", value: 0.9 },
  { label: "1.00x Normal", value: 1.0 },
  { label: "1.20x Fast", value: 1.2 },
];

export interface ConversationRightPanelProps {
  currentRound?: number;
  currentQuestion?: number;
  totalQuestions?: number;
  remainingSeconds?: number;
  speakingSeconds?: number;
  roleName?: string;
  speechRate?: number;
  turnFeedback?: ComprehensiveTurnFeedback | null;
  savedErrorIds?: Set<string>;
  onClose?: () => void;
  onSetSpeechRate?: (rate: number) => void;
  onSkipQuestion?: () => void;
  onRepeatQuestion?: (slow?: boolean) => void;
  onPauseInterview?: () => void;
  onEndInterview?: () => void;
  onTakeTime?: () => void;
  onSaveSpecificError?: (errorItem: SpecificErrorItem) => Promise<boolean>;
  onSaveAllErrors?: () => Promise<number>;
  onOpenAnalysisModal?: () => void;
}

const ConversationRightPanelInner: React.FC<ConversationRightPanelProps> = ({
  currentRound = 1,
  currentQuestion = 1,
  totalQuestions = 5,
  speakingSeconds = 0,
  roleName = "Product Manager",
  speechRate = 0.95,
  turnFeedback,
  savedErrorIds = new Set(),
  onClose,
  onSetSpeechRate,
  onSkipQuestion,
  onRepeatQuestion,
  onPauseInterview,
  onEndInterview,
  onTakeTime,
  onSaveSpecificError,
  onSaveAllErrors,
  onOpenAnalysisModal,
}) => {
  const [showSpeedSelector, setShowSpeedSelector] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [allSavedNotice, setAllSavedNotice] = useState(false);

  const dashArray = useMemo(() => Array.from({ length: totalQuestions }), [totalQuestions]);
  const progressPercentage = Math.min(100, (speakingSeconds / 60) * 100);
  const formattedQuestionIndex = currentQuestion.toString().padStart(2, "0");

  const handleSaveAll = async () => {
    if (
      !turnFeedback?.unclearOrErrorWords ||
      turnFeedback.unclearOrErrorWords.length === 0 ||
      !onSaveAllErrors
    )
      return;
    setIsSavingAll(true);
    await onSaveAllErrors();
    setIsSavingAll(false);
    setAllSavedNotice(true);
    setTimeout(() => setAllSavedNotice(false), 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="w-full flex flex-col space-y-3 select-none z-20 transition-all duration-300 py-1">
      {/* CARD 1: Interview Progress & Role Info */}
      <div
        className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-2.5 shrink-0 overflow-hidden animate-[fadeSlideUp_0.4s_ease-out_both]"
        style={{ animationDelay: "100ms" }}
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-white/70 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeOpacity="0.35"
              />
              <circle cx="12" cy="2.5" r="0.9" fill="currentColor" />
              <circle cx="21.5" cy="12" r="0.9" fill="currentColor" />
              <circle cx="12" cy="21.5" r="0.9" fill="currentColor" />
              <circle cx="2.5" cy="12" r="0.9" fill="currentColor" />
              <path
                d="M12 6L13.8 10.2L18 12L13.8 13.8L12 18L10.2 13.8L6 12L10.2 10.2L12 6Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.15"
              />
              <circle cx="12" cy="12" r="1.4" fill="#FFFFFF" />
            </svg>

            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              AI Interviewer
            </span>
          </div>

          <div className="flex items-center space-x-2 select-none">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono text-white/40 tracking-wider">
                ROUND {currentRound.toString().padStart(2, "0")}
              </span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase">
                LIVE
              </span>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors cursor-pointer ml-1 p-0.5"
                title="Cerrar panel (Esc)"
              >
                <svg
                  className="w-3.5 h-3.5 hover:rotate-90 transition-transform duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5 z-10">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-light text-white tracking-wider">
              {formattedQuestionIndex} / {totalQuestions.toString().padStart(2, "0")}
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/60 text-xs font-light tracking-wide truncate max-w-[140px]">
              {roleName}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-white/30">
            {Math.round((currentQuestion / totalQuestions) * 100)}%
          </span>
        </div>

        <div className="flex space-x-1.5 pt-0.5 z-10">
          {dashArray.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i < currentQuestion ? "bg-white/60" : "bg-white/[0.04]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* CARD 2: Speaking Timer & Speech Speed */}
      <div
        className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-4 sm:p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col items-center justify-center shrink-0 overflow-hidden animate-[fadeSlideUp_0.4s_ease-out_both]"
        style={{ animationDelay: "200ms" }}
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* Circular Progress Gauge with Centered Clean Digits */}
        <div className="w-28 h-28 sm:w-30 sm:h-30 relative flex items-center justify-center my-1 z-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="3.5"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="3.5"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center select-none">
            <span className="text-xl sm:text-[22px] font-light text-white tracking-wide leading-none tabular-nums">
              {Math.floor(speakingSeconds / 60)
                .toString()
                .padStart(2, "0")}
              :{(speakingSeconds % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center mt-2 mb-0.5 select-none z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Speaking Time
          </span>
        </div>

        {/* AI Voice Speed Controls */}
        <div className="w-full flex items-center justify-between pt-3 border-t border-white/[0.04] mt-3 text-xs z-10">
          <div className="flex items-center space-x-1.5 text-white/40 font-light">
            <svg className="w-3.5 h-3.5 text-white/40 shrink-0" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[11px] font-mono tracking-wide">AI Voice Speed:</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSpeedSelector((prev) => !prev)}
              className="text-white/60 hover:text-white font-mono text-xs flex items-center space-x-1 transition-colors cursor-pointer py-0.5"
            >
              <span>{speechRate.toFixed(2)}x</span>
              <svg
                className="w-3 h-3 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showSpeedSelector && (
              <div className="absolute right-0 bottom-8 w-36 bg-[#04040A] border border-white/[0.1] rounded-2xl p-1 shadow-2xl z-30 flex flex-col space-y-0.5 backdrop-blur-xl">
                {SPEED_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (onSetSpeechRate) onSetSpeechRate(opt.value);
                      setShowSpeedSelector(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-mono text-left transition-colors cursor-pointer flex items-center justify-between ${
                      Math.abs(speechRate - opt.value) < 0.05
                        ? "text-white font-medium bg-white/[0.08]"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD 3: Interactive Options Menu Card */}
      <div
        className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-1 shrink-0 overflow-hidden animate-[fadeSlideUp_0.4s_ease-out_both]"
        style={{ animationDelay: "300ms" }}
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        <div className="flex items-center space-x-1.5 pb-1 text-white/40 z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest">Controls</span>
        </div>

        {/* Repeat Question (Normal) */}
        <button
          onClick={() => onRepeatQuestion && onRepeatQuestion(false)}
          className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl text-xs text-white/60 hover:bg-white/[0.04] hover:text-white transition-all text-left group cursor-pointer z-10"
        >
          <svg
            className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-all duration-300 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 3v5h5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-light">Repeat question</span>
        </button>

        {/* Repeat Question (Slow) */}
        <button
          onClick={() => onRepeatQuestion && onRepeatQuestion(true)}
          className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl text-xs text-white/60 hover:bg-white/[0.04] hover:text-white transition-all text-left group cursor-pointer z-10"
        >
          <svg
            className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-all duration-300 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <path
              d="M7 16c1.5-1 3.5-1 5 0s3.5 1 5 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
          </svg>
          <span className="font-light">Repeat question slower</span>
          <span className="text-[10px] text-white/30 group-hover:text-white font-mono ml-auto transition-colors">
            0.7x
          </span>
        </button>

        <button
          onClick={onTakeTime}
          className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl text-xs text-white/60 hover:bg-white/[0.04] hover:text-white transition-all text-left group cursor-pointer z-10"
        >
          <svg
            className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-all duration-300 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2v3M12 19v3M2 12h3M19 12h3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="M12 8v4l2.5 2.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-light">+15s Take my time</span>
        </button>

        <button
          onClick={onSkipQuestion}
          className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl text-xs text-white/60 hover:bg-white/[0.04] hover:text-white transition-all text-left group cursor-pointer z-10"
        >
          <svg
            className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-all duration-300 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M5 4l10 8-10 8V4z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path d="M19 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-light">Next question</span>
        </button>

        <button
          onClick={onPauseInterview}
          className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl text-xs text-white/60 hover:bg-white/[0.04] hover:text-white transition-all text-left group cursor-pointer z-10"
        >
          <svg
            className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-colors duration-300 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect
              x="5.5"
              y="4.5"
              width="4"
              height="15"
              rx="1.5"
              fill="currentColor"
              fillOpacity="0.4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="14.5"
              y="4.5"
              width="4"
              height="15"
              rx="1.5"
              fill="currentColor"
              fillOpacity="0.4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span className="font-light">Pause / Resume</span>
        </button>

        <button
          onClick={onEndInterview}
          className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl text-xs text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-left group cursor-pointer pt-1 z-10"
        >
          <svg
            className="w-3.5 h-3.5 text-rose-400/60 group-hover:text-rose-400 group-hover:scale-110 transition-transform duration-300 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M18.36 6.64a9 9 0 11-12.73 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="2"
              x2="12"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-light">End interview</span>
        </button>
      </div>

      {/* CARD 4: Dedicated Deep AI Analysis Trigger Card */}
      {turnFeedback && onOpenAnalysisModal && (
        <button
          onClick={onOpenAnalysisModal}
          className="group relative w-full bg-[#04040A] hover:border-white/20 border border-white/[0.07] transition-all duration-300 rounded-3xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-between text-left cursor-pointer shrink-0 overflow-hidden animate-[fadeSlideUp_0.35s_ease-out_both]"
          style={{ animationDelay: "350ms" }}
        >
          {/* Top Specular Hairline */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          <div className="flex items-center space-x-3.5 min-w-0 z-10">
            <svg
              className="w-5 h-5 text-white/50 group-hover:text-white transition-all duration-300 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="3"
                y="14"
                width="3.2"
                height="7"
                rx="1.5"
                fill="currentColor"
                fillOpacity="0.45"
              />
              <rect
                x="8.5"
                y="9"
                width="3.2"
                height="12"
                rx="1.5"
                fill="currentColor"
                fillOpacity="0.7"
              />
              <rect x="14" y="4" width="3.2" height="17" rx="1.5" fill="currentColor" />
            </svg>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-light text-white transition-colors">
                Detailed Analysis
              </span>
              <span className="text-[10px] font-mono text-white/40 transition-colors truncate">
                Click to inspect full metrics & feedback
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-white/40 group-hover:text-white transition-colors shrink-0 pl-2 z-10">
            <span className="text-[10px] font-mono uppercase opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
              Open
            </span>
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </button>
      )}

      {/* CARD 5: Turn Feedback & Evaluation */}
      {turnFeedback && (
        <div
          className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-3 shrink-0 overflow-hidden animate-[fadeSlideUp_0.35s_ease-out_both]"
          style={{ animationDelay: "400ms" }}
        >
          {/* Top Specular Hairline */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {/* Top Score Header */}
          <div
            onClick={onOpenAnalysisModal}
            className={`flex items-center justify-between border-b border-white/[0.04] pb-2.5 z-10 ${
              onOpenAnalysisModal ? "cursor-pointer group hover:opacity-90 transition-opacity" : ""
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Evaluation
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span
                className={`text-xs font-mono font-light ${getScoreColor(
                  turnFeedback.overallScore,
                )}`}
              >
                Score: {turnFeedback.overallScore}/100
              </span>
              {onOpenAnalysisModal && (
                <svg
                  className="w-3 h-3 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </div>

          {/* Grammar, Vocabulary, Clarity Score Cards */}
          <div
            onClick={onOpenAnalysisModal}
            className={`grid grid-cols-3 gap-2 text-center py-1 rounded-xl transition-all z-10 ${
              onOpenAnalysisModal ? "cursor-pointer hover:bg-white/[0.02]" : ""
            }`}
          >
            <div className="flex flex-col space-y-0.5">
              <span className="text-white/30 text-[9px] font-mono uppercase tracking-wider">
                Grammar
              </span>
              <span
                className={`text-xs font-mono font-light ${getScoreColor(
                  turnFeedback.grammarScore,
                )}`}
              >
                {turnFeedback.grammarScore}%
              </span>
            </div>
            <div className="flex flex-col space-y-0.5 border-l border-white/[0.04]">
              <span className="text-white/30 text-[9px] font-mono uppercase tracking-wider">
                Vocabulary
              </span>
              <span
                className={`text-xs font-mono font-light ${getScoreColor(
                  turnFeedback.vocabularyScore,
                )}`}
              >
                {turnFeedback.vocabularyScore}%
              </span>
            </div>
            <div className="flex flex-col space-y-0.5 border-l border-white/[0.04]">
              <span className="text-white/30 text-[9px] font-mono uppercase tracking-wider">
                Clarity
              </span>
              <span
                className={`text-xs font-mono font-light ${getScoreColor(
                  turnFeedback.clarityScore,
                )}`}
              >
                {turnFeedback.clarityScore}%
              </span>
            </div>
          </div>

          {/* Strategic Feedback Block */}
          {turnFeedback.strategicFeedback && (
            <div
              onClick={onOpenAnalysisModal}
              className={`pt-1 flex flex-col space-y-1 border-t border-white/[0.04] z-10 ${
                onOpenAnalysisModal
                  ? "cursor-pointer group hover:bg-white/[0.02] p-1.5 -mx-1.5 rounded-2xl transition-colors"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                  Strategic Feedback
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/60 leading-relaxed">
                {turnFeedback.strategicFeedback.explanation}
              </p>
            </div>
          )}

          {/* Detected Errors List */}
          {turnFeedback.unclearOrErrorWords && turnFeedback.unclearOrErrorWords.length > 0 ? (
            <div className="flex flex-col space-y-3 pt-1 z-10">
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
                <div
                  onClick={onOpenAnalysisModal}
                  className={`flex items-center space-x-1.5 ${
                    onOpenAnalysisModal ? "cursor-pointer group hover:opacity-80" : ""
                  }`}
                >
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                    Detected Errors ({turnFeedback.unclearOrErrorWords.length})
                  </span>
                </div>
                <button
                  onClick={handleSaveAll}
                  disabled={isSavingAll}
                  className="text-[10px] font-mono text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  {isSavingAll ? "Saving..." : "Save All"}
                </button>
              </div>

              {turnFeedback.unclearOrErrorWords.map((errItem) => {
                const isSaved = savedErrorIds.has(errItem.id);

                return (
                  <div
                    key={errItem.id}
                    onClick={onOpenAnalysisModal}
                    className={`flex flex-col space-y-1.5 pb-2.5 border-b border-white/[0.04] last:border-0 ${
                      onOpenAnalysisModal
                        ? "cursor-pointer group hover:bg-white/[0.02] p-1.5 -mx-1.5 rounded-2xl transition-colors"
                        : ""
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-rose-400/80 font-mono text-[11px] line-through">
                          {errItem.errorWord}
                        </span>
                        <span className="text-white/30 text-xs"></span>
                        <span className="text-emerald-400 font-mono text-[12px] font-light">
                          {errItem.correctWord}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30 font-mono">
                        {errItem.cefrLevel}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-white/50 leading-relaxed">
                      {errItem.explanation}
                    </p>

                    <p className="text-[11px] text-white/70 italic font-light">
                      {errItem.translationSpanish}
                    </p>

                    <div className="pt-0.5 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSaveSpecificError) onSaveSpecificError(errItem);
                        }}
                        disabled={isSaved}
                        className={`text-[11px] font-mono transition-colors cursor-pointer flex items-center space-x-1 ${
                          isSaved
                            ? "text-white/30 cursor-default"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <svg
                              className="w-3 h-3 text-emerald-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                            <span>Save to Memory</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-2 text-center text-[11px] font-mono text-white/40 z-10">
              Perfect grammar. No errors detected.
            </div>
          )}

          {/* Suggested Formulation Block */}
          <div
            onClick={onOpenAnalysisModal}
            className={`pt-1 flex flex-col space-y-1 border-t border-white/[0.04] z-10 ${
              onOpenAnalysisModal
                ? "cursor-pointer group hover:bg-white/[0.02] p-1.5 -mx-1.5 rounded-2xl transition-colors"
                : ""
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                Suggested Formulation
              </span>
            </div>
            <div className="border-l border-white/20 pl-2.5 py-0.5 text-[11px] font-mono text-white/80 leading-relaxed">
              {turnFeedback.improvedFullAnswer}
            </div>
          </div>

          {allSavedNotice && (
            <div className="p-1.5 rounded-xl bg-white/[0.04] text-white text-center text-[10px] font-mono z-10">
              Saved to Memory
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ConversationRightPanel = React.memo(ConversationRightPanelInner);
