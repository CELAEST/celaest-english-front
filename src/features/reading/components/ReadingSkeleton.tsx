import React from "react";

export const ReadingSkeleton: React.FC = React.memo(() => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading reading practice"
      className="relative flex-1 w-full h-full max-h-screen overflow-hidden bg-[#000001] text-white flex flex-col justify-between select-none z-10 p-2 sm:p-4 animate-pulse"
    >
      {/* Main Workspace Layout Canvas */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-4 sm:px-10 lg:px-14 py-2 sm:py-5 gap-3 sm:gap-8 z-10 overflow-hidden">
        {/* Central Editorial Column */}
        <main className="flex-1 w-full flex flex-col h-full min-h-0 overflow-hidden">
          {/* Top Reading Hero Orb Silhouette */}
          <div className="flex items-center justify-center py-2 shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1e1e2d]" />
          </div>

          {/* Editorial Article Wrapper */}
          <div className="flex flex-col w-full max-w-[680px] mx-auto flex-1 min-h-0 justify-between py-1">
            {/* 1. Article Header Skeleton */}
            <div className="space-y-3 shrink-0 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-20 h-5 rounded-full bg-[#1e1e2d]" />
                <div className="w-28 h-4 rounded-full bg-[#14141d]" />
              </div>
              <div className="w-4/5 h-6 sm:h-7 rounded-lg bg-[#14141d]" />
              <div className="w-3/5 h-6 sm:h-7 rounded-lg bg-[#14141d]" />
            </div>

            {/* 2. Article Reader Paragraphs Skeleton */}
            <div className="flex-1 min-h-[160px] overflow-hidden py-3 space-y-4">
              <div className="space-y-2">
                <div className="w-full h-3 rounded-full bg-[#14141d]" />
                <div className="w-[96%] h-3 rounded-full bg-[#14141d]" />
                <div className="w-[88%] h-3 rounded-full bg-[#14141d]" />
              </div>
              <div className="space-y-2">
                <div className="w-full h-3 rounded-full bg-[#14141d]" />
                <div className="w-[92%] h-3 rounded-full bg-[#14141d]" />
                <div className="w-[85%] h-3 rounded-full bg-[#14141d]" />
              </div>
              <div className="space-y-2 hidden sm:block">
                <div className="w-[98%] h-3 rounded-full bg-[#14141d]" />
                <div className="w-[90%] h-3 rounded-full bg-[#14141d]" />
              </div>
            </div>

            {/* 3. Reading Bottom Navigation Bar Skeleton */}
            <div className="h-12 sm:h-14 rounded-2xl bg-[#14141d] px-4 sm:px-6 flex items-center justify-between shrink-0">
              <div className="w-20 h-7 rounded-lg bg-[#1e1e2d]" />
              <div className="w-32 h-2 rounded-full bg-[#0e0e15]" />
              <div className="w-20 h-7 rounded-lg bg-[#1e1e2d]" />
            </div>
          </div>
        </main>

        {/* Right Column: Cards Stack (Desktop lg+) */}
        <aside
          aria-label="Reading sidebar loading placeholder"
          className="hidden lg:flex w-[280px] xl:w-[320px] 2xl:w-[340px] flex-col space-y-3 shrink-0 h-full py-1"
        >
          <div className="h-36 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2.5">
            <div className="w-24 h-3.5 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-12 rounded-xl bg-[#0e0e15]" />
          </div>
          <div className="h-32 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2">
            <div className="w-28 h-3 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-2 rounded-full bg-[#0e0e15]" />
          </div>
          <div className="h-28 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2">
            <div className="w-20 h-3 rounded-full bg-[#1e1e2d]" />
            <div className="w-3/4 h-4 rounded-full bg-[#0e0e15]" />
          </div>
        </aside>
      </div>
    </div>
  );
});

ReadingSkeleton.displayName = "ReadingSkeleton";
