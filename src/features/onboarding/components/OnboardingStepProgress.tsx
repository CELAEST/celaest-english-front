import React from 'react';

export interface OnboardingStepProgressProps {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  className?: string;
}

export const OnboardingStepProgress: React.FC<OnboardingStepProgressProps> = ({
  currentStep,
  totalSteps,
  percentage,
  className = 'mb-6 sm:mb-10',
}) => {
  const formattedCurrent = currentStep < 10 ? `0${currentStep}` : `${currentStep}`;
  const formattedTotal = totalSteps < 10 ? `0${totalSteps}` : `${totalSteps}`;

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <span className="text-[13px] sm:text-sm text-white font-light">
        <span className="font-medium">{formattedCurrent}</span>
        <span className="text-[#71719A]"> / {formattedTotal}</span>
      </span>
      <div className="flex-1 h-[2px] bg-[#1A1A2E] rounded-full overflow-hidden max-w-[280px]">
        <div
          className="h-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[13px] sm:text-sm text-[#71719A] font-light">{percentage}%</span>
    </div>
  );
};
