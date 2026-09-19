import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";
import { HighlightWord } from "./HighlightWord";
import { Volume2 } from "lucide-react";

interface MemoryReadingFrontProps {
  card: MemoryCard;
  isPlayingAudio: boolean;
  onPlayVoice: (e: React.MouseEvent) => void;
}

export const MemoryReadingFront: React.FC<MemoryReadingFrontProps> = ({
  card,
  isPlayingAudio,
  onPlayVoice,
}) => {
  const term =
    card.errorWord ||
    (card.betterWay && card.betterWay.length < 30 ? card.betterWay : card.userSaid) ||
    "Vocabulary Term";

  const rawContext =
    card.userSaid && card.userSaid !== term
      ? card.userSaid
      : card.betterWay && card.betterWay !== term
        ? card.betterWay
        : "";

  const cleanedSentence = rawContext
    ? rawContext.replace(/^["'“”«»\s]+|["'“”«»\s]+$/g, "").trim()
    : "";

  return (
    <div className="flex flex-col justify-center space-y-4 sm:space-y-6 my-auto py-1 sm:py-2 z-10 select-none">
      {/* 1. TECHNICAL TERM Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="block text-[10.5px] sm:text-[11px] font-mono uppercase tracking-widest text-[#A27FF3] font-medium">
            VOCABULARY TERM
          </span>

          {/* Clean Audio Speaker */}
          <button
            type="button"
            onClick={onPlayVoice}
            aria-label="Listen to pronunciation"
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              isPlayingAudio
                ? "text-[#A27FF3] bg-[#A27FF3]/15 shadow-[0_0_12px_rgba(162,127,243,0.4)]"
                : "text-white/40 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-pulse" : ""}`} />
          </button>
        </div>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-wide pl-3 sm:pl-3.5 border-l-2 border-[#A27FF3]">
          {term}
        </h3>
      </div>

      {/* Subtle Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* 2. CONTEXT IN READING Section */}
      {cleanedSentence && (
        <div className="space-y-2">
          <span className="block text-[10.5px] sm:text-[11px] font-mono uppercase tracking-widest text-[#34D399]/90 font-medium">
            CONTEXT IN READING
          </span>
          <p className="text-sm sm:text-base lg:text-lg font-normal text-white/90 leading-relaxed pl-3 sm:pl-3.5 border-l-2 border-[#34D399]/70 line-clamp-5 sm:line-clamp-none">
            “<HighlightWord
              sentence={cleanedSentence}
              word={term}
              color="#34D399"
            />”
          </p>
        </div>
      )}
    </div>
  );
};
