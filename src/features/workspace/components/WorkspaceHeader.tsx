import React from 'react';

export interface WorkspaceHeaderProps {
  streakDays?: number | undefined;
  onPracticeClick?: (() => void) | undefined;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  streakDays = 12,
  onPracticeClick,
}) => {
  return (
    <header className="flex items-center justify-end gap-4 pt-3 pb-0 px-8 select-none shrink-0 h-12">
      {/* Notification Bell — Thin Outline Style (matches mockup) */}
      <button
        aria-label="Notifications"
        className="relative w-10 h-10 rounded-full text-[#8E8EB3] hover:text-white flex items-center justify-center transition-all cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </button>

      {/* Streak Badge — 🔥 12 (outlined fire + number) */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C0A1D] border border-[#1E1938] text-sm font-light text-slate-200">
        <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
        </svg>
        <span>{streakDays}</span>
      </div>

      {/* Practice CTA Button — Outlined pill with star (matches mockup exactly) */}
      <button
        onClick={onPracticeClick}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-transparent border border-[#3E2E75] hover:border-[#6366F1] text-sm font-medium text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 cursor-pointer"
      >
        <svg className="w-4 h-4 text-[#A78BFA]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        <span>Practice</span>
      </button>
    </header>
  );
};
