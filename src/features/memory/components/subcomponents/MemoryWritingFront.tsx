import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";
import { HighlightWord } from "./HighlightWord";
import { Volume2 } from "lucide-react";
import { getDynamicSpeakingSentenceClass } from "./typographyHelpers";

interface MemoryWritingFrontProps {
  card: MemoryCard;
  isPlayingAudio: boolean;
  onPlayVoice: (e: React.MouseEvent) => void;
}

export const MemoryWritingFront: React.FC<MemoryWritingFrontProps> = ({
  card,
  isPlayingAudio,
  onPlayVoice,
}) => {
  const userSaidClass = getDynamicSpeakingSentenceClass(card.userSaid || "");
  const betterWayClass = getDynamicSpeakingSentenceClass(card.betterWay || "");
  const totalLength = (card.userSaid || "").length + (card.betterWay || "").length;
  const isLongSentences = totalLength > 120;

  return (
    <div
      className={`flex flex-col justify-center ${
        isLongSentences ? "space-y-3 sm:space-y-4" : "space-y-4 sm:space-y-6"
      } my-auto py-1 sm:py-2 z-10 select-none`}
    >
      {/* 1. YOU WROTE Section */}
      <div className="space-y-1.5 sm:space-y-2">
        <span className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#F59E0B]/80 font-medium">
          ORIGINAL DRAFT
        </span>
        <p className={`${userSaidClass} text-white/90 pl-3 sm:pl-3.5 border-l-2 border-[#F59E0B]/50`}>
          "
          <HighlightWord
            sentence={card.userSaid}
            word={card.errorWord || ""}
            color="#F59E0B"
          />
          "
        </p>
      </div>

      {/* Subtle Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* 2. EXECUTIVE POLISH Section */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between">
          <span className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#34D399]/80 font-medium">
            EXECUTIVE POLISH (C2 BREVITY)
          </span>

          {/* Clean Audio Speaker */}
          <button
            type="button"
            onClick={onPlayVoice}
            aria-label="Listen to pronunciation"
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              isPlayingAudio
                ? "text-[#34D399] bg-[#34D399]/15 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                : "text-white/40 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-pulse" : ""}`} />
          </button>
        </div>

        <p className={`${betterWayClass} text-white pl-3 sm:pl-3.5 border-l-2 border-[#34D399]/70`}>
          "
          <HighlightWord
            sentence={card.betterWay}
            word={card.correctWord || ""}
            color="#34D399"
          />
          "
        </p>
      </div>
    </div>
  );
};
