import React from "react";
import { useAiMentorFeedback } from "../hooks/useAiMentorFeedback";
import { MentorPresenceMark } from "./SettingsBespokeIcons";

/* Deterministic living waveform — no re-render jitter, breathing cadence. */
const WAVEFORM_HEIGHTS = Array.from({ length: 42 }, (_, i) =>
  Math.round(Math.max(3, Math.abs(Math.sin(i * 0.52)) * 9 + Math.sin(i * 0.19) * 3 + 2.5)),
);

export interface SettingsAIMentorCardProps {
  isActive?: boolean;
}

export const SettingsAIMentorCard: React.FC<SettingsAIMentorCardProps> = ({
  isActive: overrideIsActive,
}) => {
  const { messageTitle, messageBody, isActive: hookIsActive } = useAiMentorFeedback();
  const isActive = overrideIsActive ?? hookIsActive;

  return (
    <div className="relative rounded-3xl border border-white/[0.07] hover:border-white/[0.12] bg-[#04040A] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden transition-all duration-300">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-4 z-10 relative">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
          Your AI Mentor
        </span>
        {isActive && (
          <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400">
            Active
          </span>
        )}
      </div>

      {/* Presence Mark + Message */}
      <div className="flex items-start gap-3 sm:gap-4 z-10 relative">
        <div className="shrink-0">
          <MentorPresenceMark className="w-12 h-12 sm:w-14 sm:h-14 opacity-80" />
        </div>

        {/* Message Text */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-light text-white leading-snug">
            {messageTitle}
          </span>
          <span className="text-[11px] font-mono text-white/30 leading-relaxed mt-1">
            {messageBody}
          </span>
        </div>
      </div>

      {/* Living Waveform Line */}
      <div className="mt-4 sm:mt-5 flex items-center justify-center gap-[2.5px] h-3.5 overflow-hidden z-10 relative">
        {WAVEFORM_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={`w-[2px] rounded-full bg-white/60 animate-wave-${(i % 5) + 1}`}
            style={{
              height: `${h}px`,
              opacity: i < 4 || i > 37 ? 0.2 : 0.6,
              animationDelay: `${(i % 7) * 0.09}s`,
              animationDuration: `${0.8 + (i % 4) * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
