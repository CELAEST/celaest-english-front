import React from "react";
import { useAiMentorFeedback } from "../hooks/useAiMentorFeedback";

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

      {/* Avatar + Message */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar Circle with Glowing Violet Border */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#080912] border border-[#231956] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(112,72,232,0.25)]">
          {/* Two glowing purple dots (eyes) */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#A27FF3] shadow-[0_0_8px_rgba(162,127,243,0.9)]" />
            <div className="w-2 h-2 rounded-full bg-[#A27FF3] shadow-[0_0_8px_rgba(162,127,243,0.9)]" />
          </div>
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

      {/* Animated Waveform Line */}
      <div className="mt-4 sm:mt-5 flex items-center justify-center gap-[2.5px] h-3.5 overflow-hidden">
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className="w-[2px] rounded-full bg-[#A27FF3]"
            style={{
              height: `${Math.max(3, Math.sin(i * 0.45) * 11 + Math.random() * 3)}px`,
              opacity: i < 4 || i > 37 ? 0.25 : 0.75,
            }}
          />
        ))}
      </div>
    </div>
  );
};
