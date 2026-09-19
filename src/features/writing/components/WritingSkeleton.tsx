import React from "react";

export const WritingSkeleton: React.FC = React.memo(() => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading writing practice"
      className="relative flex-1 w-full h-full max-h-screen overflow-hidden bg-[#000001] text-white flex flex-col justify-between select-none z-10 p-1 sm:p-2 animate-pulse"
    >
      {/* Main Workspace Layout Canvas */}
      <div className="flex-1 w-full max-w-[1550px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-3 sm:px-6 lg:px-8 py-1.5 sm:py-3 gap-2 sm:gap-5 lg:gap-6 z-10 overflow-hidden">
        {/* Left Column: Task Header, Editor & Submit Bar */}
        <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full overflow-hidden">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-3">
            {/* 1. WritingTaskHeader Skeleton */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 sm:p-5 flex flex-col gap-2.5 shrink-0">
              <div className="flex items-center justify-between">
                <div className="w-36 h-3 rounded bg-violet-400/20" />
                <div className="w-24 h-7 rounded-full bg-white/[0.05] border border-white/[0.08]" />
              </div>
              <div className="w-2/3 h-5 rounded bg-white/[0.09]" />
              <div className="w-full h-3.5 rounded bg-white/[0.05]" />
            </div>

            {/* 2. WritingEditor Skeleton Canvas */}
            <div className="flex-1 min-h-[180px] rounded-3xl border border-white/[0.08] bg-[#05060e]/90 p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
              <div className="space-y-3.5 pt-1">
                <div className="w-3/4 h-3.5 rounded bg-white/[0.07]" />
                <div className="w-full h-3.5 rounded bg-white/[0.05]" />
                <div className="w-5/6 h-3.5 rounded bg-white/[0.05]" />
                <div className="w-2/3 h-3.5 rounded bg-white/[0.04]" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                <div className="w-24 h-3 rounded bg-white/[0.05]" />
                <div className="w-20 h-3 rounded bg-white/[0.04]" />
              </div>
            </div>

            {/* 3. Starter Phrases Chips Skeleton */}
            <div className="flex items-center gap-2 py-1 overflow-x-hidden shrink-0">
              <div className="w-16 h-3 rounded bg-white/[0.06] shrink-0" />
              <div className="w-32 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0" />
              <div className="w-40 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0" />
              <div className="w-28 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0 hidden sm:block" />
            </div>
          </div>

          {/* 4. WritingSubmitBar Skeleton */}
          <div className="h-14 sm:h-16 rounded-2xl border border-white/[0.08] bg-[#070712]/80 px-4 sm:px-6 flex items-center justify-between shrink-0 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-24 h-4 rounded bg-white/[0.06]" />
              <div className="w-16 h-5 rounded-full bg-white/[0.04]" />
            </div>
            <div className="w-36 sm:w-44 h-9 sm:h-10 rounded-full bg-violet-600/30 border border-violet-500/30 shadow-[0_0_20px_rgba(112,72,232,0.15)]" />
          </div>
        </div>

        {/* Right Column: 4 Cards Stack (Desktop xl+) */}
        <aside
          aria-label="Writing sidebar loading placeholder"
          className="hidden xl:flex w-[290px] xl:w-[320px] 2xl:w-[340px] flex-col space-y-3.5 shrink-0 h-full max-h-full py-1"
        >
          {/* AI Mentor Card */}
          <div className="h-38 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2.5">
            <div className="w-24 h-3.5 rounded bg-violet-400/20" />
            <div className="w-full h-12 rounded-xl bg-white/[0.03] border border-white/[0.05]" />
          </div>

          {/* Progress Card */}
          <div className="h-34 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2.5">
            <div className="w-28 h-3 rounded bg-white/[0.06]" />
            <div className="w-full h-2 rounded-full bg-white/[0.08]" />
            <div className="w-1/2 h-3 rounded bg-white/[0.04]" />
          </div>

          {/* Focus Card */}
          <div className="h-28 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2">
            <div className="w-20 h-3 rounded bg-white/[0.06]" />
            <div className="w-3/4 h-4 rounded bg-white/[0.05]" />
          </div>

          {/* Tools Card */}
          <div className="h-36 rounded-2xl border border-white/[0.08] bg-[#070712]/70 p-4 flex flex-col gap-2">
            <div className="w-28 h-3 rounded bg-white/[0.06]" />
            <div className="w-full h-16 rounded-xl bg-white/[0.03]" />
          </div>
        </aside>
      </div>
    </div>
  );
});

WritingSkeleton.displayName = "WritingSkeleton";
