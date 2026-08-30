import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";

interface MemorySpeakingBackProps {
  card: MemoryCard;
}

export const MemorySpeakingBack: React.FC<MemorySpeakingBackProps> = ({ card }) => {
  const translationSpanish = card.translationSpanish;
  const grammarExplanation = card.grammarExplanation;

  return (
    <div className="flex flex-col justify-center gap-3.5 sm:gap-4 lg:gap-5 my-auto py-1 z-10 overflow-hidden">
      {/* Optional Specific Error Word vs Correct Word Diff */}
      {(card.errorWord || card.correctWord) && (
        <div className="space-y-1">
          <span className="block text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8E90A6]">
            CORRECCIÓN ESPECÍFICA
          </span>
          <div className="flex items-center gap-2 text-sm sm:text-base font-mono pl-3 border-l-2 border-white/[0.15]">
            {card.errorWord && (
              <span className="line-through text-[#F87171] opacity-90">
                {card.errorWord}
              </span>
            )}
            {card.errorWord && card.correctWord && (
              <span className="text-white/30">→</span>
            )}
            {card.correctWord && (
              <span className="font-semibold text-[#4ADE80]">
                {card.correctWord}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 1. Spanish Translation */}
      <div className="space-y-1">
        <span className="block text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A27FF3]">
          TRADUCCIÓN
        </span>
        <p className="text-base sm:text-lg font-medium text-white/95 leading-snug sm:leading-relaxed pl-3 border-l-2 border-[#A27FF3]/40 line-clamp-3">
          {translationSpanish}
        </p>
      </div>

      {/* Subtle Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* 2. Grammar Explanation */}
      <div className="space-y-1">
        <span className="block text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#55c9a4]">
          POR QUÉ / EXPLICACIÓN
        </span>
        <p className="text-xs sm:text-[13.5px] font-normal text-[#CBD5E1] leading-relaxed pl-3 border-l-2 border-[#55c9a4]/40 line-clamp-4">
          {grammarExplanation}
        </p>
      </div>
    </div>
  );
};
