import React from 'react';

export interface MemoryCardBackProps {
  revealed?: boolean;
  translation?: string;
  mentorTip?: string;
  grammarExplanation?: string;
  onMenu?: () => void;
  onPlayTranslation?: () => void;
}

export const MemoryCardBack: React.FC<MemoryCardBackProps> = ({
  revealed = true,
  translation = 'A él no le gusta el café.',
  grammarExplanation,
  mentorTip = 'Focus on the subject first, then choose the correct auxiliary verb.',
  onMenu,
  onPlayTranslation,
}) => {
  const explanationText = grammarExplanation || mentorTip;

  return (
    <article
      aria-hidden={!revealed}
      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#111220] bg-[#05060c] p-5 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-xl transition-all duration-700 ease-out select-none animate-[slideInRight_0.5s_cubic-bezier(0.22,1,0.36,1)_both] min-h-[320px] max-h-[460px] h-full ${
        revealed ? 'opacity-100 blur-0 scale-100 select-text' : 'pointer-events-none opacity-50 blur-[8px] scale-[0.98]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between shrink-0">
        <span className="text-xs font-medium tracking-[0.18em] text-[#A27FF3]/80">BACK</span>
        <button onClick={onMenu} aria-label="More options" className="text-[#999a9b] transition-colors hover:text-white cursor-pointer">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Translation */}
      <div className="mt-2.5 sm:mt-3 flex items-start gap-3 shrink-0">
        <button onClick={onPlayTranslation} className="mt-0.5 text-[#A27FF3] cursor-pointer hover:scale-110 transition-transform">
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </button>
        <div>
          <p className="text-xs text-[#A27FF3]/80 font-medium">Translation</p>
          <p className="mt-0.5 font-sans text-base sm:text-lg lg:text-xl font-medium text-white">
            {translation}
          </p>
        </div>
      </div>

      <hr className="my-2.5 sm:my-3 border-[#111220] shrink-0" />

      {/* Why is this better? Dynamic explanation for respective card */}
      <div className="flex items-start gap-3 shrink-0">
        <svg className="mt-0.5 h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 text-[#A27FF3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <p className="text-xs text-[#A27FF3]/80 font-medium">Why is this better?</p>
          <p className="mt-1 leading-relaxed text-white/90 text-xs sm:text-sm">
            {explanationText}
          </p>
        </div>
      </div>

      <hr className="my-2.5 sm:my-3 border-[#111220] shrink-0" />

      {/* Mentor tip */}
      <div className="flex items-start gap-3 shrink-0">
        <svg className="mt-0.5 h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 text-[#A27FF3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
        <div>
          <p className="text-xs text-[#A27FF3]/80 font-medium">Mentor tip</p>
          <p className="mt-1 leading-relaxed text-white/90 text-xs sm:text-sm font-light">
            Practice this sentence aloud to build muscle memory and natural native rhythm.
          </p>
        </div>
      </div>
    </article>
  );
};
