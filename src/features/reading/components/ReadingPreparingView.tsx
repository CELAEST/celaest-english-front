import React, { useState, useEffect } from "react";

export interface ReadingPreparingViewProps {
  onComplete?: () => void;
}

export const ReadingPreparingView: React.FC<ReadingPreparingViewProps> = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 1000);
    const timer2 = setTimeout(() => setCurrentStep(3), 2200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full max-w-[620px] h-full flex flex-col items-center justify-center py-4 select-none animate-[fadeSlideUp_0.5s_ease-out_both] overflow-visible">
      {/* Top Orb & Hero Title */}
      <div className="flex flex-col items-center text-center space-y-3 shrink-0">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center pointer-events-none shrink-0">
          <img
            src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png"
            alt="Glowing Purple Orb"
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain max-w-none -mt-8"
          />
        </div>

        <h2 className="text-2xl sm:text-[26px] font-normal text-[#f5f5f5] tracking-wide relative z-10">
          Preparing your next reading...
        </h2>

        <p className="text-sm text-[#b4b4b4] font-light leading-relaxed relative z-10">
          AI Mentor is selecting the most relevant<br />content for you.
        </p>
      </div>

      {/* Center Circular Progress Spinner with Sparkles */}
      <div className="flex flex-col items-center my-8 space-y-5 shrink-0">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer Ring SVG with Arc */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="#1a1433"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="#A27FF3"
              strokeWidth="4"
              fill="none"
              strokeDasharray="289"
              strokeDashoffset={currentStep === 1 ? "180" : currentStep === 2 ? "120" : "20"}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Sparkles Center */}
          <div className="absolute inset-0 flex items-center justify-center text-[#A27FF3]">
            {/* Top center sparkle */}
            <svg className="w-5 h-5 absolute -mt-4 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
            </svg>
            {/* Right sparkle */}
            <svg className="w-3 h-3 absolute ml-10 mt-6 animate-pulse delay-150 opacity-80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
            </svg>
            {/* Bottom left sparkle */}
            <svg className="w-3 h-3 absolute -ml-6 mt-10 animate-pulse delay-300 opacity-70" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
            </svg>
          </div>
        </div>

        <span className="text-sm font-medium text-[#A27FF3] tracking-wide animate-pulse">
          Analyzing your progress
        </span>
      </div>

      {/* Bottom Step Timeline Progress Bar */}
      <div className="w-full max-w-[420px] pt-4 flex flex-col items-center shrink-0">
        <div className="w-full flex justify-between relative px-4">
          
          {/* Connecting Horizontal Lines */}
          <div className="absolute left-8 right-8 top-[10px] h-[1.5px] bg-[#23154d] z-0" />
          <div
            className="absolute left-8 top-[10px] h-[1.5px] bg-[#7048E8] transition-all duration-700 ease-out z-0"
            style={{
              width: currentStep === 1 ? "0%" : currentStep === 2 ? "calc(50% - 32px)" : "calc(100% - 64px)",
            }}
          />

          {/* Step 1: Selecting topic */}
          <div className="flex flex-col items-center w-20 relative z-10">
            <div
              className={`w-[20px] h-[20px] rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= 1
                  ? "bg-[#7048E8]"
                  : "bg-[#05060c] border border-[#23154d]"
              }`}
            >
              <svg className="w-[12px] h-[12px] text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[11px] text-[#dcdcdc] font-normal whitespace-nowrap mt-3">
              Selecting topic
            </span>
          </div>

          {/* Step 2: Personalizing content */}
          <div className="flex flex-col items-center w-28 relative z-10">
            <div
              className={`w-[20px] h-[20px] rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= 2
                  ? "bg-[#A27FF3] shadow-[0_0_15px_rgba(162,127,243,0.5)]"
                  : "bg-[#05060c] border border-[#23154d]"
              }`}
            >
              {currentStep > 2 ? (
                <svg className="w-[12px] h-[12px] text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <div className="w-[8px] h-[8px] rounded-full bg-[#D4BFF9]" />
              )}
            </div>
            <span
              className={`text-[11px] whitespace-nowrap mt-3 ${
                currentStep >= 2 ? "text-[#dcdcdc] font-normal" : "text-[#8a8a9e] font-light"
              }`}
            >
              Personalizing content
            </span>
          </div>

          {/* Step 3: Finalizing reading */}
          <div className="flex flex-col items-center w-24 relative z-10">
            <div
              className={`w-[20px] h-[20px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 ${
                currentStep >= 3
                  ? "bg-[#7048E8] border-[#7048E8]"
                  : "bg-[#05060c] border-[#4c2d96]"
              }`}
            >
              {currentStep >= 3 && (
                <svg className="w-[12px] h-[12px] text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span
              className={`text-[11px] whitespace-nowrap mt-3 ${
                currentStep >= 3 ? "text-[#dcdcdc] font-normal" : "text-[#8a8a9e] font-light"
              }`}
            >
              Finalizing reading
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
