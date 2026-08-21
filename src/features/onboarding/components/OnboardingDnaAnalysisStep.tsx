import React, { useState, useEffect } from 'react';
import { OnboardingStepProgress } from './OnboardingStepProgress';
import { OnboardingDnaCard } from './OnboardingDnaCard';

export interface OnboardingDnaAnalysisStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export interface DnaItem {
  id: string;
  title: string;
  subtitle: string;
}

export const OnboardingDnaAnalysisStep: React.FC<OnboardingDnaAnalysisStepProps> = ({
  onNext,
  onPrev,
}) => {
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);

  const dnaItems: DnaItem[] = [
    {
      id: 'career',
      title: 'Career goal detected',
      subtitle: 'You want to grow in Programming and AI.',
    },
    {
      id: 'topics',
      title: 'Preferred topics',
      subtitle: 'Programming • AI • Automation',
    },
    {
      id: 'confidence',
      title: 'Speaking confidence',
      subtitle: 'Medium',
    },
    {
      id: 'practice',
      title: 'Daily practice',
      subtitle: '20 minutes',
    },
    {
      id: 'style',
      title: 'Learning style',
      subtitle: 'Conversation-first learner',
    },
    {
      id: 'roadmap',
      title: 'Personalized roadmap',
      subtitle: 'Strategy created just for you',
    },
  ];

  const isFinished = completedIndices.length === dnaItems.length;

  // Progressive analysis animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedIndices((prev) => {
        if (prev.length < dnaItems.length) {
          return [...prev, prev.length];
        }
        clearInterval(timer);
        return prev;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [dnaItems.length]);

  /** Skip animation only completes the items locally without advancing to the next step */
  const handleSkip = () => {
    setCompletedIndices(dnaItems.map((_, i) => i));
  };

  return (
    <div className="relative w-full h-full flex flex-col mx-auto overflow-hidden">
      {/* Left-Side Content Panel */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        {/* Top Spacer matching persistent LINGUA Header height */}
        <div className="shrink-0 h-5 sm:h-7" />

        {/* Middle Content Section */}
        <div className="flex-1 flex flex-col justify-center max-w-lg min-h-0 my-auto py-1">
          {/* Progress Indicator: 02 / 04 (50%) */}
          <OnboardingStepProgress
            currentStep={2}
            totalSteps={4}
            percentage={50}
            className="mb-3 sm:mb-5"
          />

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-[36px] lg:text-[42px] font-light tracking-tight text-white leading-[1.12] mb-2 sm:mb-2.5 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.12s_both]">
            Building your<br />
            <span className="text-[#A27FF3] font-light">
              Learning DNA.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#999a9b] font-light leading-relaxed mb-3 sm:mb-4 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.18s_both]">
            I'm analyzing your answers to understand how you learn.<br />
            This only takes a few seconds.
          </p>

          {/* 6 DNA Checklist Cards */}
          <div className="space-y-1.5 sm:space-y-2 max-w-md mb-4 sm:mb-5 overflow-y-auto custom-scrollbar max-h-[230px] sm:max-h-[280px] md:max-h-[320px] lg:max-h-none pr-1.5 animate-[fadeSlideUp_0.5s_ease-out_0.24s_both]">
            {dnaItems.map((item, index) => {
              const isChecked = completedIndices.includes(index);
              return (
                <OnboardingDnaCard
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  isChecked={isChecked}
                />
              );
            })}
          </div>

          {/* Bottom Actions:
              - While animating: 'Skip animation' button
              - When finished/skipped: 'Back' button (identical to Step 1 Questions)
          */}
          <div className="flex items-center justify-between max-w-md pt-1 animate-[fadeSlideUp_0.45s_ease-out_0.3s_both]">
            {!isFinished ? (
              /* Skip Animation Button (Only skips animation locally, does NOT advance step) */
              <button
                onClick={handleSkip}
                className="flex items-center text-xs sm:text-sm font-light text-[#8E8EB3] hover:text-white hover:scale-105 transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#262640] flex items-center justify-center mr-2.5 group-hover:border-[#555580] transition-colors">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9999C2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </div>
                <span>Skip animation</span>
              </button>
            ) : (
              /* Back Button (Identical styling as Step 1 Questions: arrow + 'Back') */
              <button
                onClick={onPrev}
                className="flex items-center text-sm font-light text-[#9999B5] hover:text-white hover:-translate-x-1 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>
            )}

            {/* Continue Button */}
            <button
              onClick={onNext}
              className="group inline-flex items-center justify-center px-8 sm:px-12 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Continue</span>
              <svg className="w-3.5 h-3.5 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="shrink-0 h-1 sm:h-2" />
      </div>
    </div>
  );
};
