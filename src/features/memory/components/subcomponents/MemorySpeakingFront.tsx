import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";
import { HighlightWord } from "./HighlightWord";
import { Volume2 } from "lucide-react";

interface MemorySpeakingFrontProps {
  card: MemoryCard;
  isPlayingAudio: boolean;
  onPlayVoice: (e: React.MouseEvent) => void;
}

export const MemorySpeakingFront: React.FC<MemorySpeakingFrontProps> = ({
  card,
  isPlayingAudio,
  onPlayVoice,
}) => {
  return (
    <div className="flex flex-col justify-center space-y-6 my-auto py-2 z-10 select-none">
      {/* 1. YOU SAID Section */}
      <div className="space-y-2">
        <span className="block text-[10px] font-mono uppercase tracking-widest text-[#F87171]/80">
          YOU SAID
        </span>
        <p className="text-lg sm:text-xl lg:text-2xl font-normal text-white/90 leading-relaxed pl-3 border-l border-[#F87171]/40">
          "
          <HighlightWord
            sentence={card.userSaid}
            word={card.errorWord || ""}
            color="#F87171"
          />
          "
        </p>
      </div>

      {/* Subtle Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* 2. BETTER WAY Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-[#34D399]/80">
            BETTER WAY
          </span>

          {/* Clean Audio Speaker */}
          <button
            type="button"
            onClick={onPlayVoice}
            aria-label="Listen to pronunciation"
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              isPlayingAudio
                ? "text-[#34D399] bg-[#34D399]/15 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                : "text-white/40 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-pulse" : ""}`} />
          </button>
        </div>

        <p className="text-lg sm:text-xl lg:text-2xl font-normal text-white leading-relaxed pl-3 border-l border-[#34D399]/60">
          "
          <HighlightWord
            sentence={card.betterWay}
            word={card.correctWord || ""}
            color="#34D399"
          />
          "
        </p>
      </div>
    </div>
  );
};
