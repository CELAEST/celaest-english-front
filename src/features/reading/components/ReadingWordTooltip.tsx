import React from 'react';

export interface ReadingWordTooltipProps {
  word?: string | undefined;
  lemma?: string | undefined;
  lemmaTranslation?: string | undefined;
  phonetic?: string | undefined;
  partOfSpeech?: string | undefined;
  spanishTranslation?: string | undefined;
  definition?: string | undefined;
  exampleSentence?: string | undefined;
  audioUrl?: string | undefined;
  isSavedToMemory?: boolean | undefined;
  onAddToMemory?: (() => void) | undefined;
  onPlayAudio?: (() => void) | undefined;
}

export const ReadingWordTooltip: React.FC<ReadingWordTooltipProps> = ({
  word = 'matters',
  lemma,
  lemmaTranslation,
  phonetic = "/ˈmætərz/",
  partOfSpeech = 'verb',
  spanishTranslation = 'importar / ser importante',
  definition = 'to be important or have significance.',
  exampleSentence = '"Clarity matters in every conversation."',
  audioUrl,
  isSavedToMemory = false,
  onAddToMemory,
  onPlayAudio,
}) => {
  const handleSpeakerClick = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((e) => {
        console.warn("Audio playback failed, falling back to speech synthesis", e);
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(word);
          utterance.lang = "en-US";
          window.speechSynthesis.speak(utterance);
        }
      });
    } else if (onPlayAudio) {
      onPlayAudio();
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-[#05060c] border border-[#111220] rounded-3xl pt-5 pb-5 pl-10 pr-3.5 w-[215px] sm:w-[225px] shadow-2xl backdrop-blur-xl text-left flex flex-col select-none z-[999] relative overflow-visible animate-[scaleIn_0.3s_ease-out_both]">
      {/* Speaker Icon with audio playback */}
      <button
        onClick={handleSpeakerClick}
        aria-label="Listen to pronunciation"
        className="absolute top-3.5 -left-[16px] w-11 h-11 rounded-[16px] bg-[#12111e] border-0 text-[#b69aea] flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer shadow-xl z-[1000] group"
      >
        <svg className="w-[22px] h-[22px] text-[#b69aea] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      </button>

      {/* Header: Word Title & Phonetic */}
      <div className="pt-0.5 mb-2">
        <h3 className="text-xl sm:text-2xl font-medium text-[#f8f8f8] tracking-wide font-sans leading-tight">
          {word}
        </h3>
        {phonetic && (
          <span className="italic font-mono text-xs text-[#8a8a9e] mt-0.5 block">{phonetic}</span>
        )}
      </div>

      {/* Part of Speech & Spanish Translation */}
      <div className="flex flex-col text-xs text-[#8a8a9e] font-light space-y-0.5 w-full mt-1">
        <span className="text-[11px] text-[#717182] uppercase tracking-wider">{partOfSpeech || 'vocabulary'}</span>
        <span className="text-[#bd9ad4] font-medium text-xs leading-snug">
          {spanishTranslation || 'cargando traducción...'}
        </span>
        {lemma && lemmaTranslation && lemma.toLowerCase() !== (word || '').toLowerCase() && (
          <span className="text-[10px] text-[#A27FF3] bg-[#1a152e] px-2 py-0.5 rounded-md mt-1.5 w-fit border border-[#2e2354] leading-tight">
            Raíz: <strong className="text-white font-medium">{lemma}</strong> ({lemmaTranslation})
          </span>
        )}
      </div>

      {/* English Definition */}
      <p className="text-xs text-[#888689] font-light leading-relaxed mt-2.5 w-full">
        {definition}
      </p>

      {/* Example Quote */}
      {exampleSentence && (
        <p className="text-xs text-[#8a8a9e] italic leading-relaxed mt-3 pt-2.5 border-t border-[#111220] w-full">
          {exampleSentence}
        </p>
      )}

      {/* Action Link: + Add to Memory */}
      <button
        onClick={onAddToMemory}
        disabled={isSavedToMemory}
        className={`text-xs font-medium transition-all duration-200 cursor-pointer mt-3 pt-0.5 flex items-center space-x-1 group w-fit ${
          isSavedToMemory
            ? "text-emerald-400 cursor-default"
            : "text-[#bd9ad4] hover:text-white hover:translate-x-0.5"
        }`}
      >
        <span>{isSavedToMemory ? "✓ Saved to Memory" : "+ Add to Memory"}</span>
        {!isSavedToMemory && (
          <svg className="w-3.5 h-3.5 text-[#bd9ad4] group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
};
