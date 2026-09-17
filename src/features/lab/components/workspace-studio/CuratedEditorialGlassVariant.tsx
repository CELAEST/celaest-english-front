import React from "react";
import { WorkspaceVariantProps } from "./types";

/**
 * CuratedEditorialGlassVariant
 * Designed in response to user audio direction:
 * - Learns from iterations: Zero heavy solid boxes blocking the room.
 * - Sits in perfect harmony with home.mp4: Left text floats over the slatted wall,
 *   central glowing orb remains 100% visible, right containers sit gracefully in the upper right.
 * - Employs bespoke generated cinematic artwork instead of small line icons.
 * - Hyper-clean typography, immaculate kerning, crisp white (#FFFFFF) contrast.
 */
export const CuratedEditorialGlassVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Breathable Spatial Hero (Zero opaque card, floats directly over the room) */}
      <div className="flex flex-col space-y-4 max-w-xl select-none text-left items-start pt-1">
        {/* Mentor Status Pill with Subtle Ambient Refraction */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.09] backdrop-blur-xl transition-all shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
          <span className="text-[10px] font-mono font-medium tracking-[0.22em] text-[#DDD6FE] uppercase">
            AI MENTOR ACTIVE
          </span>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-[10.5px] font-mono text-[#FDE68A] font-semibold">
            {profile.retentionRate}% FLUENCY
          </span>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-[10px] font-mono text-white/50 tracking-wider">
            {profile.cefrLevel}
          </span>
        </div>

        {/* Display Headline in Crisp White with Optical Harmony */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-light text-white leading-[1.12] tracking-[-0.03em]">
          I’ve been thinking <br />
          <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E8FF] to-[#C4B5FD]">
            about our last conversation.
          </span>
        </h1>

        {/* Context Description */}
        <p className="text-sm sm:text-[14.5px] text-[#94A3B8] font-light leading-[1.7] max-w-lg">
          Your customized session for{" "}
          <span className="text-white font-medium">{profile.profession}</span> is centered on{" "}
          <span className="text-[#DDD6FE] font-medium">{profile.learningGoal}</span>.{" "}
          Shall we continue from where we left off?
        </p>

        {/* Tactile High-End Action Pill */}
        <div className="pt-2 flex items-center gap-4">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-7 py-3 rounded-full bg-white text-black hover:bg-[#F1F5F9] text-xs font-semibold tracking-widest uppercase flex items-center gap-3 shadow-[0_12px_32px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Resume Session</span>
            <span className="text-black/60 group-hover:text-black group-hover:translate-x-1 transition-all text-sm font-bold">
              →
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT: Curated Glass Containers with Cinematic Artwork Windows */}
      <div className="flex flex-col space-y-3.5 w-full sm:w-auto lg:min-w-[360px] xl:min-w-[380px] shrink-0">
        {/* Container 1: Vocabulary Recall with Prism Art */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-3 sm:p-3.5 rounded-2xl bg-[#06050A]/40 hover:bg-[#0D0B14]/70 border border-white/[0.08] hover:border-white/[0.22] backdrop-blur-2xl transition-all duration-300 cursor-pointer flex items-center justify-between shadow-[0_12px_36px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Cinematic Artwork Thumbnail */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src="/assets/lexicon_memory_art.jpg"
                alt="Lexicon Memory Prism"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Typography Content */}
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#A78BFA] uppercase font-bold">
                  ACTIVE RECALL
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-white/[0.06] text-[#DDD6FE] border border-white/[0.08]">
                  {profile.cardsDue} DUE
                </span>
              </div>
              <span className="text-sm sm:text-[14.5px] font-medium text-white truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                “{profile.memoryWord}”
              </span>
              <span className="text-[11px] text-[#94A3B8] font-light">
                Spaced repetition lexicon deck
              </span>
            </div>
          </div>

          <span className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center text-white/40 group-hover:text-white transition-all text-xs shrink-0 ml-2">
            →
          </span>
        </div>

        {/* Container 2: Editorial Reading with Architectural Pavilion Art */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-3 sm:p-3.5 rounded-2xl bg-[#06050A]/40 hover:bg-[#0D0B14]/70 border border-white/[0.08] hover:border-white/[0.22] backdrop-blur-2xl transition-all duration-300 cursor-pointer flex items-center justify-between shadow-[0_12px_36px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Cinematic Artwork Thumbnail */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src="/assets/editorial_reading_art.jpg"
                alt="Architectural Editorial Reading"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Typography Content */}
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                  EXECUTIVE ARTICLE
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-white/[0.06] text-[#BAE6FD] border border-white/[0.08]">
                  {profile.readingCefr}
                </span>
              </div>
              <span className="text-sm sm:text-[14.5px] font-medium text-white truncate mt-0.5 group-hover:text-[#BAE6FD] transition-colors">
                {profile.readingArticle}
              </span>
              <span className="text-[11px] text-[#94A3B8] font-light">
                {profile.readingTimeMin} min read · {profile.wordCount} words
              </span>
            </div>
          </div>

          <span className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center text-white/40 group-hover:text-white transition-all text-xs shrink-0 ml-2">
            →
          </span>
        </div>

        {/* Container 3: Oral Simulation with B&O Acoustic Sphere Art */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-3 sm:p-3.5 rounded-2xl bg-[#06050A]/40 hover:bg-[#0D0B14]/70 border border-white/[0.08] hover:border-white/[0.22] backdrop-blur-2xl transition-all duration-300 cursor-pointer flex items-center justify-between shadow-[0_12px_36px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Cinematic Artwork Thumbnail */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src="/assets/simulation_voice_art.jpg"
                alt="Acoustic Voice Sphere"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Typography Content */}
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#FBBF24] uppercase font-bold">
                  ORAL SIMULATION
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-white/[0.06] text-[#FDE68A] border border-white/[0.08]">
                  {profile.interviewRound}
                </span>
              </div>
              <span className="text-sm sm:text-[14.5px] font-medium text-white truncate mt-0.5 group-hover:text-[#FDE68A] transition-colors">
                {profile.interviewTitle}
              </span>
              <span className="text-[11px] text-[#94A3B8] font-light">
                {profile.audioKhz}
              </span>
            </div>
          </div>

          <span className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center text-white/40 group-hover:text-white transition-all text-xs shrink-0 ml-2">
            →
          </span>
        </div>
      </div>
    </div>
  );
};
