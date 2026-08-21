import React from 'react';

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
        <span className="text-xs font-normal text-[#9579cc]">
          Question <span className="text-[#f8f8f8] font-semibold">{currentQuestion}</span> of {totalQuestions}
        </span>
        <div className="flex space-x-1.5">
          {dashArray.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-5 sm:w-6 rounded-full transition-all duration-300 ${
                i < currentQuestion
                  ? 'bg-[#A27FF3] shadow-[0_0_8px_rgba(162,127,243,0.6)]'
                  : 'bg-[#111220]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Larger Circular Timer Widget Card */}
      <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-[#05060c] border border-[#111220] shadow-2xl backdrop-blur-xl flex items-center justify-center relative">
        {/* SVG Circular Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 p-2.5" viewBox="0 0 100 100">
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#111220"
            strokeWidth="3.5"
          />
          {/* Active Progress Ring in #A27FF3 */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#A27FF3"
            strokeWidth="4"
            strokeDasharray="263.8"
            strokeDashoffset={263.8 - (263.8 * progressPercentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Timer Text */}
        <div className="relative flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl font-light text-[#f8f8f8] tracking-wide">
            0:{remainingSeconds.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-[#9579cc] font-light mt-1">
            {totalSeconds} sec
          </span>
        </div>
      </div>
    </div>
  );
};
