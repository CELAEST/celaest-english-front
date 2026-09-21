import React from "react";
import { VideoOrb } from "../../../design-system/components/Orb/VideoOrb";

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

const ConversationOrbHeroInner: React.FC<ConversationOrbHeroProps> = ({
  statusText = "Ready for your answer",
  isListening = false,
  isAiSpeaking = false,
  isThinking = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto shrink-0 -mt-2 sm:-mt-3 lg:-mt-4 animate-[fadeIn_0.35s_ease-out_both] font-sans">
      {/* Video Orb with dynamic ambient glow aura */}
      <div className="relative w-[clamp(160px,26vh,240px)] sm:w-[clamp(140px,28vh,340px)] h-[clamp(160px,26vh,240px)] sm:h-[clamp(140px,28vh,340px)] flex items-center justify-center shrink-0 pointer-events-none transition-all duration-300 overflow-hidden">
        {/* Ambient reactive aura layers */}
        {isListening && (
          <div
            aria-hidden="true"
            className="absolute inset-4 rounded-full pointer-events-none bg-gradient-to-r from-[#8B5CF6]/25 via-[#A27FF3]/30 to-[#8B5CF6]/25 blur-2xl animate-[softPulse_1.5s_ease-in-out_infinite]"
          />
        )}
        {isAiSpeaking && (
          <div
            aria-hidden="true"
            className="absolute inset-2 rounded-full pointer-events-none bg-gradient-to-r from-[#8B5CF6]/35 via-[#C4B5FD]/40 to-[#7C3AED]/35 blur-2xl animate-[softPulse_1.2s_ease-in-out_infinite]"
          />
        )}
        {isThinking && !isAiSpeaking && !isListening && (
          <div
            aria-hidden="true"
            className="absolute inset-6 rounded-full pointer-events-none bg-[#A78BFA]/20 blur-xl animate-[pulse_2s_infinite]"
          />
        )}
        <VideoOrb className="w-full h-full object-contain pointer-events-none relative z-10" />
      </div>

      {/* Status Indicator - Siguiente-Style Radiant Amethyst/Lavender Cosmic Gradient */}
      {statusText && (
        <div className="-mt-1 sm:-mt-2 lg:-mt-2.5 relative z-10 text-center shrink-0">
          <span
            className={`text-[clamp(14px,1.9vh,18px)] sm:text-[clamp(16px,2.3vh,22px)] font-sans font-bold tracking-tight bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#DDD6FE] bg-clip-text text-transparent drop-shadow-[0_1px_6px_rgba(167,139,250,0.3)] transition-all duration-300 ${
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

export const ConversationOrbHero = React.memo(ConversationOrbHeroInner);

