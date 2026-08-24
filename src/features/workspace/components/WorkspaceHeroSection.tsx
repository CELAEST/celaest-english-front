import React from 'react';

export interface WorkspaceHeroSectionProps {
  userName?: string | undefined;
  onContinueTopic?: (() => void) | undefined;
}

export const WorkspaceHeroSection: React.FC<WorkspaceHeroSectionProps> = ({
  userName = 'ESTEBAN',
  onContinueTopic,
}) => {
  return (
    <div className="space-y-3 sm:space-y-4 max-w-lg select-none pt-2 sm:pt-3.5 pl-1 sm:pl-2.5 z-10">
      {/* Category Tag */}
      <div className="flex items-center gap-2 animate-[fadeSlideUp_0.5s_ease-out_both]" style={{ animationDelay: '0ms' }}>
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#9375E6] uppercase">
          GOOD EVENING, {userName}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#9375E6] shadow-[0_0_8px_#9375E6] animate-pulse" />
      </div>

      {/* Main Headline — Unified Serif Typography */}
      <h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[52px] font-serif font-normal text-white tracking-normal leading-[1.12] animate-[fadeSlideUp_0.6s_ease-out_both]"
        style={{ animationDelay: '100ms' }}
      >
        I’ve been thinking <br />
        about our last <br />
        <span className="italic text-[#B197FF]">
          conversation.
        </span>
      </h1>

      {/* Subtext Paragraph */}
      <p
        className="text-xs sm:text-sm text-[#9E9EBD] font-light leading-relaxed font-sans pt-0.5 sm:pt-1 animate-[fadeSlideUp_0.6s_ease-out_both]"
        style={{ animationDelay: '220ms' }}
      >
        You mentioned you struggle with <br className="hidden sm:inline" />
        expressing your ideas in meetings. <br className="hidden sm:inline" />
        Shall we continue from there?
      </p>

      {/* Signature Link */}
      <div className="pt-1 sm:pt-2 animate-[fadeSlideUp_0.6s_ease-out_both]" style={{ animationDelay: '320ms' }}>
        <button
          onClick={onContinueTopic}
          className="text-xs sm:text-sm font-light text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 group/link"
        >
          <span className="group-hover/link:translate-x-1 transition-transform duration-300">— Lingua</span>
        </button>
      </div>
    </div>
  );
};
