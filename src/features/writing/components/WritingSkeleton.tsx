import React from "react";

export const WritingSkeleton: React.FC = React.memo(() => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading writing practice"
      className="relative flex-1 w-full h-full max-h-screen overflow-hidden bg-[#000001] text-white flex flex-col justify-between select-none z-10 p-2 sm:p-4 animate-pulse"
    >
      {/* Main Workspace Layout Canvas */}
      <div className="flex-1 w-full max-w-[1550px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-3 sm:px-6 lg:px-8 py-2 sm:py-3 gap-3 sm:gap-5 lg:gap-6 z-10 overflow-hidden">
        {/* Left Column: Task Header, Editor & Submit Bar */}
        <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full overflow-hidden gap-3">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-3">
            {/* 1. WritingTaskHeader Skeleton */}
            <div className="rounded-2xl bg-[#14141d] p-4 sm:p-5 flex flex-col gap-2.5 shrink-0">
              <div className="flex items-center justify-between">
                <div className="w-32 sm:w-36 h-3 rounded-full bg-[#1e1e2d]" />
                <div className="w-20 sm:w-24 h-7 rounded-full bg-[#1e1e2d]" />
              </div>
              <div className="w-2/3 h-5 rounded-full bg-[#1e1e2d]" />
              <div className="w-full h-3.5 rounded-full bg-[#0e0e15]" />
            </div>

            {/* 2. WritingEditor Skeleton Canvas */}
            <div className="flex-1 min-h-[180px] rounded-3xl bg-[#0e0e15] p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
              <div className="space-y-3.5 pt-1">
                <div className="w-3/4 h-3.5 rounded-full bg-[#14141d]" />
                <div className="w-full h-3.5 rounded-full bg-[#14141d]" />
                <div className="w-5/6 h-3.5 rounded-full bg-[#14141d]" />
                <div className="w-1/2 h-3.5 rounded-full bg-[#14141d]" />
              </div>
              <div className="flex gap-2 pt-4">
                <div className="w-24 h-6 rounded-lg bg-[#14141d]" />
                <div className="w-32 h-6 rounded-lg bg-[#14141d]" />
                <div className="w-28 h-6 rounded-lg bg-[#14141d] hidden sm:block" />
              </div>
            </div>
          </div>

          {/* 3. WritingSubmitBar Skeleton */}
          <div className="h-14 sm:h-16 rounded-2xl bg-[#14141d] px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-24 h-4 rounded-full bg-[#1e1e2d]" />
              <div className="w-16 h-5 rounded-full bg-[#0e0e15]" />
            </div>
            <div className="w-36 sm:w-44 h-9 sm:h-10 rounded-full bg-[#1e1e2d]" />
          </div>
        </div>

        {/* Right Column: 4 Cards Stack (Desktop xl+) */}
        <aside
          aria-label="Writing sidebar loading placeholder"
          className="hidden xl:flex w-[290px] xl:w-[320px] 2xl:w-[340px] flex-col space-y-3.5 shrink-0 h-full max-h-full py-1"
        >
          {/* AI Mentor Card */}
          <div className="h-38 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2.5">
            <div className="w-24 h-3.5 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-12 rounded-xl bg-[#0e0e15]" />
          </div>

          {/* Progress Card */}
          <div className="h-34 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2.5">
            <div className="w-28 h-3 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-2 rounded-full bg-[#0e0e15]" />
            <div className="w-1/2 h-3 rounded-full bg-[#0e0e15]" />
          </div>

          {/* Focus Card */}
          <div className="h-28 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2">
            <div className="w-20 h-3 rounded-full bg-[#1e1e2d]" />
            <div className="w-3/4 h-4 rounded-full bg-[#0e0e15]" />
          </div>

          {/* Tools Card */}
          <div className="h-36 rounded-2xl bg-[#14141d] p-4 flex flex-col gap-2">
            <div className="w-28 h-3 rounded-full bg-[#1e1e2d]" />
            <div className="w-full h-16 rounded-xl bg-[#0e0e15]" />
          </div>
        </aside>
      </div>
    </div>
  );
});

WritingSkeleton.displayName = "WritingSkeleton";
