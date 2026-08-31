import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";

interface MemorySpeakingBackProps {
  card: MemoryCard;
}

export const MemorySpeakingBack: React.FC<MemorySpeakingBackProps> = ({ card }) => {
  const translationSpanish = card.translationSpanish;
  const grammarExplanation = card.grammarExplanation;

  return (
    <div className="flex flex-col justify-center space-y-5 my-auto py-2 z-10 select-none">
      {/* 1. Specific Error Diff */}
      {(card.errorWord || card.correctWord) && (
        <div className="space-y-1.5 pl-3 border-l border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
            Correction Syntax Diff
          </span>
          <div className="flex items-center gap-2 text-sm sm:text-base font-mono">
            {card.errorWord && (
              <span className="line-through text-[#F87171] opacity-80">
                {card.errorWord}
              </span>
            )}
            {card.errorWord && card.correctWord && (
              <span className="text-white/30">→</span>
            )}
            {card.correctWord && (
              <span className="font-semibold text-[#34D399]">
                {card.correctWord}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Spanish Translation */}
      {translationSpanish && (
        <div className="space-y-1.5 pl-3 border-l border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A27FF3]">
            Traducción al Español
          </span>
          <p className="text-sm sm:text-base font-normal text-white/90 leading-relaxed">
            "{translationSpanish}"
          </p>
        </div>
      )}

      {/* Subtle Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* 3. Grammar Rule / Explanation */}
      {grammarExplanation && (
        <div className="space-y-1.5 pl-3 border-l border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
            Grammar Rule & Context
          </span>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {grammarExplanation}
          </p>
        </div>
      )}
    </div>
  );
};
