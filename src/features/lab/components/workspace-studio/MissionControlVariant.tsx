import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

export const MissionControlVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20">
      {/* LEFT: Mission Control Command Center */}
      <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Hardware Status Strip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI CORE READY</span>
          </div>
          <span className="text-[10px] font-mono text-white/40 tracking-wider">
            {profile.cefrLevel} LEVEL · {profile.audioKhz}
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-light text-white leading-[1.1] tracking-[-0.03em]">
          Targeting decisive <br />
          <span className="font-normal text-[#DDD6FE]">leadership cadence.</span>
        </h1>

        <p className="text-xs sm:text-[13px] text-[#8E90A5] font-light leading-[1.6] max-w-md">
          Continuous adaptive mentoring for{" "}
          <span className="text-white font-medium">{profile.profession}</span>.
          All three training vectors are calibrated for today’s session.
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-5 py-2.5 rounded-full bg-white text-[#090616] hover:bg-[#DDD6FE] transition-all duration-200 cursor-pointer flex items-center gap-2.5 text-xs font-mono font-semibold shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-[1.02]"
          >
            <span>ENTER SIMULATION</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* RIGHT: High-Precision Telemetry Columns */}
      <div className="flex flex-col space-y-2.5 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[360px] shrink-0">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 text-left pl-1">
          Active Modules Telemetry
        </div>

        {/* Metric 1 */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-3 rounded-xl bg-[#080512]/60 hover:bg-[#100b26]/70 border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer backdrop-blur-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <StudioMemoryIcon className="w-5 h-5 text-[#A27FF3] shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-medium text-white truncate">
                “{profile.memoryWord}”
              </span>
              <span className="text-[10px] font-mono text-white/40">
                {profile.cardsDue} Cards Due · Memory Bank
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 shrink-0">
            {profile.retentionRate}%
          </span>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-3 rounded-xl bg-[#080512]/60 hover:bg-[#100b26]/70 border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer backdrop-blur-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <StudioReadingIcon className="w-5 h-5 text-[#A27FF3] shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-medium text-white truncate">
                {profile.readingArticle}
              </span>
              <span className="text-[10px] font-mono text-white/40">
                {profile.wordCount} Words · {profile.readingCefr}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#DDD6FE] px-2 py-0.5 rounded bg-white/[0.05] shrink-0">
            {profile.readingTimeMin} min
          </span>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-3 rounded-xl bg-[#080512]/60 hover:bg-[#100b26]/70 border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer backdrop-blur-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <StudioVoiceIcon className="w-5 h-5 text-[#A27FF3] shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-medium text-white truncate">
                {profile.interviewTitle}
              </span>
              <span className="text-[10px] font-mono text-white/40">
                Live Dynamic Dialogue · {profile.interviewRound}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#C4B5FD] px-2 py-0.5 rounded bg-[#6344E6]/20 border border-[#8B5CF6]/30 shrink-0">
            Live
          </span>
        </div>
      </div>
    </div>
  );
};
