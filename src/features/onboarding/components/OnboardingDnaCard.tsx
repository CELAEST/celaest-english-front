import React from "react";

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
      className={`relative flex items-center pl-4 sm:pl-5 pr-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-2xl border transition-all duration-300 overflow-hidden ${
        isChecked
          ? "bg-[#04040A] border-white/20 text-white shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "bg-[#04040A]/40 border-white/[0.04] text-white/40 opacity-50"
      }`}
    >
      {/* Top Specular Hairline when checked */}
      {isChecked && (
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      )}

      {/* Circle Indicator */}
      <div className="mr-3 flex items-center justify-center shrink-0">
        <div
          className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isChecked ? "bg-white/10 text-white" : "bg-white/[0.03] text-transparent"
          }`}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isChecked ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Text Details */}
      <div className="flex flex-col min-w-0">
        <span
          className={`text-xs sm:text-[13px] font-light leading-tight tracking-wide ${
            isChecked ? "text-white" : "text-white/40"
          }`}
        >
          {title}
        </span>
        <span
          className={`text-[11px] font-mono truncate pt-0.5 ${
            isChecked ? "text-white/40" : "text-white/20"
          }`}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
};
