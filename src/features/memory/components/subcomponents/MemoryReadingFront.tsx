import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";
import { HighlightWord } from "./HighlightWord";

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

  const contextSentence =
    card.userSaid && card.userSaid !== term
      ? card.userSaid
      : card.betterWay !== term
        ? card.betterWay
        : "";

  return (
    <div className="flex flex-col justify-center gap-4 sm:gap-5 lg:gap-6 my-auto py-1 z-10 overflow-hidden">
      {/* 1. VOCABULARY TERM Section */}
      <div className="space-y-1 sm:space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="block text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#A27FF3]">
            VOCABULARY TERM
          </span>

          {/* Pronunciation Audio Button */}
          <button
            type="button"
            onClick={onPlayVoice}
            aria-label="Listen to pronunciation"
            className={`p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#C4B5FD] hover:text-white hover:bg-[#7048E8]/40 hover:border-[#A27FF3] active:scale-95 transition-all cursor-pointer ${
              isPlayingAudio
                ? "bg-[#7048E8] text-white border-[#A27FF3] shadow-[0_0_12px_rgba(162,127,243,0.6)]"
                : ""
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </button>
        </div>

        <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight pl-3 border-l-2 border-[#A27FF3]/60">
          {term}
        </h3>
      </div>

      {/* Subtle Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* 2. CONTEXT SENTENCE Section */}
      {contextSentence && (
        <div className="space-y-1 sm:space-y-1.5">
          <span className="block text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#55c9a4]">
            CONTEXT IN READING
          </span>
          <p className="text-base sm:text-lg font-normal text-white/85 leading-snug sm:leading-relaxed pl-3 border-l-2 border-[#55c9a4]/40 line-clamp-3">
            <HighlightWord
              sentence={contextSentence}
              word={term}
              color="#A27FF3"
            />
          </p>
        </div>
      )}
    </div>
  );
};
