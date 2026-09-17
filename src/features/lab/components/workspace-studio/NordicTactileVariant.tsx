import React, { useState } from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

/**
 * Variant 4: Nordic Tactile / Hardware Studio
 * Inspired by Teenage Engineering, Braun, and Bang & Olufsen:
 * Matte dark anodized aluminum plates, physical hardware buttons,
 * crisp status readouts, and tactile modular cartridges with high contrast.
 */
export const NordicTactileVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  const [selectedMode, setSelectedMode] = useState<"dialogue" | "lexicon" | "dossier">("dialogue");

  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Matte Hardware Console */}
      <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start p-6 sm:p-7 rounded-2xl bg-[#0B0C10] border border-white/[0.18] shadow-[0_28px_65px_rgba(0,0,0,0.9)] relative">
        {/* Hardware Bezel Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/[0.1]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#E2E8F0] uppercase">
              CONSOLE READY · 48kHz
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black border border-white/10 text-[10px] font-mono text-[#F59E0B]">
            RETENTION {profile.retentionRate}%
          </div>
        </div>

        {/* Display Headline */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#A78BFA] tracking-wider uppercase font-bold">
            TRACK: {profile.profession}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            Target Focus: <br />
            <span className="text-[#DDD6FE]">{profile.learningGoal}</span>
          </h1>
        </div>

        {/* Hardware Tactile Mode Selector */}
        <div className="w-full p-1.5 rounded-xl bg-black border border-white/[0.1] grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setSelectedMode("dialogue")}
            className={`py-2 px-2 rounded-lg text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
              selectedMode === "dialogue"
                ? "bg-[#1E1B4B] text-white border border-[#818CF8]/50 shadow"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            DIALOGUE
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode("lexicon")}
            className={`py-2 px-2 rounded-lg text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
              selectedMode === "lexicon"
                ? "bg-[#1E1B4B] text-white border border-[#818CF8]/50 shadow"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            LEXICON
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode("dossier")}
            className={`py-2 px-2 rounded-lg text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
              selectedMode === "dossier"
                ? "bg-[#1E1B4B] text-white border border-[#818CF8]/50 shadow"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            DOSSIER
          </button>
        </div>

        {/* Tactical Engage Button */}
        <div className="pt-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSelectAction?.(selectedMode === "dialogue" ? "interview" : selectedMode === "lexicon" ? "memory" : "reading")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] hover:from-[#9333EA] hover:to-[#7C3AED] text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_6px_20px_rgba(109,40,217,0.5)] border-t border-white/30 active:translate-y-0.5 cursor-pointer"
          >
            <span>Engage Practice</span>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </button>
        </div>
      </div>

      {/* RIGHT: High-Contrast Modular Cartridges */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[360px] xl:min-w-[380px] shrink-0">
        {/* Cartridge 1: Memory */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-4 rounded-xl bg-[#0B0C10] hover:bg-[#141620] border border-white/[0.16] hover:border-white/40 transition-all duration-200 cursor-pointer flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-black border border-white/10 text-[#C4B5FD] flex items-center justify-center shrink-0">
              <StudioMemoryIcon className="w-5 h-5 text-[#C4B5FD]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#A78BFA] uppercase">
                  CARTRIDGE A // RECALL
                </span>
              </div>
              <span className="text-sm font-bold text-white truncate mt-0.5">
                “{profile.memoryWord}”
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                {profile.cardsDue} items awaiting drill
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-black border border-white/10 text-[10px] font-mono font-bold text-[#E2E8F0]">
            PULL ↵
          </span>
        </div>

        {/* Cartridge 2: Reading */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-4 rounded-xl bg-[#0B0C10] hover:bg-[#141620] border border-white/[0.16] hover:border-white/40 transition-all duration-200 cursor-pointer flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-black border border-white/10 text-[#38BDF8] flex items-center justify-center shrink-0">
              <StudioReadingIcon className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#38BDF8] uppercase">
                  CARTRIDGE B // ARTICLE
                </span>
              </div>
              <span className="text-sm font-bold text-white truncate mt-0.5">
                {profile.readingArticle}
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                {profile.readingTimeMin} min · {profile.readingCefr}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-black border border-white/10 text-[10px] font-mono font-bold text-[#E2E8F0]">
            LOAD ↵
          </span>
        </div>

        {/* Cartridge 3: Simulation */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-4 rounded-xl bg-[#0B0C10] hover:bg-[#141620] border border-white/[0.16] hover:border-white/40 transition-all duration-200 cursor-pointer flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-black border border-white/10 text-[#FBBF24] flex items-center justify-center shrink-0">
              <StudioVoiceIcon className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#FBBF24] uppercase">
                  CARTRIDGE C // VOICE
                </span>
              </div>
              <span className="text-sm font-bold text-white truncate mt-0.5">
                {profile.interviewTitle}
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                48kHz live duplex stream
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-black border border-white/10 text-[10px] font-mono font-bold text-[#E2E8F0]">
            CONNECT ↵
          </span>
        </div>
      </div>
    </div>
  );
};
