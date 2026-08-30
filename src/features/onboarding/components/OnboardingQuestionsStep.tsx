import React, { useState } from "react";
import { OnboardingStepProgress } from "./OnboardingStepProgress";
import { LearnerProfileData } from "../types";

export interface OnboardingQuestionsStepProps {
  profile: LearnerProfileData;
  onUpdateProfile: (partial: Partial<LearnerProfileData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const GOALS = [
  { id: "tech", label: "Tech, AI & Software Engineering", value: "Tech Career & AI" },
  { id: "business", label: "Global Business & Remote Work", value: "Business & International Work" },
  { id: "fluency", label: "Natural Spoken Fluency & Travel", value: "Everyday Fluency & Travel" },
  { id: "academic", label: "Academic, TOEFL / IELTS Exams", value: "Academic & Exams" },
];

const STYLES = [
  { id: "conv", label: "Conversation First • Active speaking from Day 1", value: "Conversation First" },
  { id: "read", label: "Reading & Deep Vocabulary Analysis", value: "Reading First" },
  { id: "drill", label: "Real-world Scenario & Interview Drills", value: "Interview Drills" },
  { id: "bal", label: "Balanced • Adaptive mix of all skills", value: "Balanced" },
];

const COMMITMENTS = [
  { id: "10", label: "10 min / day • Quick daily boost", value: "10 min" },
  { id: "20", label: "20 min / day • Optimal progress", value: "20 min" },
  { id: "30", label: "30+ min / day • Fast-track mastery", value: "30 min" },
];

export const OnboardingQuestionsStep: React.FC<OnboardingQuestionsStepProps> = ({
  profile,
  onUpdateProfile,
  onNext,
  onPrev,
}) => {
  const [subStep, setSubStep] = useState<0 | 1 | 2 | 3>(0);
  const [professionInput, setProfessionInput] = useState(profile.profession || "");

  const handleNextSubStep = () => {
    if (subStep < 3) {
      setSubStep((prev) => (prev + 1) as 0 | 1 | 2 | 3);
    } else {
      if (professionInput.trim()) {
        onUpdateProfile({ profession: professionInput.trim() });
      }
      onNext();
    }
  };

  const handlePrevSubStep = () => {
    if (subStep > 0) {
      setSubStep((prev) => (prev - 1) as 0 | 1 | 2 | 3);
    } else {
      onPrev();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col mx-auto select-none overflow-hidden">
      {/* Left-Side Content Panel */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        {/* Top Spacer matching persistent LINGUA Header height */}
        <div className="shrink-0 h-5 sm:h-7" />

        {/* Middle: Question Content (Pure typography & borderless pills) */}
        <div className="flex-1 flex flex-col justify-center max-w-xl min-h-0 my-auto py-1">
          {/* Progress Indicator: 01 / 04 (25%) */}
          <OnboardingStepProgress
            currentStep={1}
            totalSteps={4}
            percentage={25}
            className="mb-3 sm:mb-4"
          />

          {/* Title */}
          <div className="space-y-1 mb-3 shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-light tracking-tight text-white leading-tight animate-[fadeSlideUp_0.4s_ease-out_both]">
              Hi, I&apos;m Lingua.
              <br />
              <span className="text-[#A27FF3] font-light">I&apos;ll be your AI Mentor.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#999a9b] font-light leading-relaxed animate-[fadeSlideUp_0.45s_ease-out_0.08s_both]">
              Let&apos;s calibrate your learning journey to fit your real goals.
            </p>
          </div>

          {/* Substep 0: Learning Goal */}
          {subStep === 0 && (
            <div className="space-y-2 mb-4 animate-[fadeSlideUp_0.4s_ease-out_both]">
              <label className="block text-xs sm:text-sm font-medium text-[#C4B5FD] mb-2 tracking-wide">
                1. What is your main objective with English?
              </label>
              <div className="flex flex-col space-y-1.5">
                {GOALS.map((g) => {
                  const selected = profile.learningGoal === g.value;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => onUpdateProfile({ learningGoal: g.value })}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                        selected
                          ? "bg-white/[0.08] text-white border border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                          : "bg-white/[0.02] hover:bg-white/[0.05] text-[#A1A1C2] border border-white/10 hover:text-white"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Substep 1: Learning Style */}
          {subStep === 1 && (
            <div className="space-y-2 mb-4 animate-[fadeSlideUp_0.4s_ease-out_both]">
              <label className="block text-xs sm:text-sm font-medium text-[#C4B5FD] mb-2 tracking-wide">
                2. How do you prefer to learn?
              </label>
              <div className="flex flex-col space-y-1.5">
                {STYLES.map((s) => {
                  const selected = profile.preferenceStyle === s.value;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onUpdateProfile({ preferenceStyle: s.value })}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                        selected
                          ? "bg-white/[0.08] text-white border border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                          : "bg-white/[0.02] hover:bg-white/[0.05] text-[#A1A1C2] border border-white/10 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Substep 2: Daily Commitment */}
          {subStep === 2 && (
            <div className="space-y-2 mb-4 animate-[fadeSlideUp_0.4s_ease-out_both]">
              <label className="block text-xs sm:text-sm font-medium text-[#C4B5FD] mb-2 tracking-wide">
                3. How much time can you practice daily?
              </label>
              <div className="flex flex-col space-y-1.5">
                {COMMITMENTS.map((c) => {
                  const selected = profile.dailyFocus === c.value;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onUpdateProfile({ dailyFocus: c.value })}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                        selected
                          ? "bg-white/[0.08] text-white border border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                          : "bg-white/[0.02] hover:bg-white/[0.05] text-[#A1A1C2] border border-white/10 hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Substep 3: Profession / Field */}
          {subStep === 3 && (
            <div className="space-y-2 mb-4 animate-[fadeSlideUp_0.4s_ease-out_both]">
              <label className="block text-xs sm:text-sm font-medium text-[#C4B5FD] mb-1.5 tracking-wide">
                4. What is your profession or specialty?
              </label>
              <p className="text-[11px] text-[#71719A] font-light mb-2">
                I will tailor conversation topics and vocabulary to your career.
              </p>
              <div className="relative border-b border-white/20 focus-within:border-[#8B5CF6] transition-colors py-1.5">
                <input
                  type="text"
                  value={professionInput}
                  onChange={(e) => {
                    setProfessionInput(e.target.value);
                    onUpdateProfile({ profession: e.target.value });
                  }}
                  placeholder="e.g. Software Engineer, Doctor, Designer, Student..."
                  className="w-full bg-transparent text-sm text-white placeholder-[#555570] outline-none"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevSubStep}
              className="flex items-center text-xs sm:text-sm font-light text-[#9999B5] hover:text-white hover:-translate-x-0.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>

            <button
              onClick={handleNextSubStep}
              className="group inline-flex items-center justify-center px-8 sm:px-12 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{subStep === 3 ? "Continue" : "Next"}</span>
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
