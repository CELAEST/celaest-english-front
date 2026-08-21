import React from 'react';

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
 * OnboardingProfileCard — Glass card displaying user profile metrics.
 * Each row shows an icon, label, and value separated by subtle dividers.
 */
export const OnboardingProfileCard: React.FC<OnboardingProfileCardProps> = ({ metrics }) => (
  <div className="w-full rounded-2xl bg-[#0D0B1F]/90 border border-[#1E1A3A] backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
    {metrics.map((metric, index) => (
      <div
        key={metric.label}
        className={`flex items-center justify-between px-5 py-3.5 ${
          index < metrics.length - 1 ? 'border-b border-[#1A1735]' : ''
        }`}
      >
        {/* Left: Icon + Label */}
        <div className="flex items-center gap-3">
          <span className="text-[#8B5CF6] w-5 h-5 flex items-center justify-center shrink-0">
            {metric.icon}
          </span>
          <span className="text-[13px] sm:text-sm text-[#C8C8E0] font-light">{metric.label}</span>
        </div>

        {/* Right: Value */}
        <span className="text-[13px] sm:text-sm text-white font-normal">{metric.value}</span>
      </div>
    ))}
  </div>
);
