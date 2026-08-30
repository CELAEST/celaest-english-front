import React from "react";

export interface ConversationHeaderProps {
  onEndSession?: () => void;
  onOpenAudioSettings?: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  onEndSession,
  onOpenAudioSettings,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-end items-center p-3 sm:p-5 z-30 select-none pointer-events-none gap-2 sm:gap-3">
      {/* Optional Audio Settings Shortcut (Accessible across all screen sizes) */}
      {onOpenAudioSettings && (
        <button
          type="button"
          onClick={onOpenAudioSettings}
          aria-label="Audio & mic settings"
          title="Audio & mic settings"
          className="p-2 rounded-full bg-[#060713]/80 border border-[#14152b] hover:bg-[#14152b] hover:border-[#A27FF3]/40 text-neutral-300 hover:text-white transition-all shadow-lg backdrop-blur-md pointer-events-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
      )}

      {/* Right Top: End interview Button */}
      <button
        type="button"
        onClick={onEndSession}
        className="flex items-center space-x-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#060713]/80 border border-[#14152b] hover:bg-[#14152b] hover:border-red-500/40 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer shadow-lg backdrop-blur-md pointer-events-auto"
      >
        <span className="text-xs sm:text-sm font-normal text-white tracking-wide">
          End interview
        </span>
        <svg
          className="w-4 h-3 text-red-400 group-hover:rotate-12 transition-transform duration-300"
          viewBox="0 0 24 16"
          fill="currentColor"
        >
          <path d="M12 2C8.2 2 4.7 3.4 2 5.8c-.5.4-.7 1.1-.4 1.7l1.2 2.1c.3.5.9.7 1.5.5l2.6-.9c.4-.1.7-.5.7-.9V6.1c1.3-.4 2.8-.6 4.4-.6s3.1.2 4.4.6v2.3c0 .4.3.8.7.9l2.6.9c.6.2 1.2 0 1.5-.5l1.2-2.1c.3-.6.1-1.3-.4-1.7C19.3 3.4 15.8 2 12 2z" />
        </svg>
      </button>
    </div>
  );
};
