import React, { useState } from "react";
import { BookOpen, ArrowRight, FileText, Check, Copy } from "lucide-react";

export interface WritingOriginalTextProps {
  content: string;
  errorCount: number;
  onNavigateToMemory?: (() => void) | undefined;
}

function QuoteGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 22" fill="currentColor" aria-hidden="true">
      <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
    </svg>
  );
}

export const WritingOriginalText: React.FC<WritingOriginalTextProps> = ({
  content,
  errorCount,
  onNavigateToMemory,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      {/* Extracted Memory Cards strip */}
      <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#141028] border border-[#251d48]">
            <BookOpen className="h-[18px] w-[18px] text-[#A27FF3]" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-white tracking-tight">
                Extracted Memory Cards
              </h3>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A27FF3]/15 px-1.5 text-[11px] font-semibold text-[#c4b5fd]">
                {errorCount}
              </span>
            </div>
            <p className="text-[12px] text-[#8a8a9e] truncate">
              Created from your mistakes to help you remember and improve faster.
            </p>
          </div>
        </div>
        {onNavigateToMemory && (
          <button
            onClick={onNavigateToMemory}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#A27FF3]/30 bg-[#A27FF3]/10 px-4 py-2.5 text-[12.5px] font-medium text-[#c4b5fd] transition-colors hover:bg-[#A27FF3]/20 hover:text-white cursor-pointer"
          >
            View Memory Cards
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </article>

      {/* Your Writing (Original Submission) */}
      <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 sm:p-7 shadow-xl transition-all">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#A27FF3] shrink-0" />
            <div className="flex items-center gap-2.5">
              <h3 className="text-[16px] font-semibold text-white tracking-tight">
                What you wrote
              </h3>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8a9e]">
                Original text
              </span>
            </div>
          </div>
        </div>

        {/* Body: Bespoke Purple SVG Quote Icon + Quoted Text */}
        <div className="flex items-start gap-4 pl-2 sm:pl-5 pr-6 sm:pr-28 mb-4">
          <QuoteGlyph className="w-[25px] h-[20px] shrink-0 mt-0.5 text-[#674ee6]" />
          <p className="text-[14.5px] leading-[1.75] text-[#d4d4e0] font-normal whitespace-pre-line">
            "{content}"
          </p>
        </div>

        {/* Bottom Row: Copy Button right aligned */}
        <div className="flex justify-end pt-1">
          <button
            onClick={handleCopyText}
            title="Copy your text"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[#8a8a9e] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer shadow-sm"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-[#55c9a4]" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </article>
    </>
  );
};
