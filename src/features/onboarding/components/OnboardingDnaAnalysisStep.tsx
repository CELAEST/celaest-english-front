import React, { useState, useEffect } from "react";
import { OnboardingStepProgress } from "./OnboardingStepProgress";
import { OnboardingDnaCard } from "./OnboardingDnaCard";
import { LearnerProfileData } from "../types";

export interface OnboardingDnaAnalysisStepProps {
  profile: LearnerProfileData;
  onNext: () => void;
  onPrev: () => void;
}

export interface DnaItem {
  id: string;
  title: string;
  subtitle: string;
}

export const OnboardingDnaAnalysisStep: React.FC<OnboardingDnaAnalysisStepProps> = ({
  profile,
  onNext,
  onPrev,
}) => {
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);

  const dnaItems: DnaItem[] = [
    {
      id: "career",
      title: "Career focus calibrated",
      subtitle: `Targeted for: ${profile.profession || "Software & Technology"}`,
    },
    {
      id: "goal",
      title: "Primary goal configured",
      subtitle: profile.learningGoal || "Tech Career & AI",
    },
    {
      id: "style",
      title: "Learning methodology",
      subtitle: profile.preferenceStyle || "Conversation First",
    },
    {
      id: "practice",
      title: "Daily commitment",
      subtitle: `${profile.dailyFocus || "20 min"} active daily practice`,
    },
    {
      id: "mesh",
      title: "CEFR Diagnostic Mesh",
      subtitle: "Initializing speech & syntax evaluator",
    },
    {
      id: "roadmap",
      title: "Personalized path ready",
      subtitle: "Preparing quick conversational assessment",
    },
  ];

  const isFinished = completedIndices.length === dnaItems.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedIndices((prev) => {
        if (prev.length < dnaItems.length) {
          return [...prev, prev.length];
        }
        clearInterval(timer);
        return prev;
      });
    }, 450);

    return () => clearInterval(timer);
  }, [dnaItems.length]);

  const handleSkip = () => {
    setCompletedIndices(dnaItems.map((_, i) => i));
  };

  return (
    <div className="relative w-full h-full flex flex-col mx-auto select-none overflow-hidden">
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
            className="mb-3 sm:mb-4"
          />

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-[36px] font-light tracking-tight text-white leading-[1.12] mb-1.5 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.12s_both]">
            Synthesizing your
            <br />
            <span className="text-[#A27FF3] font-light">Learning Profile.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#999a9b] font-light leading-relaxed mb-3 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.18s_both]">
            Adapting curriculum, vocabulary modules, and AI mentor tone.
          </p>

          {/* 6 Clean DNA Items */}
          <div className="space-y-1.5 max-w-md mb-3 overflow-y-auto custom-scrollbar max-h-[240px] sm:max-h-[280px] pr-1 animate-[fadeSlideUp_0.5s_ease-out_0.24s_both]">
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

          {/* Bottom Actions */}
          <div className="flex items-center justify-between max-w-md pt-1 animate-[fadeSlideUp_0.45s_ease-out_0.3s_both]">
            {!isFinished ? (
              <button
                onClick={handleSkip}
                className="flex items-center text-xs sm:text-sm font-light text-[#8E8EB3] hover:text-white hover:scale-105 transition-all cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full border border-[#262640] flex items-center justify-center mr-2 group-hover:border-[#555580] transition-colors">
                  <svg className="w-3 h-3 text-[#9999C2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </div>
                <span>Skip animation</span>
              </button>
            ) : (
              <button
                onClick={onPrev}
                className="flex items-center text-xs sm:text-sm font-light text-[#9999B5] hover:text-white hover:-translate-x-0.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>
            )}

            <button
              onClick={onNext}
              className="group inline-flex items-center justify-center px-8 sm:px-12 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
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
