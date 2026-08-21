import React from 'react';
import { OnboardingStepProgress } from './OnboardingStepProgress';
import { OnboardingProfileCard, type ProfileMetric } from './OnboardingProfileCard';

export interface OnboardingReadyStepProps {
  onStartLearning: () => void;
  onPrev: () => void;
}

/** SVG icons for each profile metric row — SRP: kept inline as small JSX */
const LevelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M7 16l4-8 4 6 5-10" />
  </svg>
);

const ConversationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
  </svg>
);

const ConfidenceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PronunciationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 10v3" />
    <path d="M6 6v11" />
    <path d="M10 3v18" />
    <path d="M14 8v7" />
    <path d="M18 5v13" />
    <path d="M22 10v3" />
  </svg>
);

const TopicsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
  </svg>
);

const LearningStyleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

/** Profile metrics data matching the exact mockup */
const PROFILE_METRICS: ProfileMetric[] = [
  { icon: <LevelIcon />, label: 'Level', value: 'B1' },
  { icon: <ConversationIcon />, label: 'Conversation Style', value: 'Excellent' },
  { icon: <ConfidenceIcon />, label: 'Confidence', value: 'Medium' },
  { icon: <PronunciationIcon />, label: 'Pronunciation', value: 'Strong' },
  { icon: <TopicsIcon />, label: 'Topics', value: 'Programming • AI • Automation' },
  { icon: <LearningStyleIcon />, label: 'Learning Style', value: 'Conversation First' },
];

export const OnboardingReadyStep: React.FC<OnboardingReadyStepProps> = ({
  onStartLearning,
  onPrev,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col mx-auto overflow-hidden">


      {/* Content Panel */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        {/* Top Spacer matching persistent LINGUA Header height */}
        <div className="shrink-0 h-5 sm:h-7" />

        {/* Middle Content Section */}
        <div className="flex-1 flex flex-col justify-center max-w-lg min-h-0 my-auto py-1 overflow-y-auto custom-scrollbar">
          {/* Progress Indicator: 04 / 04 (100%) */}
          <OnboardingStepProgress
            currentStep={4}
            totalSteps={4}
            percentage={100}
            className="mb-3 sm:mb-5"
          />

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-[36px] lg:text-[42px] font-light tracking-tight text-white leading-[1.12] mb-2 sm:mb-2.5 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.12s_both]">
            Your AI Mentor<br />
            <span className="text-[#A27FF3] font-light">
              is ready.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#999a9b] font-light leading-relaxed mb-5 sm:mb-6 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.18s_both]">
            I've analyzed your answers, our conversation,<br />
            and created your personalized learning plan.
          </p>

          {/* Profile Summary Card */}
          <div className="mb-5 sm:mb-6 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.24s_both]">
            <OnboardingProfileCard metrics={PROFILE_METRICS} />
          </div>

          {/* Motivational Closing Lines */}
          <div className="mb-4 sm:mb-5 shrink-0 animate-[fadeSlideUp_0.45s_ease-out_0.3s_both]">
            <p className="text-xs sm:text-sm text-[#C8C8E0] font-light leading-relaxed">
              I won't teach you like everyone else.
            </p>
            <p className="text-xs sm:text-sm text-[#B996FF] font-light leading-relaxed mt-0.5">
              I'll adapt every lesson based on how you learn.
            </p>
          </div>

          {/* Navigation Buttons — Positioned higher up directly below text */}
          <div className="shrink-0 flex items-center gap-4 pt-1 max-w-lg animate-[fadeSlideUp_0.45s_ease-out_0.36s_both]">
            {/* Back Button */}
            <button
              onClick={onPrev}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#13102B] border border-[#2A244D] text-[#A699CD] hover:text-white hover:border-[#4B3B82] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)]"
              aria-label="Back"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            {/* Start Learning Button */}
            <button
              onClick={onStartLearning}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3 sm:py-3.5 bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] text-white text-xs sm:text-sm font-medium rounded-full shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
              aria-label="Start Learning"
            >
              <span>Start Learning</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
