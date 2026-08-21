import React from 'react';

export interface MemoryCardFrontProps {
  category?: string;
  userSentence?: string;
  errorWord?: string;
  correctSentence?: string;
  correctWord?: string;
  onBookmark?: () => void;
}

export const MemoryCardFront: React.FC<MemoryCardFrontProps> = ({
  category = 'SPEAKING',
  userSentence = "He don't like coffee.",
  errorWord = "don't",
  correctSentence = "He doesn't like coffee.",
  correctWord = "doesn't",
  onBookmark,
}) => {
  return (
    <article className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#111220] bg-[#05060c] p-5 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-xl select-none min-h-[320px] max-h-[460px] h-full animate-[slideInLeft_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
      {/* Header: FRONT label + Bookmark */}
      <div className="flex items-center justify-between shrink-0">
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-[#A27FF3]/80 uppercase">FRONT</span>
        <button onClick={onBookmark} aria-label="Bookmark card" className="text-[#999a9b] transition-colors hover:text-[#A27FF3] cursor-pointer">
          <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      {/* Skill Tag */}
      <div className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/[0.05] px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium tracking-wide text-white/90 self-start border border-white/[0.06] shrink-0 animate-[fadeSlideUp_0.5s_ease-out_both]" style={{ animationDelay: '150ms' }}>
        <svg className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-[#A27FF3] shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="10" width="2" height="4" rx="1" />
          <rect x="7" y="6" width="2" height="12" rx="1" />
          <rect x="12" y="3" width="2" height="18" rx="1" />
          <rect x="17" y="6" width="2" height="12" rx="1" />
          <rect x="22" y="10" width="2" height="4" rx="1" />
        </svg>
        {category}
      </div>

      {/* You Said Section */}
      <div className="mt-4 sm:mt-5 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_both]" style={{ animationDelay: '250ms' }}>
        <p className="text-[11px] sm:text-[13px] text-[#999a9b] font-light">You said</p>
        <p className="mt-1.5 sm:mt-2 font-sans text-xl sm:text-2xl lg:text-[28px] font-medium leading-snug text-white">
          <HighlightWord sentence={userSentence} word={errorWord} color="#de5252" />
        </p>
      </div>

      {/* Divider */}
      <hr className="my-4 sm:my-5 border-[#111220] shrink-0 animate-[fadeIn_0.4s_ease-out_both]" style={{ animationDelay: '350ms' }} />

      {/* Better Way Section */}
      <div className="shrink-0 animate-[fadeSlideUp_0.5s_ease-out_both]" style={{ animationDelay: '400ms' }}>
        <p className="text-[11px] sm:text-[13px] text-[#999a9b] font-light">Better way</p>
        <p className="mt-1.5 sm:mt-2 font-sans text-xl sm:text-2xl lg:text-[28px] font-medium leading-snug text-white">
          <HighlightWord sentence={correctSentence} word={correctWord} color="#4ade80" />
        </p>
      </div>

      {/* Footer — anchored to bottom */}
      <div className="mt-auto flex items-center justify-center gap-1.5 sm:gap-2 pt-4 sm:pt-5 text-[11px] sm:text-[13px] text-[#999a9b] shrink-0 animate-[fadeIn_0.5s_ease-out_both]" style={{ animationDelay: '550ms' }}>
        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
        Review before revealing
      </div>
    </article>
  );
};

const HighlightWord: React.FC<{ sentence: string; word: string; color: string }> = ({ sentence, word, color }) => {
  if (!word) return <>{sentence}</>;
  const parts = sentence.split(new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === word.toLowerCase() ? (
          <span key={i} className="relative font-semibold" style={{ color }}>
            {part}
            <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full" style={{ backgroundColor: `${color}cc` }} />
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};
