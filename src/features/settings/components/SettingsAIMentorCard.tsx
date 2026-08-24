import React from "react";
import { useAiMentorFeedback } from "../hooks/useAiMentorFeedback";
import { MentorPresenceMark } from "./SettingsBespokeIcons";

/* Deterministic living waveform — no re-render jitter, breathing cadence. */
const WAVEFORM_HEIGHTS = Array.from({ length: 42 }, (_, i) =>
  Math.round(
    Math.max(3, Math.abs(Math.sin(i * 0.52)) * 9 + Math.sin(i * 0.19) * 3 + 2.5)
  )
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
    <div className="rounded-3xl border border-[#111220] bg-[#05060c] p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-4">
        <span className="text-sm sm:text-base font-medium text-[#f8f8f8] tracking-wide">
          Your AI Mentor
        </span>
        {isActive && (
          <span className="text-[11px] tracking-wider uppercase font-semibold text-[#4ade80] filter drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
            Active
          </span>
        )}
      </div>

      {/* Presence Mark + Message */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="shrink-0 animate-[floatSlow_6s_ease-in-out_infinite] drop-shadow-[0_0_14px_rgba(112,72,232,0.45)]">
          <MentorPresenceMark className="w-12 h-12 sm:w-14 sm:h-14" />
        </div>

        {/* Message Text */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm sm:text-[15px] font-medium text-[#f8f8f8] leading-snug">
            {messageTitle}
          </span>
          <span className="text-xs sm:text-[13px] text-[#999a9b] font-light leading-relaxed mt-1">
            {messageBody}
          </span>
        </div>
      </div>

      {/* Living Waveform Line */}
      <div className="mt-4 sm:mt-5 flex items-center justify-center gap-[2.5px] h-3.5 overflow-hidden">
        {WAVEFORM_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={`w-[2px] rounded-full bg-[#A27FF3] animate-wave-${(i % 5) + 1}`}
            style={{
              height: `${h}px`,
              opacity: i < 4 || i > 37 ? 0.25 : 0.75,
              animationDelay: `${(i % 7) * 0.09}s`,
              animationDuration: `${0.6 + (i % 4) * 0.08}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
