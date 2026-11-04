import React, { useState } from "react";
import {
  PHONETIC_CATEGORIES,
  ENGLISH_PHONETICS_DATA,
  PhoneticCategoryId,
  PhoneticSound,
} from "../../data/englishPhoneticsData";
import { PhoneticAudioService } from "../../services/PhoneticAudioService";
import { PhoneticSoundRow } from "./PhoneticSoundRow";

export const PhoneticsGuideView: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<PhoneticCategoryId>("short_vowels");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const currentCat = PHONETIC_CATEGORIES.find((c) => c.id === selectedCat) || PHONETIC_CATEGORIES[0]!;
  const filteredSounds = ENGLISH_PHONETICS_DATA.filter((s) => s.category === selectedCat);

  const handlePlaySound = (sound: PhoneticSound) => {
    setPlayingId(sound.id);
    void PhoneticAudioService.playPhoneme(sound.id, sound.isolatedAudio, () => setPlayingId(null));
  };

  const handlePlayWord = (sound: PhoneticSound) => {
    setPlayingId(sound.sampleWord);
    void PhoneticAudioService.playWord(sound.sampleWord, () => setPlayingId(null));
  };

  return (
    <div className="space-y-4 py-1 select-none animate-[fadeIn_0.2s_ease-out]">
      {/* Selector de categorías — Pura tipografía flotante sin cajas */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-white/[0.06] pb-2 overflow-x-auto [scrollbar-width:none]">
        {PHONETIC_CATEGORIES.map((cat) => {
          const isActive = cat.id === selectedCat;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`shrink-0 text-xs font-mono tracking-wider transition-colors cursor-pointer pb-1 ${
                isActive
                  ? "text-white font-medium border-b-2 border-[#A78BFA]"
                  : "text-white/45 hover:text-white"
              }`}
            >
              {cat.name} ({cat.symbolCount})
            </button>
          );
        })}
      </div>

      {/* Introducción y Regla Pedagógica de la Categoría */}
      <div className="space-y-0.5">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A78BFA]">
          Pilar Fonético · {currentCat.symbolCount} de 44 sonidos (Voces Humanas Reales)
        </span>
        <h3 className="text-sm sm:text-base font-normal text-white">
          {currentCat.name}
        </h3>
        <p className="text-xs text-white/60 font-light">
          {currentCat.tagline}. Toca el símbolo para oír el <strong className="text-white font-medium">sonido aislado en voz humana</strong> o la palabra para oír su pronunciación real.
        </p>
      </div>

      {/* Lista de fonemas — pure floating typography */}
      <div className="divide-y divide-white/[0.04] border-t border-white/[0.06]">
        {filteredSounds.map((sound) => (
          <PhoneticSoundRow
            key={sound.id}
            sound={sound}
            playingId={playingId}
            onPlaySound={handlePlaySound}
            onPlayWord={handlePlayWord}
          />
        ))}
      </div>
    </div>
  );
};
