import React from "react";

export const InterviewSkeleton: React.FC = React.memo(() => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading interview session"
      className="relative flex-1 w-full h-full max-h-screen overflow-hidden bg-[#000001] text-white flex flex-col justify-between select-none z-10 p-2 sm:p-4 animate-pulse"
    >
      {/* 1. Header HUD skeleton (Radix Modern: Zero Borders) */}
      <header className="w-full max-w-7xl 2xl:max-w-[1800px] mx-auto flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-24 sm:w-28 h-8 rounded-full bg-[#14141d]" />
          <div className="hidden sm:block w-20 h-7 rounded-full bg-[#0e0e15]" />
        </div>

        {/* Center CEFR pill skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-32 sm:w-40 h-8 sm:h-9 rounded-full bg-[#1e1e2d]" />
        </div>

        {/* Right audio tools skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#14141d]" />
          <div className="hidden sm:block w-24 h-8 rounded-full bg-[#14141d]" />
        </div>
      </header>

      {/* 2. Main Workspace Arena */}
      <div className="flex-1 w-full max-w-7xl 2xl:max-w-[1800px] mx-auto flex flex-col xl:flex-row items-stretch justify-between px-2 sm:px-6 py-1 gap-4 lg:gap-6 z-10 overflow-hidden h-full min-h-0">
        {/* Center Arena */}
        <div className="flex-1 w-full h-full flex flex-col justify-between items-center min-h-0 overflow-hidden max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-3 sm:px-6 py-1 sm:py-2 lg:py-4">
          {/* Upper Section: Orb Placeholder (Zero dark ball, 100% transparent to prevent jumps) + Prompt Card */}
          <div className="w-full flex flex-col items-center justify-start gap-1.5 sm:gap-3 shrink-0">
            {/* Transparent placeholder perfectly matching ConversationOrbHero dimensions */}
            <div className="w-[clamp(160px,26vh,240px)] sm:w-[clamp(140px,28vh,340px)] h-[clamp(160px,26vh,240px)] sm:h-[clamp(140px,28vh,340px)] bg-transparent shrink-0 rounded-full" />

            {/* Status indicator line */}
            <div className="w-28 h-4 rounded-full bg-[#1e1e2d]" />

            {/* Question Prompt Card */}
            <div className="w-full rounded-2xl bg-[#14141d] p-4 sm:p-5 flex flex-col gap-2.5 max-w-2xl">
              <div className="flex items-center justify-between">
                <div className="w-20 h-3 rounded-full bg-[#1e1e2d]" />
                <div className="w-14 h-3 rounded-full bg-[#0e0e15]" />
              </div>
              <div className="w-full h-4 rounded-full bg-[#1e1e2d]" />
              <div className="w-3/4 h-4 rounded-full bg-[#1e1e2d]" />
            </div>
          </div>

          {/* Bottom Section: Mic Pill Control */}
          <div className="w-full flex flex-col items-center justify-center shrink-0 pb-16 sm:pb-20 lg:pb-1">
            <div className="w-44 sm:w-52 h-12 sm:h-14 rounded-full bg-[#1e1e2d]" />
          </div>
        </div>

        {/* Right Column: Desktop Sidebar Stack (xl and above) */}
        <aside
          aria-label="Sidebar loading placeholder"
          className="w-full xl:w-[320px] 2xl:w-[360px] hidden xl:flex flex-col space-y-3.5 shrink-0 h-full py-1 min-h-0"
        >
          <div className="w-full h-36 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2.5">
            <div className="w-28 h-3.5 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-3 rounded-full bg-[#0e0e15]" />
            <div className="w-3/4 h-3 rounded-full bg-[#0e0e15]" />
          </div>
          <div className="w-full h-40 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2.5">
            <div className="w-24 h-3.5 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-16 rounded-xl bg-[#0e0e15]" />
          </div>
          <div className="w-full h-40 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2.5">
            <div className="w-32 h-3.5 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-12 rounded-xl bg-[#0e0e15]" />
          </div>
        </aside>
      </div>
    </div>
  );
});

InterviewSkeleton.displayName = "InterviewSkeleton";
