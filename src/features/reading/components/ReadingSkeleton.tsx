import React from "react";

export const ReadingSkeleton: React.FC = React.memo(() => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading reading practice"
      className="relative flex-1 w-full h-full max-h-screen overflow-hidden bg-[#000001] text-white flex flex-col justify-between select-none z-10 p-1 sm:p-2 animate-pulse"
    >
      {/* Main Workspace Layout Canvas */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-4 sm:px-10 lg:px-14 py-1.5 sm:py-5 pt-1.5 sm:pt-4 gap-2 sm:gap-8 z-10 overflow-hidden">
        {/* Central Editorial Column */}
        <main className="flex-1 w-full flex flex-col h-full min-h-0 overflow-hidden">
          {/* Top Reading Hero Orb Placeholder */}
          <div className="flex items-center justify-center py-2 shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-violet-500/20 bg-violet-950/20 shadow-[0_0_20px_rgba(112,72,232,0.15)]" />
          </div>

          {/* Editorial Article Wrapper */}
          <div className="flex flex-col w-full max-w-[680px] mx-auto flex-1 min-h-0 justify-between py-1">
            {/* 1. Article Header Skeleton */}
            <div className="space-y-2.5 shrink-0 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-20 h-5 rounded-full bg-violet-400/15 border border-violet-500/20" />
                <div className="w-28 h-4 rounded bg-white/[0.05]" />
              </div>
              <div className="w-4/5 h-6 sm:h-7 rounded-lg bg-white/[0.08]" />
              <div className="w-3/5 h-6 sm:h-7 rounded-lg bg-white/[0.06]" />
            </div>

            {/* 2. Article Reader Paragraphs Skeleton */}
            <div className="flex-1 min-h-[160px] overflow-hidden py-3 space-y-4">
              <div className="space-y-2">
                <div className="w-full h-3.5 rounded bg-white/[0.07]" />
                <div className="w-[96%] h-3.5 rounded bg-white/[0.06]" />
                <div className="w-[90%] h-3.5 rounded bg-white/[0.05]" />
              </div>
              <div className="space-y-2">
                <div className="w-full h-3.5 rounded bg-white/[0.06]" />
                <div className="w-[94%] h-3.5 rounded bg-white/[0.05]" />
                <div className="w-[85%] h-3.5 rounded bg-white/[0.04]" />
              </div>
              <div className="space-y-2 hidden sm:block">
                <div className="w-[98%] h-3.5 rounded bg-white/[0.06]" />
                <div className="w-[92%] h-3.5 rounded bg-white/[0.05]" />
              </div>
            </div>

            {/* 3. Reading Bottom Navigation Bar Skeleton */}
            <div className="h-12 sm:h-14 rounded-2xl border border-white/[0.08] bg-[#070712]/80 px-4 sm:px-6 flex items-center justify-between shrink-0">
              <div className="w-20 h-7 rounded-lg bg-white/[0.05]" />
              <div className="w-32 h-2 rounded-full bg-white/[0.08]" />
              <div className="w-20 h-7 rounded-lg bg-white/[0.05]" />
            </div>
          </div>
        </main>

        {/* Right Column: 4 Cards Stack (Desktop lg+) */}
        <aside
          aria-label="Reading sidebar loading placeholder"
          className="hidden lg:flex w-[280px] xl:w-[320px] 2xl:w-[340px] flex-col space-y-3 shrink-0 h-full py-1"
        >
          <div className="h-36 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2.5">
            <div className="w-24 h-3.5 rounded bg-violet-400/20" />
            <div className="w-full h-12 rounded-xl bg-white/[0.03]" />
          </div>
          <div className="h-32 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2">
            <div className="w-28 h-3 rounded bg-white/[0.06]" />
            <div className="w-full h-2 rounded-full bg-white/[0.08]" />
          </div>
          <div className="h-28 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2">
            <div className="w-20 h-3 rounded bg-white/[0.06]" />
            <div className="w-3/4 h-4 rounded bg-white/[0.04]" />
          </div>
        </aside>
      </div>
    </div>
  );
});

ReadingSkeleton.displayName = "ReadingSkeleton";
