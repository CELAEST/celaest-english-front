import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

/**
 * Variant 1: Vision Spatial Glass (Apple Vision Pro / Optical Smoked Crystal)
 * Ultra-clean spatial architecture, deep smoked obsidian glass, 1px optical rim light,
 * and high-contrast typography engineered for extreme legibility over 3D video.
 */
export const VisionSpatialGlassVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Smoked Obsidian Spatial Hero Card */}
      <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start p-6 sm:p-7 rounded-3xl bg-[#090812]/85 backdrop-blur-3xl border border-white/[0.14] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden group">
        {/* Subtle Specular Top Highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Live Cadence Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
          <span className="text-[10px] font-mono font-semibold tracking-[0.22em] text-[#DDD6FE] uppercase">
            MENTOR ACTIVE · {profile.profession.toUpperCase()}
          </span>
        </div>

        {/* High-Contrast Crisp Display Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-light text-white leading-[1.12] tracking-[-0.03em]">
          Ready to continue, <br />
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E8FF] to-[#C4B5FD]">
            {profile.userName}?
          </span>
        </h1>

        {/* Context Synopsis Box */}
        <div className="w-full p-4 rounded-2xl bg-black/40 border border-white/[0.08] text-left">
          <p className="text-xs sm:text-[13px] text-[#E2E8F0] font-normal leading-[1.6]">
            Focusing on{" "}
            <span className="text-[#C4B5FD] font-semibold">{profile.learningGoal}</span>.{" "}
            We will practice spontaneous framing and confident articulation without hesitation.
          </p>
        </div>

        {/* High-Contrast Tactile Action Button */}
        <div className="pt-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(124,58,237,0.5)] border border-[#C4B5FD]/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Resume Session</span>
            <span className="text-[#DDD6FE] text-sm font-bold">→</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Floating High-Contrast Glass Lenses */}
      <div className="flex flex-col space-y-3.5 w-full sm:w-auto lg:min-w-[360px] xl:min-w-[380px] shrink-0">
        {/* Lens 1: Lexical Memory */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-4 sm:p-4.5 rounded-2xl bg-[#090812]/85 hover:bg-[#120F24]/95 border border-white/[0.12] hover:border-[#A78BFA]/50 transition-all duration-300 backdrop-blur-3xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7)] cursor-pointer flex items-center justify-between relative overflow-hidden"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#7C3AED]/20 border border-[#A78BFA]/30 text-[#DDD6FE] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <StudioMemoryIcon className="w-5 h-5 text-[#C4B5FD]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#A78BFA] uppercase">
                  01 · LEXICON
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#7C3AED]/30 text-[#DDD6FE] border border-[#7C3AED]/50">
                  {profile.cardsDue} DUE
                </span>
              </div>
              <span className="text-sm sm:text-[14.5px] text-white font-semibold truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                “{profile.memoryWord}”
              </span>
              <span className="text-[11px] text-[#94A3B8] font-normal">
                Personalized active recall deck
              </span>
            </div>
          </div>
          <span className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-white/50 group-hover:text-white transition-all text-xs shrink-0 ml-2">
            →
          </span>
        </div>

        {/* Lens 2: Executive Reading */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-4 sm:p-4.5 rounded-2xl bg-[#090812]/85 hover:bg-[#120F24]/95 border border-white/[0.12] hover:border-[#38BDF8]/50 transition-all duration-300 backdrop-blur-3xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7)] cursor-pointer flex items-center justify-between relative overflow-hidden"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#0284C7]/20 border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <StudioReadingIcon className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#38BDF8] uppercase">
                  02 · EDITORIAL
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#0284C7]/30 text-[#BAE6FD] border border-[#0284C7]/50">
                  {profile.readingCefr}
                </span>
              </div>
              <span className="text-sm sm:text-[14.5px] text-white font-semibold truncate mt-0.5 group-hover:text-[#BAE6FD] transition-colors">
                {profile.readingArticle}
              </span>
              <span className="text-[11px] text-[#94A3B8] font-normal">
                {profile.readingTimeMin} min read · {profile.wordCount} words
              </span>
            </div>
          </div>
          <span className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-white/50 group-hover:text-white transition-all text-xs shrink-0 ml-2">
            →
          </span>
        </div>

        {/* Lens 3: Spoken Simulation */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-4 sm:p-4.5 rounded-2xl bg-[#090812]/85 hover:bg-[#120F24]/95 border border-white/[0.12] hover:border-[#F59E0B]/50 transition-all duration-300 backdrop-blur-3xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7)] cursor-pointer flex items-center justify-between relative overflow-hidden"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#D97706]/20 border border-[#F59E0B]/30 text-[#F59E0B] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <StudioVoiceIcon className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#F59E0B] uppercase">
                  03 · SIMULATION
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D97706]/30 text-[#FDE68A] border border-[#D97706]/50">
                  {profile.interviewRound}
                </span>
              </div>
              <span className="text-sm sm:text-[14.5px] text-white font-semibold truncate mt-0.5 group-hover:text-[#FDE68A] transition-colors">
                {profile.interviewTitle}
              </span>
              <span className="text-[11px] text-[#94A3B8] font-normal">
                {profile.audioKhz}
              </span>
            </div>
          </div>
          <span className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-white/50 group-hover:text-white transition-all text-xs shrink-0 ml-2">
            →
          </span>
        </div>
      </div>
    </div>
  );
};
