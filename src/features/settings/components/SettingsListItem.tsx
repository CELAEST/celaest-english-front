import React from "react";

export interface SettingsListItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onClick?: () => void;
}

export const SettingsListItem: React.FC<SettingsListItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer group"
    >
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        <span className="text-[#8F7CC7] group-hover:text-[#A27FF3] group-hover:drop-shadow-[0_0_7px_rgba(162,127,243,0.65)] transition-all duration-300 shrink-0">
          {icon}
        </span>
        <div className="flex flex-col items-start min-w-0">
          <span className="text-[13px] sm:text-sm font-medium text-[#f8f8f8] leading-tight tracking-wide">
            {title}
          </span>
          <span className="text-[11px] sm:text-xs text-[#999a9b] font-light leading-tight mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Right: Value + Chevron */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <span className="text-xs sm:text-sm text-[#999a9b] font-light group-hover:text-[#f8f8f8]/70 transition-colors duration-300">
          {value}
        </span>
        <svg
          className="w-4 h-4 text-[#999a9b]/50 group-hover:text-[#A27FF3] transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};
