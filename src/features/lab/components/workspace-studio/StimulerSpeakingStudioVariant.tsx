import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

/**
 * Variant 1: Stimuler Speaking Studio
 * Inspired by Stimuler.tech + High-End Executive Conversational AI:
 * Zero heavy boxes. Featherweight spatial typography floating in the 3D room.
 * Conversational speaking prompt, real-time fluency score, and airy glass ornaments.
 */
export const StimulerSpeakingStudioVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Featherweight Conversational Hero (Zero Heavy Box, Pure Spatial Floating) */}
      <div className="flex flex-col space-y-4 max-w-xl select-none text-left items-start pt-1">
        {/* Mentor Status Pill with Fluency Telemetry */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.09] backdrop-blur-xl transition-all">
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
          <span className="text-[10.5px] font-mono font-medium tracking-wider text-[#DDD6FE] uppercase">
            AI MENTOR READY
          </span>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-[10.5px] font-mono text-[#FDE68A] font-semibold">
            {profile.retentionRate}% FLUENCY
          </span>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-[10.5px] font-mono text-white/50">
            {profile.cefrLevel}
          </span>
        </div>

        {/* Display Conversational Headline in Crisp White */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-light text-white leading-[1.12] tracking-[-0.03em]">
          Let’s talk about <br />
          <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E8FF] to-[#C4B5FD]">
            what happened today.
          </span>
        </h1>

        {/* Breathing Context Subtext */}
        <p className="text-sm sm:text-[14.5px] text-[#94A3B8] font-light leading-[1.65] max-w-lg">
          Your tailored track for{" "}
          <span className="text-white font-medium">{profile.profession}</span> is set to{" "}
          <span className="text-[#C4B5FD] font-medium">{profile.learningGoal}</span>.{" "}
          Speak naturally—we will evaluate fluency and concision in real time.
        </p>

        {/* High-End Clean Action Pill (Stimuler Speaking Launch) */}
        <div className="pt-2 flex items-center gap-4">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-6 py-3 rounded-full bg-white text-black hover:bg-[#F1F5F9] text-xs font-semibold tracking-wider uppercase flex items-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.15)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Start Speaking Drill</span>
            <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
              🎙
            </span>
          </button>

          <span className="text-xs text-white/40 font-light hidden sm:inline">
            or speak via the prompt bar below ↓
          </span>
        </div>
      </div>

      {/* RIGHT: Translucent Floating Ornaments (Apple & Stimuler style, Room stays visible) */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[360px] shrink-0">
        {/* Ornament 1: Vocabulary Recall */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.22] backdrop-blur-xl transition-all duration-200 cursor-pointer flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#C4B5FD] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <StudioMemoryIcon className="w-5 h-5 text-[#C4B5FD]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-[#A78BFA] uppercase font-bold">
                  ACTIVE RECALL
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/[0.06] text-[#E2E8F0]">
                  {profile.cardsDue} due
                </span>
              </div>
              <span className="text-sm font-medium text-white truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                “{profile.memoryWord}”
              </span>
            </div>
          </div>
          <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-sm pl-2">
            →
          </span>
        </div>

        {/* Ornament 2: Executive Dossier */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.22] backdrop-blur-xl transition-all duration-200 cursor-pointer flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <StudioReadingIcon className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-[#38BDF8] uppercase font-bold">
                  DAILY READING
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/[0.06] text-[#E2E8F0]">
                  {profile.readingTimeMin} min
                </span>
              </div>
              <span className="text-sm font-medium text-white truncate mt-0.5 group-hover:text-[#BAE6FD] transition-colors">
                {profile.readingArticle}
              </span>
            </div>
          </div>
          <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-sm pl-2">
            →
          </span>
        </div>

        {/* Ornament 3: Spoken Sparring */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.22] backdrop-blur-xl transition-all duration-200 cursor-pointer flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#FBBF24] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <StudioVoiceIcon className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-[#FBBF24] uppercase font-bold">
                  INTERVIEW SIMULATION
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/[0.06] text-[#E2E8F0]">
                  {profile.interviewRound}
                </span>
              </div>
              <span className="text-sm font-medium text-white truncate mt-0.5 group-hover:text-[#FDE68A] transition-colors">
                {profile.interviewTitle}
              </span>
            </div>
          </div>
          <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-sm pl-2">
            →
          </span>
        </div>
      </div>
    </div>
  );
};
