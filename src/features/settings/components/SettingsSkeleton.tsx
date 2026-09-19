import React from "react";

export const SettingsSkeleton: React.FC = React.memo(() => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading settings"
      className="relative w-full h-full min-h-0 bg-[#000001] text-white flex flex-col select-none overflow-hidden p-3.5 sm:p-6 lg:px-10 pt-3 sm:pt-6 pb-0 lg:pb-4 animate-pulse"
    >
      {/* 1. Header: Category + Title + Subtitle Skeleton */}
      <header className="relative flex items-center justify-between mb-3 sm:mb-6 pt-1 sm:pt-4 shrink-0 z-20">
        <div className="flex flex-col space-y-2">
          <div className="w-24 h-3 rounded bg-violet-400/20" />
          <div className="w-56 sm:w-72 h-7 sm:h-9 rounded-lg bg-white/[0.09]" />
          <div className="w-40 sm:w-52 h-4 rounded bg-white/[0.05]" />
        </div>

        {/* Hero Orb Skeleton Placeholder (sm+ screens) */}
        <div className="hidden sm:flex w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-violet-500/20 bg-violet-950/20 items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 blur-sm" />
        </div>
      </header>

      {/* 2. Two-Column Content Canvas */}
      <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 xl:gap-10 overflow-hidden">
        {/* Left Column: Settings Cards */}
        <div className="flex-1 h-full max-h-full overflow-y-auto no-scrollbar flex flex-col gap-4 sm:gap-5 pr-1 py-1 pb-28 lg:pb-8">
          {/* Profile Card Skeleton */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-white/[0.08] border border-white/[0.1]" />
              <div className="space-y-1.5">
                <div className="w-28 h-4 rounded bg-white/[0.09]" />
                <div className="w-36 h-3 rounded bg-white/[0.05]" />
              </div>
            </div>
            <div className="w-16 h-6 rounded-full bg-white/[0.05]" />
          </div>

          {/* Preferences Card Skeleton */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-32 h-4 rounded bg-white/[0.09]" />
              <div className="w-48 h-3 rounded bg-white/[0.05]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white/[0.04]" />
          </div>

          {/* Notifications Card Skeleton */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-36 h-4 rounded bg-white/[0.09]" />
              <div className="w-44 h-3 rounded bg-white/[0.05]" />
            </div>
            <div className="w-10 h-6 rounded-full bg-white/[0.05]" />
          </div>

          {/* Privacy Card Skeleton */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-28 h-4 rounded bg-white/[0.09]" />
              <div className="w-40 h-3 rounded bg-white/[0.05]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white/[0.04]" />
          </div>
        </div>

        {/* Right Column: AI Vault & Diagnostics (Desktop lg+) */}
        <aside
          aria-label="Settings vault loading placeholder"
          className="hidden lg:flex w-[320px] xl:w-[360px] flex-col gap-4 shrink-0 h-full py-1"
        >
          {/* Key Vault Card Skeleton */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-5 flex flex-col gap-3">
            <div className="w-32 h-4 rounded bg-violet-400/20" />
            <div className="w-full h-3 rounded bg-white/[0.05]" />
            <div className="space-y-2 pt-2">
              <div className="w-full h-10 rounded-xl bg-white/[0.03] border border-white/[0.05]" />
              <div className="w-full h-10 rounded-xl bg-white/[0.03] border border-white/[0.05]" />
            </div>
          </div>

          {/* Diagnostics Card Skeleton */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-5 flex flex-col gap-2.5">
            <div className="w-28 h-4 rounded bg-white/[0.09]" />
            <div className="w-full h-3 rounded bg-white/[0.05]" />
            <div className="w-3/4 h-3 rounded bg-white/[0.04]" />
          </div>
        </aside>
      </div>
    </div>
  );
});

SettingsSkeleton.displayName = "SettingsSkeleton";
