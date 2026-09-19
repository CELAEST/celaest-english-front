import React from "react";

export const InterviewSkeleton: React.FC = React.memo(() => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading interview session"
      className="relative flex-1 w-full h-full max-h-screen overflow-hidden bg-[#000001] text-white flex flex-col justify-between select-none z-10 p-1 sm:p-2 animate-pulse"
    >
      {/* 1. Header HUD skeleton matching ResponsiveInterviewHUD */}
      <header className="w-full max-w-7xl 2xl:max-w-[1800px] mx-auto flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-24 sm:w-28 h-8 rounded-full bg-white/[0.05] border border-white/[0.08]" />
          <div className="hidden sm:block w-20 h-7 rounded-full bg-white/[0.03] border border-white/[0.06]" />
        </div>

        {/* Center CEFR pill skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-32 sm:w-40 h-8 sm:h-9 rounded-full bg-white/[0.05] border border-violet-500/20" />
        </div>

        {/* Right audio tools skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08]" />
          <div className="hidden sm:block w-24 h-8 rounded-full bg-white/[0.04] border border-white/[0.06]" />
        </div>
      </header>

      {/* 2. Main Workspace Arena */}
      <div className="flex-1 w-full max-w-7xl 2xl:max-w-[1800px] mx-auto flex flex-col xl:flex-row items-stretch justify-between px-2 sm:px-6 py-0.5 sm:py-1 gap-4 lg:gap-6 z-10 overflow-hidden h-full min-h-0">
        {/* Center Arena */}
        <div className="flex-1 w-full h-full flex flex-col justify-between items-center min-h-0 overflow-hidden max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-3 sm:px-6 py-1 sm:py-2 lg:py-4">
          {/* Upper Section: Glowing Orb Hero + Prompt Card */}
          <div className="w-full flex flex-col items-center justify-start gap-3 sm:gap-4 shrink-0">
            {/* Glowing Orb Hero Simulation */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border border-violet-500/25 bg-violet-950/20 flex items-center justify-center shadow-[0_0_35px_rgba(112,72,232,0.18)]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet-500/10 blur-sm" />
            </div>

            {/* Status indicator line */}
            <div className="w-28 h-3 rounded-full bg-white/[0.08]" />

            {/* Question Prompt Card */}
            <div className="w-full max-w-2xl lg:max-w-3xl rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-24 h-3 rounded bg-white/[0.08]" />
                <div className="w-16 h-3 rounded bg-white/[0.05]" />
              </div>
              <div className="w-full h-4 rounded bg-white/[0.07]" />
              <div className="w-4/5 h-4 rounded bg-white/[0.05]" />
            </div>
          </div>

          {/* Middle Waveform spectrum placeholder */}
          <div className="w-full flex items-center justify-center my-1 sm:my-2 shrink-0">
            <div className="w-48 sm:w-60 h-7 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-1.5 px-3">
              {[4, 8, 12, 16, 12, 8, 14, 18, 10, 6, 12, 4].map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-violet-400/25"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Controls: Mic Pill */}
          <div className="w-full flex flex-col items-center justify-center shrink-0 pb-16 sm:pb-20 lg:pb-2 gap-2.5">
            <div className="w-40 sm:w-48 h-12 sm:h-13 rounded-full border border-violet-500/30 bg-violet-500/[0.08] shadow-[0_0_24px_rgba(112,72,232,0.2)]" />
            <div className="w-56 h-8 rounded-xl bg-white/[0.03] border border-white/[0.05] hidden sm:block" />
          </div>
        </div>

        {/* Right Column: Desktop Sidebar Stack */}
        <aside
          aria-label="Sidebar loading placeholder"
          className="w-full xl:w-[320px] 2xl:w-[360px] hidden xl:flex flex-col space-y-3.5 shrink-0 h-full py-1 min-h-0"
        >
          <div className="w-full h-36 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2.5">
            <div className="w-28 h-3.5 rounded bg-white/[0.08]" />
            <div className="w-full h-3 rounded bg-white/[0.05]" />
            <div className="w-3/4 h-3 rounded bg-white/[0.05]" />
          </div>
          <div className="w-full h-40 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2.5">
            <div className="w-24 h-3.5 rounded bg-white/[0.08]" />
            <div className="w-full h-16 rounded-xl bg-white/[0.03] border border-white/[0.05]" />
          </div>
          <div className="w-full h-40 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2.5">
            <div className="w-32 h-3.5 rounded bg-white/[0.08]" />
            <div className="w-full h-12 rounded-xl bg-white/[0.03]" />
          </div>
        </aside>
      </div>
    </div>
  );
});

InterviewSkeleton.displayName = "InterviewSkeleton";
