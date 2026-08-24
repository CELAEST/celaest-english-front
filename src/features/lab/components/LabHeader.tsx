import React from 'react';

export interface LabHeaderProps {
  onBackToWorkspace?: (() => void) | undefined;
}

export const LabHeader: React.FC<LabHeaderProps> = ({ onBackToWorkspace }) => {
  return (
    <div className="w-full flex items-center justify-between pb-6 border-b border-white/[0.06] select-none">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#120f2e] border border-[#38267d] flex items-center justify-center text-[#A27FF3] shadow-[0_0_15px_rgba(162,127,243,0.3)]">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>CELAEST UI & Icon Lab</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#7048E8]/30 border border-[#A27FF3]/40 text-[#C4B5FD]">
                Interactive Preview
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8a8a9e]">
              Explore, test, and calibrate custom bespoke icons, circular progress gauges, and zero-scroll navigation UX.
            </p>
          </div>
        </div>
      </div>

      {onBackToWorkspace && (
        <button
          onClick={onBackToWorkspace}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#0d0d1e] border border-white/[0.08] text-xs text-[#b5b6be] hover:text-white hover:border-[#A27FF3]/50 transition-all cursor-pointer shadow-lg"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Workspace</span>
        </button>
      )}
    </div>
  );
};
