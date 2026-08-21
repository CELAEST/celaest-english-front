import React from "react";

export const SettingsFooterMessage: React.FC = () => {
  return (
    <div className="rounded-3xl border border-[#111220] bg-[#05060c] p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
      {/* Message with Star */}
      <div className="flex items-start gap-3">
        {/* Purple Star Icon */}
        <div className="shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-[#A27FF3]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14l-6-4.8h7.6L12 2z" />
          </svg>
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

      {/* Purple Progress Bar */}
      <div className="mt-4 w-full h-1 rounded-full bg-[#111220] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7048E8] to-[#A27FF3] shadow-[0_0_10px_rgba(162,127,243,0.5)]"
          style={{ width: "85%" }}
        />
      </div>
    </div>
  );
};
