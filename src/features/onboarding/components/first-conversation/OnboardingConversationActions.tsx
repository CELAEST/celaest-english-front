import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingConversationActionsProps {
  onPrev: () => void;
  onNext: () => void;
}

export const OnboardingConversationActions: React.FC<OnboardingConversationActionsProps> = ({
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex items-center justify-between pt-2 max-w-lg animate-[fadeSlideUp_0.35s_ease-out]">
      <button
        type="button"
        onClick={onPrev}
        className="flex items-center text-xs sm:text-sm font-light text-[#9999B5] hover:text-white hover:-translate-x-0.5 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        className="group inline-flex items-center justify-center px-8 sm:px-12 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(124,58,237,0.8)] hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span>View Learning Roadmap</span>
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
};
