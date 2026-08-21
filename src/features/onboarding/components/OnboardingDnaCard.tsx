import React from 'react';

export interface OnboardingDnaCardProps {
  title: string;
  subtitle: string;
  isChecked: boolean;
}

export const OnboardingDnaCard: React.FC<OnboardingDnaCardProps> = ({
  title,
  subtitle,
  isChecked,
}) => {
  return (
    <div
      className={`relative flex items-center pl-4 sm:pl-5 pr-3.5 sm:pr-4 py-2 sm:py-2.5 rounded-xl border transition-all duration-300 overflow-hidden ${
        isChecked
          ? 'bg-[#0B0A1A] border-[#1C1A36] text-white'
          : 'bg-[#080816]/40 border-[#18172E]/50 text-slate-500 opacity-40'
      }`}
    >
      {/* Left Vertical Accent Line (Pill-shaped, inset slightly from top and bottom) */}
      <div
        className={`absolute left-0.5 top-1.5 bottom-1.5 w-[2.5px] rounded-full transition-all duration-300 ${
          isChecked ? 'bg-[#9353D3]' : 'bg-transparent'
        }`}
      />

      {/* Circle Indicator (Flat solid circle, zero box shadow) */}
      <div className="mr-3 flex items-center justify-center shrink-0">
        <div
          className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isChecked ? 'bg-[#241747] text-[#D4B2FF]' : 'bg-[#151528] text-transparent'
          }`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Text Details */}
      <div className="flex flex-col min-w-0">
        <span
          className={`text-xs sm:text-[13px] font-medium leading-tight tracking-wide ${
            isChecked ? 'text-[#F1F1F8]' : 'text-slate-500'
          }`}
        >
          {title}
        </span>
        <span
          className={`text-[11px] sm:text-xs font-light truncate pt-0.5 ${
            isChecked ? 'text-[#8E8EA8]' : 'text-slate-600'
          }`}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
};
