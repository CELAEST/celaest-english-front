import React from "react";

export const PathwaySkeleton: React.FC = () => (
  <div data-testid="pathway-skeleton" className="flex flex-col lg:flex-row h-full w-full bg-[#000001] px-6 lg:px-12 py-6 gap-10 overflow-hidden select-none">
    <div className="w-full lg:w-[40%] h-52 lg:h-full flex items-center justify-center">
      <div className="w-40 h-40 rounded-full bg-violet-500/10 blur-2xl animate-pulse" />
    </div>
    <div className="flex-1 flex flex-col justify-center space-y-5">
      <div className="h-3 w-32 bg-white/[0.06] rounded-full animate-pulse" />
      <div className="h-9 w-80 bg-white/[0.05] rounded-xl animate-pulse" />
      <div className="h-14 w-full max-w-lg bg-white/[0.03] rounded-xl animate-pulse" />
    </div>
  </div>
);
