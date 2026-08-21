import React from "react";
import { Keyboard, ChevronRight, SlidersHorizontal } from "lucide-react";

export interface ConversationActionToolbarProps {
  onOpenTypedPhrase: () => void;
  onOpenAnalysisModal: () => void;
  onOpenAudioSettings: () => void;
  hasFeedback?: boolean;
}

export const ConversationActionToolbar: React.FC<ConversationActionToolbarProps> = ({
  onOpenTypedPhrase,
  onOpenAnalysisModal,
  onOpenAudioSettings,
  hasFeedback = false,
}) => {
  return (
    <div className="flex items-center justify-center select-none z-10 animate-[fadeSlideUp_0.3s_ease-out_both] shrink-0">
      <div className="flex items-center rounded-2xl bg-[#060713] border border-[#14152b] shadow-2xl backdrop-blur-xl divide-x divide-[#14152b] overflow-hidden">
        {/* Button 1: Test with typed phrase (Always Visible) */}
        <button
          type="button"
          onClick={onOpenTypedPhrase}
          className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2 hover:bg-white/[0.04] transition-colors cursor-pointer group text-left"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#1b1338] border border-[#A27FF3]/30 flex items-center justify-center text-[#A27FF3] group-hover:scale-105 transition-transform shadow-inner shrink-0">
            <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white/95 group-hover:text-white transition-colors truncate">
              Test with typed phrase
            </span>
            <span className="text-[10px] text-neutral-400 font-light truncate">
              (English or Spanish)
            </span>
          </div>
        </button>

        {/* Button 2: Open Full Analysis Modal (ONLY Visible when hasFeedback is true) */}
        {hasFeedback && (
          <button
            type="button"
            onClick={onOpenAnalysisModal}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 hover:bg-white/[0.04] transition-colors cursor-pointer group animate-[fadeIn_0.25s_ease-out_both]"
          >
            {/* Animated Equalizer Waveform Bars in Violet */}
            <div className="flex items-end gap-0.5 h-3.5 text-[#A27FF3] shrink-0">
              <span className="w-0.5 h-2 bg-[#A27FF3] rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
              <span className="w-0.5 h-3.5 bg-[#A27FF3] rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s]" />
              <span className="w-0.5 h-2 bg-[#A27FF3] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s]" />
              <span className="w-0.5 h-3.5 bg-[#A27FF3] rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.1s]" />
            </div>
            <span className="text-xs font-medium text-[#A27FF3] group-hover:text-[#c084fc] transition-colors whitespace-nowrap">
              Open Full Analysis Modal
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#A27FF3] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        )}

        {/* Button 3: Audio & mic settings (Always Visible) */}
        <button
          type="button"
          onClick={onOpenAudioSettings}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 hover:bg-white/[0.04] transition-colors cursor-pointer group"
        >
          <SlidersHorizontal className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors shrink-0" />
          <span className="text-xs font-medium text-neutral-300 group-hover:text-white transition-colors whitespace-nowrap">
            Audio & mic settings
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
};
