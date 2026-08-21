import React from "react";

export interface ConversationOrbHeroProps {
  statusText?: string;
  subtitleText?: string;
  isListening?: boolean;
  isAiSpeaking?: boolean;
  isThinking?: boolean;
  processingStage?: "IDLE" | "RECORDING" | "TRANSCRIBING" | "ANALYZING" | "PREPARING" | "SPEAKING";
  currentQuestionIndex?: number;
  totalQuestions?: number;
}

export const ConversationOrbHero: React.FC<ConversationOrbHeroProps> = ({
  statusText = "Ready for your answer",
  isThinking = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto shrink-0 -mt-2 sm:-mt-3 lg:-mt-4 animate-[fadeIn_0.35s_ease-out_both] font-sans">
      {/* 3D Glowing Purple Orb */}
      <div className="relative w-[clamp(140px,28vh,340px)] h-[clamp(140px,28vh,340px)] flex items-center justify-center shrink-0 pointer-events-none transition-all duration-300">
        <img
          src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png"
          alt="Glowing Purple Orb"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>

      {/* Status Indicator - Siguiente-Style Radiant Amethyst/Lavender Cosmic Gradient */}
      {statusText && (
        <div className="-mt-1 sm:-mt-2 lg:-mt-2.5 relative z-10 text-center shrink-0">
          <span
            className={`text-[clamp(16px,2.3vh,22px)] font-sans font-bold tracking-tight bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#DDD6FE] bg-clip-text text-transparent drop-shadow-[0_1px_6px_rgba(167,139,250,0.3)] transition-all duration-300 ${
              isThinking ? "animate-pulse opacity-80" : ""
            }`}
          >
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};
