import React from "react";

export interface OnboardingGenericStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export const OnboardingGenericStep: React.FC<OnboardingGenericStepProps> = ({ onNext, onPrev }) => {
  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center z-10 my-auto px-4">
      {/* Left Question Flow */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white leading-tight">
            Hi, I'm Lingua. <br />
            <span className="text-slate-300">I'll be your AI Mentor.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
            Before I can create your personalized learning journey, I want to understand what you
            need and how you learn best.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <label className="block text-xs sm:text-sm font-medium text-violet-300">
            Why do you want to learn English?
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Type your answer..."
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-xs sm:text-sm backdrop-blur-md"
            />
          </div>
          <p className="text-[11px] sm:text-[12px] text-slate-500 font-light">
            Be honest — this helps me personalize everything for you.
          </p>
        </div>

        <div className="flex items-center space-x-4 pt-2">
          <button
            onClick={onPrev}
            className="px-5 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <button
            onClick={onNext}
            className="px-7 py-2 text-xs font-medium text-white rounded-full bg-[#6366F1] hover:bg-[#4F46E5] shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center cursor-pointer"
          >
            <span>Next</span>
            <svg className="w-3.5 h-3.5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Side Step Visualization */}
      <div className="flex justify-center">
        <div
          className="w-56 h-56 sm:w-72 sm:h-72 bg-center bg-contain bg-no-repeat drop-shadow-[0_0_40px_rgba(124,58,237,0.5)]"
          style={{ backgroundImage: "url('/assets/pure_hero_orb_bg.png')" }}
        />
      </div>
    </div>
  );
};
