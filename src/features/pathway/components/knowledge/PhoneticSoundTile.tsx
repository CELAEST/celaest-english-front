import React from "react";
import { Volume2 } from "lucide-react";
import { PhoneticSoundItem } from "../../data/pathwayKnowledgeData";

export interface PhoneticSoundTileProps {
  sound: PhoneticSoundItem;
  isPlaying: boolean;
  onPlay: (text: string) => void;
}

export const PhoneticSoundTile: React.FC<PhoneticSoundTileProps> = ({
  sound,
  isPlaying,
  onPlay,
}) => (
  <button
    type="button"
    onClick={() => onPlay(sound.sampleWord)}
    className="group text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#A78BFA]/40 transition-all flex flex-col justify-between gap-1.5 cursor-pointer"
  >
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-base sm:text-lg font-mono font-bold text-[#A78BFA] group-hover:text-[#DDD6FE]">
          {sound.ipa}
        </span>
        <span className="text-xs font-medium text-white/90">
          “{sound.sampleWord}”
        </span>
        <span className="text-[10px] font-mono text-white/40">
          {sound.sampleIpa}
        </span>
      </div>
      <Volume2
        size={13}
        className={`transition-colors ${
          isPlaying ? "text-[#DDD6FE] animate-pulse" : "text-white/30 group-hover:text-[#A78BFA]"
        }`}
      />
    </div>

    <p className="text-[11px] text-white/50 font-light leading-relaxed">
      {sound.mouthTip}
    </p>

    {sound.contrastWord && (
      <span className="text-[10px] font-mono text-white/35">
        Contraste: {sound.contrastWord}
      </span>
    )}
  </button>
);

