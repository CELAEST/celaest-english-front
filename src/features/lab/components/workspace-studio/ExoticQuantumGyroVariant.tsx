import React from "react";
import { WorkspaceVariantProps } from "./types";
import { ExoticGyroscopeGraphic } from "./ExoticBespokeGraphics";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

export const ExoticQuantumGyroVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20">
      {/* LEFT: Quantum Celestial Hero */}
      <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Gyroscope + Identity Orbit */}
        <div className="flex items-center gap-3.5 p-2 pr-4 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <ExoticGyroscopeGraphic className="w-8 h-8 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10.5px] font-mono font-bold tracking-[0.2em] text-[#DDD6FE] uppercase">
              {profile.userName}
            </span>
            <span className="text-[9.5px] font-mono text-white/50">
              {profile.profession} · {profile.cefrLevel}
            </span>
          </div>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-light text-white leading-[1.08] tracking-[-0.03em]">
          Mastery of the <br />
          <span className="font-normal italic font-serif text-[#DDD6FE]">unspoken nuance.</span>
        </h1>

        <p className="text-xs sm:text-[13.5px] text-[#8E90A5] font-light leading-[1.7] max-w-md">
          Calibrated for executive leadership in{" "}
          <span className="text-white font-medium">{profile.learningGoal}</span>.
          Your neural mentor is tuned to your vocal cadence.
        </p>

        {/* Celestial Glass Action Trigger */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-6 py-2.5 rounded-full bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-transparent hover:from-[#7C3AED]/40 hover:to-[#A27FF3]/30 border border-white/20 hover:border-[#C4B5FD] transition-all duration-300 backdrop-blur-xl flex items-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(162,127,243,0.3)] hover:scale-[1.02]"
          >
            <span className="w-2 h-2 rounded-full bg-[#DDD6FE] shadow-[0_0_10px_#DDD6FE]" />
            <span className="text-xs font-mono font-bold tracking-widest text-white">
              COMMENCE PRACTICE
            </span>
            <span className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all text-xs">
              →
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT: Celestial Glass Lenses */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[360px] shrink-0">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C4B5FD] text-left pl-1">
          ✦ CELESTIAL VECTORS
        </div>

        {/* Lens 1 */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group relative p-4 rounded-3xl bg-gradient-to-br from-[#0c081e]/50 to-[#04020a]/60 hover:from-[#160e34]/70 hover:to-[#080416]/80 border border-white/[0.08] hover:border-[#DDD6FE]/50 transition-all duration-300 backdrop-blur-2xl cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(162,127,243,0.2)] hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#DDD6FE] group-hover:scale-110 transition-transform">
                <StudioMemoryIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[9.5px] font-mono tracking-widest text-[#A27FF3] uppercase">
                  MEMORY SPHERE
                </span>
                <span className="text-sm text-white font-medium truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                  “{profile.memoryWord}”
                </span>
                <span className="text-[11px] text-[#8e90a5] font-light">
                  {profile.cardsDue} due · {profile.retentionRate}% stability
                </span>
              </div>
            </div>
            <span className="text-white/20 group-hover:text-white text-xs pl-2">→</span>
          </div>
        </div>

        {/* Lens 2 */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group relative p-4 rounded-3xl bg-gradient-to-br from-[#0c081e]/50 to-[#04020a]/60 hover:from-[#160e34]/70 hover:to-[#080416]/80 border border-white/[0.08] hover:border-[#DDD6FE]/50 transition-all duration-300 backdrop-blur-2xl cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(162,127,243,0.2)] hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#DDD6FE] group-hover:scale-110 transition-transform">
                <StudioReadingIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[9.5px] font-mono tracking-widest text-[#A27FF3] uppercase">
                  CODEX PASSAGE
                </span>
                <span className="text-sm text-white font-medium truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                  {profile.readingArticle}
                </span>
                <span className="text-[11px] text-[#8e90a5] font-light">
                  {profile.readingTimeMin} min read · {profile.readingCefr}
                </span>
              </div>
            </div>
            <span className="text-white/20 group-hover:text-white text-xs pl-2">→</span>
          </div>
        </div>

        {/* Lens 3 */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group relative p-4 rounded-3xl bg-gradient-to-br from-[#0c081e]/50 to-[#04020a]/60 hover:from-[#160e34]/70 hover:to-[#080416]/80 border border-white/[0.08] hover:border-[#DDD6FE]/50 transition-all duration-300 backdrop-blur-2xl cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(162,127,243,0.2)] hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#DDD6FE] group-hover:scale-110 transition-transform">
                <StudioVoiceIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[9.5px] font-mono tracking-widest text-[#A27FF3] uppercase">
                  VOICE NEXUS
                </span>
                <span className="text-sm text-white font-medium truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                  {profile.interviewTitle}
                </span>
                <span className="text-[11px] text-[#8e90a5] font-light">
                  {profile.audioKhz} · High-stakes simulation
                </span>
              </div>
            </div>
            <span className="text-white/20 group-hover:text-white text-xs pl-2">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
