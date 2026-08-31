import React from "react";

export interface ConversationProgressWidgetProps {
  currentQuestion?: number;
  totalQuestions?: number;
  remainingSeconds?: number;
  totalSeconds?: number;
}

export const ConversationProgressWidget: React.FC<ConversationProgressWidgetProps> = ({
  currentQuestion = 3,
  totalQuestions = 8,
  remainingSeconds = 42,
  totalSeconds = 60,
}) => {
  const dashArray = Array.from({ length: totalQuestions });
  const progressPercentage = (remainingSeconds / totalSeconds) * 100;

  return (
    <div className="absolute top-20 sm:top-24 right-8 sm:right-12 z-20 flex flex-col items-end space-y-4 select-none animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
      {/* Question Progress */}
      <div className="flex flex-col items-end space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
          Question <span className="text-white font-light">{currentQuestion}</span> of{" "}
          {totalQuestions}
        </span>
        <div className="flex space-x-1.5">
          {dashArray.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-5 sm:w-6 rounded-full transition-all duration-300 ${
                i < currentQuestion
                  ? "bg-white/60"
                  : "bg-white/[0.04]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Circular Timer Widget Card */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-[#04040A] border border-white/[0.07] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-center overflow-hidden">
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* SVG Circular Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 p-2.5" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="3.5"
            strokeDasharray="263.8"
            strokeDashoffset={263.8 - (263.8 * progressPercentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Timer Text */}
        <div className="relative flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl font-light text-white tracking-wide tabular-nums">
            0:{remainingSeconds.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] font-mono text-white/30 mt-1">{totalSeconds} sec</span>
        </div>
      </div>
    </div>
  );
};
