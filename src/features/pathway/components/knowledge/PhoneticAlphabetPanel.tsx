import React from "react";
import { PHONETICS_DATA } from "../../data/pathwayKnowledgeData";
import { PhoneticSoundTile } from "./PhoneticSoundTile";

export interface PhoneticAlphabetPanelProps {
  playingText: string | null;
  onPlayAudio: (text: string) => void;
}

export const PhoneticAlphabetPanel: React.FC<PhoneticAlphabetPanelProps> = ({
  playingText,
  onPlayAudio,
}) => {
  const vowels = PHONETICS_DATA.filter((s) => s.category.startsWith("vowel"));
  const schwa = PHONETICS_DATA.filter((s) => s.category === "schwa");
  const consonants = PHONETICS_DATA.filter((s) => s.category === "consonant_trap");

  return (
    <div className="flex flex-col gap-5 py-1 select-none animate-[fadeIn_0.2s_ease-out]">
      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A78BFA]">
          El Secreto de la Fonética Nativa
        </span>
        <p className="text-xs sm:text-[13px] text-white/80 font-light leading-relaxed">
          En español solo existen 5 sonidos vocálicos. En inglés hay más de 12 vocales y consonantes con fricción especial. <strong className="text-white font-medium">Toca cualquier sonido para escuchar la articulación limpia de Liam.</strong>
        </p>
      </div>

      {/* Vocales Cortas vs Largas */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm font-medium text-white flex items-center justify-between">
          <span>1. Vocales Clave: Larga vs Corta (Tensión vs Relajación)</span>
          <span className="text-[10px] font-mono text-white/40">IPA /iː, ɪ, æ, ʌ, uː, ʊ/</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {vowels.map((s) => (
            <PhoneticSoundTile key={s.id} sound={s} isPlaying={playingText === s.sampleWord} onPlay={onPlayAudio} />
          ))}
        </div>
      </div>

      {/* Schwa */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm font-medium text-white flex items-center justify-between">
          <span>2. El Sonido Más Común del Inglés: Schwa /ə/</span>
          <span className="text-[10px] font-mono text-[#DDD6FE]">Ultra-Relajado</span>
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {schwa.map((s) => (
            <PhoneticSoundTile key={s.id} sound={s} isPlaying={playingText === s.sampleWord} onPlay={onPlayAudio} />
          ))}
        </div>
      </div>

      {/* Consonantes Trampa */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm font-medium text-white flex items-center justify-between">
          <span>3. Consonantes Trampa para Hispanohablantes (/θ, ð, v, s, ʃ/)</span>
          <span className="text-[10px] font-mono text-white/40">Fricción y Lengua</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {consonants.map((s) => (
            <PhoneticSoundTile key={s.id} sound={s} isPlaying={playingText === s.sampleWord} onPlay={onPlayAudio} />
          ))}
        </div>
      </div>
    </div>
  );
};

