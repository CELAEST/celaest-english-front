import React from "react";

export const MemorySkeleton: React.FC = React.memo(() => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading memory bank"
      className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#000001] text-white flex flex-col justify-between select-none overflow-hidden p-2.5 xs:p-3 sm:p-5 lg:px-8 pt-1.5 xs:pt-2 sm:pt-4 pb-20 sm:pb-26 lg:pb-5 animate-pulse"
    >
      {/* 1. Top Header: Title + Category Filter Tabs Skeleton */}
      <header className="relative w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-32 sm:w-36 h-7 sm:h-8 rounded-lg bg-white/[0.08]" />
          <div className="w-16 h-6 rounded-full bg-white/[0.04] border border-white/[0.06]" />
        </div>

        {/* Filter Pills (Speaking · Reading · Writing) */}
        <div className="flex items-center p-1 rounded-full border border-white/[0.08] bg-[#070712]/80 gap-1.5">
          <div className="w-20 sm:w-24 h-7 rounded-full bg-violet-600/30 border border-violet-500/20" />
          <div className="w-20 sm:w-24 h-7 rounded-full bg-white/[0.04]" />
          <div className="w-20 sm:w-24 h-7 rounded-full bg-white/[0.04]" />
        </div>
      </header>

      {/* 2. 3D Flashcard Carousel Arena Skeleton */}
      <main className="relative flex-1 min-h-0 w-full max-w-5xl mx-auto flex items-center justify-center my-auto py-2">
        {/* Left 3D Peek (Desktop only) */}
        <div className="hidden sm:block absolute left-2 lg:left-8 w-[180px] lg:w-[210px] h-[340px] lg:h-[400px] rounded-3xl border border-white/[0.05] bg-[#070712]/50 opacity-25 [transform:rotateY(10deg)_scale(0.88)]" />

        {/* Center Active Flashcard Canvas */}
        <article className="relative w-full max-w-[340px] xs:max-w-[370px] sm:max-w-[480px] lg:max-w-[520px] h-[365px] xs:h-[395px] sm:h-[450px] lg:h-[470px] rounded-3xl border border-white/[0.1] bg-[#05060c] p-5 sm:p-7 flex flex-col justify-between shadow-[0_24px_60px_rgba(0,0,0,0.85)] z-10">
          {/* Card Top Row */}
          <div className="flex items-center justify-between">
            <div className="w-24 h-4 rounded bg-white/[0.08]" />
            <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08]" />
          </div>

          {/* Card Sentence Body */}
          <div className="space-y-4 my-auto py-2">
            {/* User Said */}
            <div className="space-y-1.5">
              <div className="w-16 h-3 rounded bg-red-400/20" />
              <div className="w-4/5 h-5 sm:h-6 rounded bg-white/[0.08]" />
            </div>

            {/* Better Way */}
            <div className="space-y-1.5 pt-1">
              <div className="w-20 h-3 rounded bg-emerald-400/20" />
              <div className="w-full h-6 sm:h-7 rounded bg-white/[0.09]" />
              <div className="w-2/3 h-5 sm:h-6 rounded bg-white/[0.06]" />
            </div>
          </div>

          {/* Card Footer: Flip Hint */}
          <div className="flex items-center justify-center pt-2 border-t border-white/[0.05]">
            <div className="w-28 h-6 rounded-full bg-white/[0.04] border border-white/[0.06]" />
          </div>
        </article>

        {/* Right 3D Peek (Desktop only) */}
        <div className="hidden sm:block absolute right-2 lg:right-8 w-[180px] lg:w-[210px] h-[340px] lg:h-[400px] rounded-3xl border border-white/[0.05] bg-[#070712]/50 opacity-25 [transform:rotateY(-10deg)_scale(0.88)]" />
      </main>

      {/* 3. Bottom Controls: Pagination dots hint */}
      <footer className="w-full max-w-sm mx-auto flex items-center justify-center py-2 shrink-0">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-6 h-2 rounded-full bg-violet-500/50" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </footer>
    </div>
  );
});

MemorySkeleton.displayName = "MemorySkeleton";
