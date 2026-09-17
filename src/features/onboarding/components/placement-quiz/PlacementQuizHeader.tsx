import React from "react";
import { OnboardingStepProgress } from "../OnboardingStepProgress";

export interface PlacementQuizHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const PlacementQuizHeader: React.FC<PlacementQuizHeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
}) => {
  return (
    <div className="space-y-1.5 mb-3 sm:mb-4 shrink-0">
      <OnboardingStepProgress
        currentStep={3}
        totalSteps={4}
        percentage={60}
        className="mb-2 sm:mb-3"
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-widest text-[#A78BFA]">
          Quick Placement • Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-[32px] font-light tracking-tight text-white leading-tight">
        Calibrate Your Baseline Level
      </h1>
      <p className="text-xs sm:text-sm text-white/50 font-light leading-relaxed">
        Choose the best option to complete the workplace sentence. This adapts the conversation to your level.
      </p>
    </div>
  );
};
