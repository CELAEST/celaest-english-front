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
 * OnboardingProfileCard — Ultra-clean luxury glass card displaying evaluated metrics.
 */
export const OnboardingProfileCard: React.FC<OnboardingProfileCardProps> = ({ metrics }) => (
  <div className="relative w-full rounded-3xl bg-[#04040A] border border-white/[0.07] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden">
    {/* Top Specular Hairline */}
    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

    {metrics.map((metric, index) => (
      <div
        key={metric.label}
        className={`flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 ${
          index < metrics.length - 1 ? "border-b border-white/[0.04]" : ""
        }`}
      >
        {/* Left: Icon + Label */}
        <div className="flex items-center gap-3">
          <span className="text-white/50 w-4 h-4 flex items-center justify-center shrink-0">
            {metric.icon}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">{metric.label}</span>
        </div>

        {/* Right: Value */}
        <span className="text-xs sm:text-[13px] font-mono text-white/90">{metric.value}</span>
      </div>
    ))}
  </div>
);
