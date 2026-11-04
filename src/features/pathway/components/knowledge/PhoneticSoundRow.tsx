import React from "react";
import { Volume2 } from "lucide-react";
import { PhoneticSound } from "../../data/englishPhoneticsData";

export interface PhoneticSoundRowProps {
  sound: PhoneticSound;
  playingId: string | null;
  onPlaySound: (sound: PhoneticSound) => void;
  onPlayWord: (sound: PhoneticSound) => void;
}

export const PhoneticSoundRow: React.FC<PhoneticSoundRowProps> = ({
  sound, playingId, onPlaySound, onPlayWord,
}) => {
  const isSpeakingSound = playingId === sound.id;
  const isSpeakingWord = playingId === sound.sampleWord;

  return (
    <div className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2.5 sm:gap-6 group select-none">
      {/* Símbolo IPA humano, Cómo suena y Truco anatómico */}
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-baseline gap-2.5">
          <button
            type="button"
            onClick={() => onPlaySound(sound)}
            className="flex items-center gap-1.5 cursor-pointer group/ipa text-left"
            title={`Escuchar sonido ${sound.ipa} en voz humana real`}
          >
            <span className={`font-mono text-base sm:text-lg font-bold transition-colors ${
              isSpeakingSound ? "text-[#A78BFA] animate-pulse" : "text-[#A78BFA] group-hover/ipa:text-white"
            }`}>{sound.ipa}</span>
            <Volume2 size={12} aria-hidden className={`transition-colors ${
              isSpeakingSound ? "text-[#A78BFA] animate-pulse" : "text-white/30 group-hover/ipa:text-[#A78BFA]"
            }`} />
          </button>
          <span className="text-xs sm:text-[13px] font-medium text-white">{sound.title}</span>
        </div>

        <p className="text-xs sm:text-[12.5px] text-white/85 font-light leading-relaxed">
          <span className="font-mono text-[#A78BFA] text-[10.5px] uppercase tracking-wider mr-1.5 font-medium">Cómo suena:</span>
          {sound.howItSounds}
        </p>
        <p className="text-[11px] text-white/50 font-light">{sound.mouthTip}</p>
        {sound.spanishTrap && (
          <p className="text-[11px] text-white/40 font-light">
            <span className="text-[#F43F5E]/80 font-mono mr-1">Ojo:</span>{sound.spanishTrap}
          </p>
        )}
      </div>

      {/* Palabra de ejemplo en voz humana y contraste */}
      <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-1 shrink-0 pt-0.5 sm:pt-0">
        <button
          type="button"
          onClick={() => onPlayWord(sound)}
          className="flex items-baseline gap-2 text-left cursor-pointer transition-colors group/btn"
          title={`Escuchar "${sound.sampleWord}" con pronunciación humana nativa`}
        >
          <span className={`font-mono text-xs sm:text-sm transition-colors ${
            isSpeakingWord ? "text-[#A78BFA] font-medium" : "text-white group-hover/btn:text-[#A78BFA]"
          }`}>“{sound.sampleWord}”</span>
          <span className="text-[11px] font-mono text-white/40">{sound.sampleIpa}</span>
          <Volume2 size={12} aria-hidden className={`shrink-0 transition-colors ${
            isSpeakingWord ? "text-[#A78BFA] animate-pulse" : "text-white/30 group-hover/btn:text-[#A78BFA]"
          }`} />
        </button>
        <span className="text-[11px] text-white/50 font-light">— {sound.sampleTranslation}</span>
        {sound.contrast && (
          <span className="text-[10px] font-mono text-white/35">
            vs {sound.contrast.word} ({sound.contrast.translation})
          </span>
        )}
      </div>
    </div>
  );
};
