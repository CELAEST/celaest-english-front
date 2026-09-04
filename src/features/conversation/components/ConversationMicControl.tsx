import React from "react";

export interface ConversationMicControlProps {
  isListening?: boolean;
  isAiSpeaking?: boolean;
  isThinking?: boolean;
  hasText?: boolean;
  onToggleListening?: () => void;
  onFinishTurn?: () => void;
  onSubmitText?: () => void;
  onClearText?: () => void;
}

export const ConversationMicControl: React.FC<ConversationMicControlProps> = ({
  isListening = false,
  isAiSpeaking = false,
  isThinking = false,
  hasText = false,
  onToggleListening,
  onFinishTurn,
  onSubmitText,
  onClearText,
}) => {
  const handleSubmit = () => {
    if (isThinking) return;
    if (onSubmitText) {
      onSubmitText();
    } else if (onFinishTurn) {
      onFinishTurn();
    }
  };

  const handleMicClick = () => {
    if (isThinking) return;
    if (onToggleListening) {
      onToggleListening();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center select-none z-10 shrink-0 pb-1 sm:pb-1.5 animate-[fadeSlideUp_0.35s_ease-out_both]">
      <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
        {/* Discard / Clear Button (Visible when text exists and not currently listening) */}
        {hasText && !isListening && onClearText && (
          <button
            type="button"
            onClick={onClearText}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") e.stopPropagation();
            }}
            disabled={isThinking}
            aria-label="Clear transcript"
            title="Clear transcript (Reset)"
            className="w-[clamp(38px,5.2vh,48px)] h-[clamp(38px,5.2vh,48px)] rounded-full bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.25] text-white/50 hover:text-white/90 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
          >
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* 1. Microphone Control Button (Strictly Toggles Audio Capture Only) */}
        <button
          type="button"
          onClick={handleMicClick}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") e.stopPropagation();
          }}
          disabled={isThinking || isAiSpeaking}
          aria-label={isListening ? "Stop microphone" : "Start speaking"}
          title={isListening ? "Stop microphone (Space)" : "Start speaking (Space)"}
          className={`w-[clamp(58px,8.5vh,88px)] h-[clamp(58px,8.5vh,88px)] rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group shrink-0 ${
            isAiSpeaking
              ? "bg-[#090A14] border-2 border-[#7750a7]/50 opacity-60 cursor-not-allowed shadow-[0_0_20px_rgba(162,127,243,0.2)]"
              : isListening
                ? "bg-[#090A14] border-2 border-[#A27FF3] animate-[softPulse_2.5s_ease-in-out_infinite] shadow-[0_0_28px_rgba(162,127,243,0.5)] scale-105"
                : "bg-[#090A14] border-2 border-white/[0.14] hover:border-[#A27FF3]/60 hover:shadow-[0_0_24px_rgba(162,127,243,0.3)] shadow-[0_0_20px_rgba(0,0,0,0.6)]"
          }`}
        >
          {isThinking ? (
            <div className="w-6 h-6 md:w-7 md:h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isListening ? (
            /* Active Listening: Stop / Pause Indicator */
            <div className="flex items-center justify-center relative">
              <span className="absolute w-8 h-8 rounded-full bg-[#A27FF3]/20 animate-ping" />
              <svg
                className="w-[clamp(24px,3.5vh,34px)] h-[clamp(24px,3.5vh,34px)] text-[#A27FF3] drop-shadow-[0_0_12px_rgba(162,127,243,0.9)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </div>
          ) : (
            /* Idle: Crisp Microphone Vector */
            <svg
              className="w-[clamp(26px,3.8vh,38px)] h-[clamp(26px,3.8vh,38px)] text-white/80 group-hover:text-white transition-all group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          )}
        </button>

        {/* 2. Green OK / Checkmark Button (The Exclusive AI Submission Trigger) */}
        {(isListening || hasText) && (
          <button
            type="button"
            onClick={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") e.stopPropagation();
            }}
            disabled={isThinking}
            aria-label="Submit response for AI evaluation (OK)"
            title="Submit response for AI evaluation (OK / Enter)"
            className="w-[clamp(48px,6.8vh,66px)] h-[clamp(48px,6.8vh,66px)] rounded-full bg-[#22c55e]/20 border-2 border-[#22c55e]/60 hover:bg-[#22c55e]/30 hover:border-[#22c55e] flex items-center justify-center text-[#4ade80] transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(34,197,94,0.35)] hover:shadow-[0_0_32px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 shrink-0 animate-[scaleIn_0.25s_ease-out_both]"
          >
            {isThinking ? (
              <div className="w-5 h-5 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-[clamp(22px,3.2vh,30px)] h-[clamp(22px,3.2vh,30px)] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.6}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Action Helper Micro-Text */}
      <span className="font-sans text-xs sm:text-[13px] text-white/50 font-medium tracking-wide text-center pt-[clamp(6px,1vh,12px)]">
        {isThinking
          ? "AI is evaluating your response..."
          : isAiSpeaking
            ? "Listening to interviewer..."
            : isListening
              ? "Tap mic to stop recording • Tap green OK to evaluate"
              : hasText
                ? "Tap green OK (or Enter) to evaluate • Tap mic to record again"
                : "Tap mic to start speaking or type your answer"}
      </span>
    </div>
  );
};
