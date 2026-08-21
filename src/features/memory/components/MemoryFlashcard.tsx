import React, { useState } from 'react';

export interface MemoryFlashcardProps {
  category?: 'SPEAKING' | 'VOCABULARY' | 'GRAMMAR' | 'WRITING' | 'READING' | undefined;
  cardIndex?: number | undefined;
  totalCards?: number | undefined;
  userSentence?: string | undefined;
  errorWord?: string | undefined;
  correctSentence?: string | undefined;
  correctWord?: string | undefined;
  isFocused?: boolean | undefined;
  reviewDate?: string | undefined;
  onReveal?: (() => void) | undefined;
  onMenu?: (() => void) | undefined;
}

/** Category icon matching the mockup exactly */
const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  if (category === 'SPEAKING') {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
  }
  if (category === 'VOCABULARY') {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

/** Highlight the error word in red within the sentence */
const HighlightedSentence: React.FC<{
  sentence: string;
  highlightWord: string;
  color: string;
}> = ({ sentence, highlightWord, color }) => {
  if (!highlightWord) return <>{sentence}</>;
  const parts = sentence.split(new RegExp(`(${highlightWord})`, 'i'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlightWord.toLowerCase() ? (
          <span key={i} className="font-bold underline underline-offset-4 decoration-2" style={{ color, textDecorationColor: color }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export const MemoryFlashcard: React.FC<MemoryFlashcardProps> = ({
  category = 'SPEAKING',
  cardIndex = 1,
  totalCards = 8,
  userSentence = "He don't like coffee.",
  errorWord = "don't",
  isFocused = false,
  reviewDate,
  onReveal,
  onMenu,
}) => {
  const [isRevealed] = useState(false);

  return (
    <div
      className={`relative flex flex-col rounded-2xl sm:rounded-3xl border transition-all duration-300 select-none overflow-hidden shrink ${
        isFocused
          ? 'w-full max-w-[clamp(270px,30vw,460px)] h-full max-h-[clamp(230px,35vh,380px)] bg-[#05060c] border-[#111220] shadow-2xl backdrop-blur-xl z-10'
          : 'w-[clamp(200px,24vw,340px)] h-full max-h-[clamp(190px,28vh,310px)] bg-[#05060c]/60 border-[#111220] opacity-50 scale-[0.92]'
      }`}
    >
      {/* Subtle Background Wave Texture matching reference mockup */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7048E8]/30 via-transparent to-transparent" />

      {/* Card Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-3.5 sm:pt-4 pb-1 relative z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-[#999a9b]">
            <CategoryIcon category={category} />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase">
              {category}
            </span>
          </div>
        </div>

        {isFocused && (
          <div className="flex items-center space-x-3">
            <span className="text-[11px] text-[#999a9b] font-light tracking-wide">
              {cardIndex} / {totalCards}
            </span>
            <button onClick={onMenu} className="text-[#999a9b] hover:text-[#f8f8f8] transition-colors cursor-pointer p-0.5" aria-label="Card menu">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 px-4 sm:px-6 pb-3.5 sm:pb-4 relative z-10 justify-between min-h-0 overflow-hidden">
        <div className="text-center flex flex-col items-center justify-center">
          <span className="text-base sm:text-lg text-white/80 font-semibold tracking-wide block mb-2 sm:mb-3">You said</span>

          <p className={`font-light leading-snug tracking-wide text-[#f8f8f8] text-center ${
            isFocused
              ? 'text-[clamp(1.125rem,2.2vh,2rem)] my-0.5'
              : 'text-[clamp(0.95rem,1.8vh,1.35rem)] my-0.5'
          }`}>
            <HighlightedSentence sentence={userSentence} highlightWord={errorWord} color="#de5252" />
          </p>
        </div>

        {/* Reveal Section */}
        {isFocused && !isRevealed && (
          <div className="flex flex-col items-center space-y-1 mt-auto pt-1 shrink-0">
            <button
              onClick={onReveal}
              className="w-[clamp(2.4rem,4.5vh,3rem)] h-[clamp(2.4rem,4.5vh,3rem)] rounded-full bg-[#121026] border border-[#7048E8]/50 flex items-center justify-center text-[#A27FF3] hover:bg-[#7048E8]/30 hover:border-[#7048E8] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(112,72,232,0.4)] shrink-0"
              aria-label="Tap to reveal"
            >
              <svg className="w-4 h-4 text-[#A27FF3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>

            <span className="text-[clamp(0.75rem,1.5vh,0.875rem)] text-[#f8f8f8] font-light tracking-wide">Tap to reveal</span>
            <span className="text-[clamp(0.65rem,1.2vh,0.75rem)] text-[#999a9b] font-light tracking-wide">
              See the correct way and learn why.
            </span>
          </div>
        )}

        {/* Review date (side cards) */}
        {!isFocused && reviewDate && (
          <div className="mt-auto pt-1 shrink-0">
            <span className="text-[10px] text-[#999a9b] font-light tracking-wide">Review</span>
            <br />
            <span className="text-[10px] text-[#999a9b] font-light">{reviewDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};
