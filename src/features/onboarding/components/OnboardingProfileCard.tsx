import React from "react";

export interface ProfileMetric {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export interface OnboardingProfileCardProps {
  metrics: ProfileMetric[];
}

export const OnboardingProfileCard: React.FC<OnboardingProfileCardProps> = ({ metrics }) => (
  <div className="w-full py-4 sm:py-5 px-0.5 border-y border-white/[0.08] my-2 sm:my-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-4.5">
      {metrics.map((metric) => (
        <div key={metric.label} className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-white/40 mb-1">
            <span className="w-4 h-4 flex items-center justify-center shrink-0 opacity-70">
              {metric.icon}
            </span>
            <span className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-wider">
              {metric.label}
            </span>
          </div>
          <span className="text-xs sm:text-[13.5px] font-light text-white/95 leading-normal" title={metric.value}>
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);
