import React from 'react';
import { OnboardingStepProgress } from './OnboardingStepProgress';

export interface OnboardingQuestionsStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export const OnboardingQuestionsStep: React.FC<OnboardingQuestionsStepProps> = ({ onNext, onPrev }) => {
  return (
    <div className="relative w-full h-full flex flex-col mx-auto">


      {/* Left-Side Content Panel */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-6 sm:py-8">
        {/* Top Spacer matching persistent LINGUA Header height */}
        <div className="h-6 sm:h-8" />

        {/* Middle: Question Content (Clean Flex-Col layout with zero overlap) */}
        <div className="flex-1 flex flex-col justify-center max-w-lg my-auto py-2">
          {/* Reusable Progress Indicator Component */}
          <OnboardingStepProgress currentStep={1} totalSteps={4} percentage={25} />

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-[36px] lg:text-[42px] font-light tracking-tight text-white leading-[1.12] mb-2.5 sm:mb-3.5 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.12s_both]">
            Hi, I'm Lingua.<br />
            <span className="text-[#A27FF3] font-light">
              I'll be your AI Mentor.
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#999a9b] font-light leading-relaxed mb-6 sm:mb-8 max-w-md animate-[fadeSlideUp_0.5s_ease-out_0.18s_both]">
            Before I can create your personalized<br />
            learning journey, I want to understand<br />
            what you need and how you learn best.
          </p>

          {/* Question Label */}
          <label className="block text-base sm:text-lg font-normal text-[#A78BFA] mb-3 sm:mb-4 animate-[fadeSlideUp_0.45s_ease-out_0.24s_both]">
            Why do you want to learn English?
          </label>

          {/* Input Field */}
          <div className="relative mb-2.5 animate-[fadeSlideUp_0.45s_ease-out_0.3s_both]">
            <input
              type="text"
              placeholder="Type your answer..."
              className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-transparent border border-[#2A2A42] rounded-xl text-slate-200 placeholder-[#555570] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/50 transition-all text-sm sm:text-base font-light"
            />
          </div>
          <p className="text-[12px] sm:text-[13px] text-[#71719A] font-light mb-3 sm:mb-10 animate-[fadeSlideUp_0.45s_ease-out_0.34s_both]">
            Be honest — this helps me personalize everything for you.
          </p>

          {/* Navigation Buttons (Nudged 10px Down & Balanced Spacing) */}
          <div className="flex items-center space-x-20 sm:space-x-28 pt-2.5 animate-[fadeSlideUp_0.45s_ease-out_0.38s_both]">
            <button
              onClick={onPrev}
              className="flex items-center text-sm font-light text-[#9999B5] hover:text-white hover:-translate-x-1 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>

            <button
              onClick={onNext}
              className="group inline-flex items-center justify-center px-10 sm:px-14 py-3 sm:py-3.5 text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Next</span>
              <svg className="w-4 h-4 ml-3 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-2" />
      </div>
    </div>
  );
};
