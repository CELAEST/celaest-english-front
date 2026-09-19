import React from "react";

export const SettingsSkeleton: React.FC = React.memo(() => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading settings"
      className="relative w-full h-full min-h-0 bg-[#000001] text-white flex flex-col select-none overflow-hidden p-3.5 sm:p-6 lg:px-10 pt-3 sm:pt-6 pb-0 lg:pb-4 animate-pulse"
    >
      {/* 1. Header: Category + Title + Subtitle */}
      <header className="relative flex items-center justify-between mb-4 sm:mb-6 pt-1 sm:pt-4 shrink-0 z-20">
        <div className="flex flex-col space-y-2">
          <div className="w-24 h-3 rounded-full bg-[#1e1e2d]" />
          <div className="w-56 sm:w-72 h-7 sm:h-9 rounded-lg bg-[#14141d]" />
          <div className="w-40 sm:w-52 h-4 rounded-full bg-[#0e0e15]" />
        </div>

        {/* Hero Orb Silhouette (sm+ screens) */}
        <div className="hidden sm:flex w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#14141d]" />
      </header>

      {/* 2. Two-Column Content Canvas */}
      <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 xl:gap-10 overflow-hidden">
        {/* Left Column: Settings Cards */}
        <div className="flex-1 h-full max-h-full overflow-y-auto no-scrollbar flex flex-col gap-3.5 sm:gap-4 pr-1 py-1 pb-28 lg:pb-8">
          {/* Profile Card */}
          <div className="rounded-2xl bg-[#14141d] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#1e1e2d]" />
              <div className="space-y-1.5">
                <div className="w-28 h-4 rounded-full bg-[#1e1e2d]" />
                <div className="w-36 h-3 rounded-full bg-[#0e0e15]" />
              </div>
            </div>
            <div className="w-16 h-6 rounded-full bg-[#1e1e2d]" />
          </div>

          {/* Preferences Card */}
          <div className="rounded-2xl bg-[#14141d] p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-32 h-4 rounded-full bg-[#1e1e2d]" />
              <div className="w-48 h-3 rounded-full bg-[#0e0e15]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1e1e2d]" />
          </div>

          {/* Notifications Card */}
          <div className="rounded-2xl bg-[#14141d] p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-36 h-4 rounded-full bg-[#1e1e2d]" />
              <div className="w-44 h-3 rounded-full bg-[#0e0e15]" />
            </div>
            <div className="w-10 h-6 rounded-full bg-[#1e1e2d]" />
          </div>

          {/* Privacy Card */}
          <div className="rounded-2xl bg-[#14141d] p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-28 h-4 rounded-full bg-[#1e1e2d]" />
              <div className="w-40 h-3 rounded-full bg-[#0e0e15]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1e1e2d]" />
          </div>
        </div>

        {/* Right Column: AI Vault & Diagnostics (Desktop lg+) */}
        <aside
          aria-label="Settings vault loading placeholder"
          className="hidden lg:flex w-[320px] xl:w-[360px] flex-col gap-4 shrink-0 h-full py-1"
        >
          {/* Key Vault Card */}
          <div className="rounded-2xl bg-[#14141d] p-5 flex flex-col gap-3">
            <div className="w-32 h-4 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-3 rounded-full bg-[#0e0e15]" />
            <div className="space-y-2 pt-2">
              <div className="w-full h-10 rounded-xl bg-[#0e0e15]" />
              <div className="w-full h-10 rounded-xl bg-[#0e0e15]" />
            </div>
          </div>

          {/* Diagnostics Card */}
          <div className="rounded-2xl bg-[#14141d] p-5 flex flex-col gap-2.5">
            <div className="w-28 h-4 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-3 rounded-full bg-[#0e0e15]" />
            <div className="w-3/4 h-3 rounded-full bg-[#0e0e15]" />
          </div>
        </aside>
      </div>
    </div>
  );
});

SettingsSkeleton.displayName = "SettingsSkeleton";
