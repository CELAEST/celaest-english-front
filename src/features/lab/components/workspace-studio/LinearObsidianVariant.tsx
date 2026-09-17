import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

/**
 * Variant 2: Linear Obsidian / Precision Dark Engine
 * Silicon Valley high-end craft: Pitch black charcoal, razor-sharp 1px borders,
 * categorical color rails, agenda checklist, and maximum visual contrast.
 */
export const LinearObsidianVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Precision Monolith Engine Card */}
      <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start p-6 sm:p-7 rounded-2xl bg-[#08080C] border border-white/[0.16] shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative">
        {/* Telemetry Header Strip */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#94A3B8] uppercase">
              STUDIO LIVE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/[0.08] text-white border border-white/10">
              {profile.cefrLevel}
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">LATENCY 12ms</span>
          </div>
        </div>

        {/* Display Headline */}
        <div className="space-y-1">
          <p className="text-xs font-mono text-[#A78BFA] font-medium tracking-wider uppercase">
            // {profile.profession}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            Session ready. <br />
            <span className="text-white/90">Deep Focus & Execution.</span>
          </h1>
        </div>

        {/* Structured Agenda Checklist (Extreme Clarity) */}
        <div className="w-full p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
            <span className="w-4 h-4 rounded bg-[#7C3AED]/30 text-[#C4B5FD] flex items-center justify-center text-[10px] font-bold shrink-0">
              ✓
            </span>
            <span className="font-medium text-white">Retention Deck:</span>
            <span className="text-[#94A3B8] truncate">{profile.cardsDue} target items primed</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
            <span className="w-4 h-4 rounded bg-[#0284C7]/30 text-[#38BDF8] flex items-center justify-center text-[10px] font-bold shrink-0">
              ✓
            </span>
            <span className="font-medium text-white">Executive Reading:</span>
            <span className="text-[#94A3B8] truncate">{profile.readingArticle}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
            <span className="w-4 h-4 rounded bg-[#D97706]/30 text-[#FBBF24] flex items-center justify-center text-[10px] font-bold shrink-0">
              ✓
            </span>
            <span className="font-medium text-white">Interactive Voice:</span>
            <span className="text-[#94A3B8] truncate">{profile.interviewTitle}</span>
          </div>
        </div>

        {/* Action Button with Hotkey Badge */}
        <div className="pt-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white text-black hover:bg-[#F1F5F9] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-150 cursor-pointer shadow-lg active:scale-95"
          >
            <span>Continue Session</span>
            <span className="px-1.5 py-0.5 rounded bg-black/10 text-black/70 text-[10px] font-mono">
              ↵ Enter
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT: Precision Modular Slots with Status Rails */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[360px] xl:min-w-[380px] shrink-0">
        {/* Slot 1: Memory */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-4 rounded-xl bg-[#08080C] hover:bg-[#101017] border border-white/[0.14] hover:border-white/30 transition-all duration-200 cursor-pointer flex items-center justify-between relative overflow-hidden shadow-xl"
        >
          {/* Left Vertical Color Rail */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8B5CF6]" />

          <div className="flex items-center gap-3.5 pl-2 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/15 text-[#C4B5FD] flex items-center justify-center shrink-0">
              <StudioMemoryIcon className="w-5 h-5 text-[#C4B5FD]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#A78BFA] uppercase">
                  ACTIVE MEMORY
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {profile.cardsDue} ITEMS
                </span>
              </div>
              <span className="text-sm font-bold text-white truncate mt-0.5">
                “{profile.memoryWord}”
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-[#A78BFA] group-hover:translate-x-1 transition-transform pl-2">
            OPEN →
          </span>
        </div>

        {/* Slot 2: Reading */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-4 rounded-xl bg-[#08080C] hover:bg-[#101017] border border-white/[0.14] hover:border-white/30 transition-all duration-200 cursor-pointer flex items-center justify-between relative overflow-hidden shadow-xl"
        >
          {/* Left Vertical Color Rail */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#06B6D4]" />

          <div className="flex items-center gap-3.5 pl-2 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#06B6D4]/15 text-[#38BDF8] flex items-center justify-center shrink-0">
              <StudioReadingIcon className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#38BDF8] uppercase">
                  EDITORIAL FOCUS
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {profile.readingTimeMin} MIN READ
                </span>
              </div>
              <span className="text-sm font-bold text-white truncate mt-0.5">
                {profile.readingArticle}
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-[#38BDF8] group-hover:translate-x-1 transition-transform pl-2">
            READ →
          </span>
        </div>

        {/* Slot 3: Interview */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-4 rounded-xl bg-[#08080C] hover:bg-[#101017] border border-white/[0.14] hover:border-white/30 transition-all duration-200 cursor-pointer flex items-center justify-between relative overflow-hidden shadow-xl"
        >
          {/* Left Vertical Color Rail */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F59E0B]" />

          <div className="flex items-center gap-3.5 pl-2 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/15 text-[#FBBF24] flex items-center justify-center shrink-0">
              <StudioVoiceIcon className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#FBBF24] uppercase">
                  SIMULATION
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  48kHz AUDIO
                </span>
              </div>
              <span className="text-sm font-bold text-white truncate mt-0.5">
                {profile.interviewTitle}
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-[#FBBF24] group-hover:translate-x-1 transition-transform pl-2">
            START →
          </span>
        </div>
      </div>
    </div>
  );
};
