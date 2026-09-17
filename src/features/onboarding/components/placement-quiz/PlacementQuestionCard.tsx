import React from "react";
import { PlacementQuestion } from "../../services/onboardingPlacementQuizService";

export interface PlacementQuestionCardProps {
  question: PlacementQuestion;
  selectedIndex: number | null;
  onSelectOption: (index: number) => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export const PlacementQuestionCard: React.FC<PlacementQuestionCardProps> = ({
  question,
  selectedIndex,
  onSelectOption,
}) => {
  return (
    <div key={question.id} className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 animate-[fadeSlideUp_0.3s_ease-out_both]">
      {/* Question Sentence */}
      <div className="py-1">
        <p className="text-sm sm:text-base md:text-[17px] text-white/95 font-light leading-relaxed">
          {question.prompt}
        </p>
        <span className="inline-block mt-1 text-[10.5px] font-mono tracking-wider text-white/40">
          {question.contextHint}
        </span>
      </div>

      {/* Options List */}
      <div className="flex flex-col space-y-1.5">
        {question.options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelectOption(idx)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-white/[0.12] text-white font-medium shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                  : "bg-white/[0.02] hover:bg-white/[0.06] text-white/70 hover:text-white"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-mono shrink-0 transition-colors ${
                  isSelected ? "bg-white text-black font-semibold" : "bg-white/[0.04] text-white/50"
                }`}
              >
                {OPTION_LETTERS[idx]}
              </span>
              <span className="flex-1 truncate">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
