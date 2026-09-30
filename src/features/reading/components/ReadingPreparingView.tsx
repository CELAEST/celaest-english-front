import React, { useState, useEffect, useId } from "react";
import { VideoOrb } from "../../../design-system/components/Orb/VideoOrb";
import {
  StepCompletedCheckIcon,
  StepTopicTargetIcon,
  StepPersonalizeDnaIcon,
  StepFinalizeBookIcon,
  NexusTopicRadarIcon,
  NexusNeuralDnaIcon,
  NexusLexiconCodexIcon,
} from "./ReadingBespokeIcons";

const STEP_SUBTITLES: Record<number, string> = {
  1: "Selecting optimal topic & CEFR target...",
  2: "Personalizing vocabulary & contextual nuances...",
  3: "Synthesizing personalized reading experience...",
};

const STEP_PERCENTAGES: Record<number, number> = {
  1: 34,
  2: 72,
  3: 98,
};

export const ReadingPreparingView: React.FC = React.memo(() => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const baseId = useId();
  const ringGradientId = `nexusOrbitGrad-${baseId}`;

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 1200);
    const timer2 = setTimeout(() => setCurrentStep(3), 2600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-[620px] h-full flex flex-col items-center justify-between sm:justify-center py-2 sm:py-4 pb-24 sm:pb-4 select-none animate-[fadeSlideUp_0.5s_ease-out_both] overflow-y-auto sm:overflow-visible mx-auto"
    >
      {/* 1. Top Orb & Hero Title — orbe video — fluido sin salto */}
      <div className="flex flex-col items-center text-center space-y-2 sm:space-y-2.5 shrink-0">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 flex items-center justify-center pointer-events-none shrink-0 -mt-2 sm:-mt-4 lg:-mt-6">
          <VideoOrb className="w-full h-full object-contain pointer-events-none mix-blend-screen" />
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-[26px] font-light text-[#f8f8f8] tracking-tight leading-snug relative z-10">
          Preparing your next reading...
        </h2>

        <p className="text-[11px] sm:text-xs lg:text-sm text-[#8e90a5] font-light leading-relaxed relative z-10 max-w-xs sm:max-w-sm">
          AI Mentor is selecting and tailoring the most relevant content for your level.
        </p>
      </div>

      {/* 2. Bespoke Holographic AI Synthesis Nexus Centerpiece */}
      <div className="flex flex-col items-center my-3 sm:my-6 lg:my-8 space-y-2 sm:space-y-4 shrink-0">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 flex items-center justify-center">
          {/* Ambient Deep Radial Violet Energy Halo */}
          <div className="absolute inset-0 rounded-full bg-[#7048E8]/20 blur-2xl pointer-events-none scale-110" />

          {/* Precision Concentric Orbital Radar SVG */}
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none"
            viewBox="0 0 160 160"
            aria-hidden="true"
          >
            {/* Outer Laser-Etched Cardinal Ticks Circle */}
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="#1a1b32"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="2 10.5"
            />

            {/* Inner Stable Track Ring */}
            <circle cx="80" cy="80" r="64" stroke="#121324" strokeWidth="3.5" fill="none" />

            {/* Sweeping Luminous Orbital Arc */}
            <circle
              cx="80"
              cy="80"
              r="64"
              stroke={`url(#${ringGradientId})`}
              strokeWidth="4"
              fill="none"
              strokeDasharray="402.12"
              strokeDashoffset={currentStep === 1 ? "260" : currentStep === 2 ? "120" : "15"}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />

            <defs>
              <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DDD6FE" />
                <stop offset="50%" stopColor="#A27FF3" />
                <stop offset="100%" stopColor="#7048E8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Naked Pure Floating Centerpiece — Clean Vector Icon & Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            {/* State-Morphing Holographic Glyph */}
            <div className="flex items-center justify-center transform transition-all duration-500 animate-[fadeIn_0.4s_ease-out_both]">
              {currentStep === 1 ? (
                <NexusTopicRadarIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-[#DDD6FE]" />
              ) : currentStep === 2 ? (
                <NexusNeuralDnaIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-[#DDD6FE]" />
              ) : (
                <NexusLexiconCodexIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-[#DDD6FE]" />
              )}
            </div>

            {/* Micro-Progress Percentage Tag */}
            <span className="text-[10px] sm:text-[11px] font-mono font-medium text-[#c4b5fd]/90 tabular-nums mt-1 sm:mt-1.5 tracking-wider">
              {STEP_PERCENTAGES[currentStep]}%
            </span>
          </div>
        </div>

        {/* Dynamic Phase Status Label */}
        <span className="text-[11px] sm:text-xs lg:text-[13px] font-medium text-[#C4B5FD] tracking-wide transition-all duration-300 text-center px-4">
          {STEP_SUBTITLES[currentStep] || "Preparing content..."}
        </span>
      </div>

      {/* 3. Bottom Step Timeline Progress Bar — 100% Symmetrical 3-Column Grid */}
      <div className="w-full max-w-[460px] px-3 sm:px-4 pt-1 sm:pt-2 flex flex-col items-center shrink-0">
        <div className="w-full relative">
          {/* Connecting Track Line Centered at top-[12px] on mobile (w-6 h-6) / top-[14px] on sm: (w-7 h-7) */}
          <div className="absolute left-[16.66%] right-[16.66%] top-[12px] sm:top-[14px] h-[2px] bg-[#16172e] z-0 -translate-y-1/2" />
          <div
            className="absolute left-[16.66%] top-[12px] sm:top-[14px] h-[2px] bg-[#7048E8] transition-all duration-700 ease-out z-0 -translate-y-1/2 shadow-[0_0_8px_rgba(112,72,232,0.8)]"
            style={{
              width: currentStep === 1 ? "0%" : currentStep === 2 ? "33.33%" : "66.66%",
            }}
          />

          {/* 3-Column Mathematical Step Grid */}
          <div className="w-full grid grid-cols-3 relative z-10">
            {/* Step 1: Selecting topic */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  currentStep >= 1
                    ? "bg-[#7048E8] border-[#A27FF3] shadow-[0_0_12px_rgba(112,72,232,0.6)]"
                    : "bg-[#0c0c1c] border-[#22243d]"
                }`}
              >
                {currentStep > 1 ? (
                  <StepCompletedCheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                ) : (
                  <StepTopicTargetIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs leading-tight mt-1.5 sm:mt-2.5 transition-colors duration-300 ${
                  currentStep >= 1 ? "text-[#f0f0f5] font-medium" : "text-[#71728a] font-light"
                }`}
              >
                Selecting topic
              </span>
            </div>

            {/* Step 2: Personalizing content */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  currentStep >= 2
                    ? "bg-[#A27FF3] border-[#DDD6FE] shadow-[0_0_16px_rgba(162,127,243,0.7)] scale-105"
                    : "bg-[#0c0c1c] border-[#22243d]"
                }`}
              >
                {currentStep > 2 ? (
                  <StepCompletedCheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                ) : currentStep === 2 ? (
                  <StepPersonalizeDnaIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" />
                ) : (
                  <StepPersonalizeDnaIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#5e6078]" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs leading-tight mt-1.5 sm:mt-2.5 transition-colors duration-300 ${
                  currentStep >= 2 ? "text-[#f0f0f5] font-medium" : "text-[#71728a] font-light"
                }`}
              >
                Personalizing<span className="hidden sm:inline"> content</span>
              </span>
            </div>

            {/* Step 3: Finalizing reading */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  currentStep >= 3
                    ? "bg-[#7048E8] border-[#A27FF3] shadow-[0_0_16px_rgba(112,72,232,0.7)] scale-105"
                    : "bg-[#0c0c1c] border-[#22243d]"
                }`}
              >
                {currentStep >= 3 ? (
                  <StepCompletedCheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                ) : (
                  <StepFinalizeBookIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#5e6078]" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs leading-tight mt-1.5 sm:mt-2.5 transition-colors duration-300 ${
                  currentStep >= 3 ? "text-[#f0f0f5] font-medium" : "text-[#71728a] font-light"
                }`}
              >
                Finalizing reading
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ReadingPreparingView.displayName = "ReadingPreparingView";
