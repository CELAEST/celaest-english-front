import React from "react";
import { SparkleMark } from "./SettingsBespokeIcons";

export const SettingsFooterMessage: React.FC = () => {
  return (
    <div className="rounded-3xl border border-[#111220] bg-[#05060c] p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
      {/* Message with Sparkle */}
      <div className="flex items-start gap-3">
        {/* Gradient Sparkle */}
        <div className="shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(162,127,243,0.5)]">
          <SparkleMark className="w-5 h-5" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-[#f8f8f8] leading-snug">
            Everything here helps me teach you better.
          </span>
          <span className="text-xs text-[#999a9b] font-light mt-1 leading-relaxed">
            You can always change these settings later.
          </span>
        </div>
      </div>

      {/* Vault integrity strip — a true statement, not decoration */}
      <div className="mt-4 flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#8F7CC7]">
          Vault integrity
        </span>
        <span className="text-[10px] font-mono text-[#66667c] tracking-wide">AES-256 · GCM</span>
      </div>
      <div className="w-full h-1 rounded-full bg-[#111220] overflow-hidden">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-[#7048E8] to-[#A27FF3] shadow-[0_0_10px_rgba(162,127,243,0.5)] animate-[borderGleamFlow_4s_ease-in-out_infinite] bg-[length:250%_250%]" />
      </div>
    </div>
  );
};
