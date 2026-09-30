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
  isActive?: boolean;
}

const ConversationOrbHeroInner: React.FC<ConversationOrbHeroProps> = ({
  isActive = true,
}) => {
  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto shrink-0 -mt-2 sm:-mt-3 lg:-mt-4 font-sans">
      {/* Clean Pure Video Orb — Zero aura rings, zero box-shadow line artifacts */}
      <div className="relative w-[clamp(160px,26vh,240px)] sm:w-[clamp(140px,28vh,340px)] h-[clamp(160px,26vh,240px)] sm:h-[clamp(140px,28vh,340px)] flex items-center justify-center shrink-0 pointer-events-none transition-all duration-300 rounded-full overflow-hidden">
        <VideoOrb isActive={isActive} className="w-full h-full object-contain pointer-events-none relative z-10" />
      </div>
    </div>
  );
};

export const ConversationOrbHero = React.memo(ConversationOrbHeroInner);

