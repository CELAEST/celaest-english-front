import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";
import {
  sanitizeQuotes,
  getDynamicDefinitionClass,
  getDynamicExplanationClass,
} from "./typographyHelpers";

interface MemorySpeakingBackProps {
  card: MemoryCard;
}

export const MemorySpeakingBack: React.FC<MemorySpeakingBackProps> = ({ card }) => {
  const cleanTranslation = sanitizeQuotes(card.translationSpanish);
  const cleanExplanation = sanitizeQuotes(card.grammarExplanation);

  const definitionClass = getDynamicDefinitionClass(cleanTranslation);
  const explanationClass = getDynamicExplanationClass(cleanExplanation);

  const isShortContent = cleanTranslation.length + cleanExplanation.length < 90;

  return (
    <div
      className={`flex flex-col justify-center ${
        isShortContent ? "space-y-6 sm:space-y-7" : "space-y-4 sm:space-y-5"
      } my-auto py-2 z-10 select-none`}
    >
      {/* 1. Specific Error Diff */}
      {(card.errorWord || card.correctWord) && (
        <div className="space-y-1.5 pl-3.5 border-l-2 border-white/20">
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
      {cleanTranslation && (
        <div className="space-y-1.5 pl-3.5 border-l-2 border-[#A27FF3]">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A27FF3]">
            Traducción al Español
          </span>
          <p className={`${definitionClass} text-white/95 leading-snug`}>
            “{cleanTranslation}”
          </p>
        </div>
      )}

      {/* Subtle Divider Line */}
      {cleanTranslation && cleanExplanation && (
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      )}

      {/* 3. Grammar Rule / Explanation */}
      {cleanExplanation && (
        <div className="space-y-1.5 pl-3.5 border-l-2 border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
            Grammar Rule & Context
          </span>
          <p className={`${explanationClass} leading-relaxed`}>
            {cleanExplanation}
          </p>
        </div>
      )}
    </div>
  );
};
