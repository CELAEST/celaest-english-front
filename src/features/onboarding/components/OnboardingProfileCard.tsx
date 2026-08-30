import React from "react";

/** Single row in the profile summary card */
export interface ProfileMetric {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export interface OnboardingProfileCardProps {
  metrics: ProfileMetric[];
}

/**
 * OnboardingProfileCard — Ultra-clean glass card displaying evaluated metrics.
 * Zero bulky colors, pure transparent rows with subtle violet glyphs.
 */
export const OnboardingProfileCard: React.FC<OnboardingProfileCardProps> = ({ metrics }) => (
  <div className="w-full rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md overflow-hidden">
    {metrics.map((metric, index) => (
      <div
        key={metric.label}
        className={`flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 ${
          index < metrics.length - 1 ? "border-b border-white/[0.06]" : ""
        }`}
      >
        {/* Left: Icon + Label */}
        <div className="flex items-center gap-2.5">
          <span className="text-[#A27FF3] w-4 h-4 flex items-center justify-center shrink-0">
            {metric.icon}
          </span>
          <span className="text-xs sm:text-[13px] text-[#A1A1C2] font-light">{metric.label}</span>
        </div>

        {/* Right: Value */}
        <span className="text-xs sm:text-[13px] text-white font-medium">{metric.value}</span>
      </div>
    ))}
  </div>
);
