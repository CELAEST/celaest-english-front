import React from "react";

export interface ConversationMicControlProps {
  isListening?: boolean;
  isAiSpeaking?: boolean;
  isThinking?: boolean;
  hasText?: boolean;
  onToggleListening?: () => void;
  onFinishTurn?: () => void;
  onSubmitText?: () => void;
}

export const ConversationMicControl: React.FC<ConversationMicControlProps> = ({
  isListening = false,
  isAiSpeaking = false,
  isThinking = false,
  hasText = false,
  onToggleListening,
  onFinishTurn,
  onSubmitText,
}) => {
  const handleMainClick = () => {
    if (isThinking) return;
    // If we are currently recording voice, clicking must stop recording and run Whisper STT
    if (isListening) {
      if (onFinishTurn) {
        onFinishTurn();
      } else if (onToggleListening) {
        onToggleListening();
      }
      return;
    }
    // If not recording, but user typed text manually
    if (hasText && onSubmitText) {
      onSubmitText();
      return;
    }
    if (onToggleListening) {
      onToggleListening();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center select-none z-10 shrink-0 pb-1 sm:pb-1.5 animate-[fadeSlideUp_0.35s_ease-out_both]">
      <div className="flex items-center gap-3 shrink-0">
        {/* Main Morphing Button: Converts between Microphone and Send Arrow */}
        <button
          type="button"
          onClick={handleMainClick}
          disabled={isThinking}
          aria-label={hasText ? "Submit response" : "Microphone control"}
          className={`w-[clamp(58px,8.5vh,88px)] h-[clamp(58px,8.5vh,88px)] rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group shrink-0 ${
            hasText
              ? "bg-[#A27FF3] hover:bg-[#8f66ea] border-2 border-[#A27FF3] shadow-[0_0_32px_rgba(162,127,243,0.7)] scale-105"
              : isAiSpeaking
              ? "bg-[#090A14] border-2 border-[#7750a7]/50 opacity-70 cursor-not-allowed shadow-[0_0_20px_rgba(162,127,243,0.2)]"
              : isListening
              ? "bg-[#090A14] border-2 border-[#A27FF3] animate-[softPulse_3s_ease-in-out_infinite] shadow-[0_0_28px_rgba(162,127,243,0.45)]"
              : "bg-[#090A14] border-2 border-white/[0.12] hover:border-white/[0.25] opacity-95 shadow-[0_0_20px_rgba(0,0,0,0.6)]"
          }`}
        >
          {isThinking ? (
            <div className="w-6 h-6 md:w-7 md:h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : hasText ? (
            /* Perfectly Centered Send / Arrow Icon */
            <svg
              className="w-[clamp(26px,3.8vh,38px)] h-[clamp(26px,3.8vh,38px)] text-white group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" fillOpacity="0.2" />
            </svg>
          ) : (
            /* Microphone Icon */
            <svg
              className={`w-[clamp(26px,3.8vh,38px)] h-[clamp(26px,3.8vh,38px)] transition-all ${
                isListening
                  ? "text-[#A27FF3] scale-110 drop-shadow-[0_0_10px_rgba(162,127,243,0.8)]"
                  : "text-white/80 group-hover:text-white"
              }`}
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

        {/* Action Button for finishing speaking turn if listening */}
        {isListening && !hasText && onFinishTurn && (
          <button
            type="button"
            onClick={onFinishTurn}
            aria-label="Finish speaking turn"
            title="Finish speaking turn (Enter)"
            className="w-[clamp(40px,5.8vh,54px)] h-[clamp(40px,5.8vh,54px)] rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 hover:bg-[#22c55e]/25 hover:border-[#22c55e]/60 flex items-center justify-center text-[#22c55e] transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Action Helper Micro-Text (Refined Inter Typography) */}
      <span className="font-sans text-xs sm:text-[13px] text-white/50 font-medium tracking-wide text-center pt-[clamp(6px,1vh,12px)]">
        {hasText
          ? "Press Enter or tap purple button to submit"
          : isThinking
            ? "AI is evaluating your response..."
            : isAiSpeaking
              ? "Listening to interviewer..."
              : isListening
                ? "Press Space to pause • Enter to finish"
                : "Tap mic or press Space to resume"}
      </span>
    </div>
  );
};
