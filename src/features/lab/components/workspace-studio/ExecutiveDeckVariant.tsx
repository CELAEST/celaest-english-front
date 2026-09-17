import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
  StudioSparkleIcon,
} from "./StudioBespokeIcons";

export const ExecutiveDeckVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20">
      {/* LEFT: Executive Command Hero */}
      <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Live Telemetry Pill Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A27FF3] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A27FF3]" />
          </span>
          <span className="text-[10px] font-mono font-semibold tracking-[0.18em] text-[#C4B5FD] uppercase">
            AI MENTOR ONLINE · {profile.cefrLevel}
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-light text-white leading-[1.1] tracking-[-0.03em]">
          Elevating your <br />
          executive <span className="font-normal text-[#DDD6FE]">resonance.</span>
        </h1>

        {/* Dynamic Context */}
        <p className="text-xs sm:text-[13.5px] text-[#8E90A5] font-light leading-[1.65] max-w-md">
          Tailored session for{" "}
          <span className="text-white font-medium">{profile.profession}</span> centered on{" "}
          <span className="text-[#C4B5FD] font-medium">{profile.learningGoal}</span>.
        </p>

        {/* Glassmorphic Action Trigger */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 hover:border-[#A27FF3]/60 transition-all duration-300 backdrop-blur-lg flex items-center gap-3 cursor-pointer shadow-[0_0_25px_rgba(162,127,243,0.15)] hover:shadow-[0_0_30px_rgba(162,127,243,0.3)] hover:scale-[1.02]"
          >
            <StudioSparkleIcon className="w-3.5 h-3.5 text-[#DDD6FE] group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-mono font-semibold tracking-wider text-white">
              LAUNCH SESSION
            </span>
            <span className="text-[#DDD6FE] group-hover:translate-x-0.5 transition-transform text-xs">
              →
            </span>
          </button>
          <span className="text-[11px] font-mono text-white/40">
            Recommended · 12 min
          </span>
        </div>
      </div>

      {/* RIGHT: Frosted Glass Floating HUD Cards */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[360px] shrink-0">
        {/* Card 1: Memory */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group relative p-3.5 rounded-2xl bg-[#090616]/40 hover:bg-[#0f0b24]/60 border border-white/[0.08] hover:border-[#A27FF3]/50 transition-all duration-300 backdrop-blur-xl cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(162,127,243,0.15)] hover:translate-x-[-2px]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#C4B5FD] group-hover:scale-105 transition-transform">
                <StudioMemoryIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono font-semibold tracking-[0.18em] text-[#A27FF3] uppercase">
                    LAST MEMORY
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-white/60">
                    {profile.cardsDue} Due
                  </span>
                </div>
                <span className="text-[14px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                  “{profile.memoryWord}”
                </span>
                <span className="text-[11px] text-[#8e90a5] font-light">
                  {profile.retentionRate}% Retention · {profile.cardsDue} cards ready
                </span>
              </div>
            </div>
            <span className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs">
              →
            </span>
          </div>
        </div>

        {/* Card 2: Reading */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group relative p-3.5 rounded-2xl bg-[#090616]/40 hover:bg-[#0f0b24]/60 border border-white/[0.08] hover:border-[#A27FF3]/50 transition-all duration-300 backdrop-blur-xl cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(162,127,243,0.15)] hover:translate-x-[-2px]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#C4B5FD] group-hover:scale-105 transition-transform">
                <StudioReadingIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono font-semibold tracking-[0.18em] text-[#A27FF3] uppercase">
                    NEXT READING
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-white/60">
                    {profile.readingCefr}
                  </span>
                </div>
                <span className="text-[14px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                  {profile.readingArticle}
                </span>
                <span className="text-[11px] text-[#8e90a5] font-light">
                  {profile.readingTimeMin} min sprint · {profile.wordCount} words
                </span>
              </div>
            </div>
            <span className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs">
              →
            </span>
          </div>
        </div>

        {/* Card 3: Interview */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group relative p-3.5 rounded-2xl bg-[#090616]/40 hover:bg-[#0f0b24]/60 border border-white/[0.08] hover:border-[#A27FF3]/50 transition-all duration-300 backdrop-blur-xl cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(162,127,243,0.15)] hover:translate-x-[-2px]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#C4B5FD] group-hover:scale-105 transition-transform">
                <StudioVoiceIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono font-semibold tracking-[0.18em] text-[#A27FF3] uppercase">
                    UPCOMING INTERVIEW
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    {profile.audioKhz}
                  </span>
                </div>
                <span className="text-[14px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                  {profile.interviewTitle}
                </span>
                <span className="text-[11px] text-[#8e90a5] font-light">
                  {profile.interviewRound} · High-stakes simulation
                </span>
              </div>
            </div>
            <span className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs">
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
