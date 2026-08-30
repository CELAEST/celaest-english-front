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
      className="w-full flex items-center justify-between py-3.5 sm:py-4 hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer group text-left"
    >
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        <span className="text-[#8a8a9e] group-hover:text-zinc-200 transition-colors duration-300 shrink-0">
          {icon}
        </span>
        <div className="flex flex-col items-start min-w-0">
          <span className="text-[13px] sm:text-sm font-medium text-zinc-100 leading-tight tracking-wide">
            {title}
          </span>
          <span className="text-[11px] sm:text-xs text-zinc-500 font-light leading-tight mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Right: Value + Chevron */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <span className="text-xs sm:text-sm text-zinc-400 font-light group-hover:text-zinc-200 transition-colors duration-300">
          {value}
        </span>
        <svg
          className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};
