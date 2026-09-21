import React from "react";
import { MessageSquareText, ClipboardCheck, CircleCheck, CircleX, TrendingUp } from "lucide-react";

export interface WritingExecutiveSummaryProps {
  summary?: string;
  strengths: string[];
  issues: string[];
  improvements: string[];
}

function QuoteGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 22" fill="currentColor" aria-hidden="true">
      <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
    </svg>
  );
}

export const WritingExecutiveSummary: React.FC<WritingExecutiveSummaryProps> = ({
  summary = "",
  strengths,
  issues,
  improvements,
}) => {
  return (
    <>
      {/* Mentor Feedback */}
      {summary.trim().length > 0 && (
        <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-4 sm:p-6 shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between gap-3 mb-3 sm:mb-3.5">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#A27FF3] shrink-0" />
              <h3 className="text-[14.5px] sm:text-[15px] font-semibold text-white tracking-tight">
                Mentor Feedback
              </h3>
            </div>
            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8a8a9e]">
              AI MENTOR
            </span>
          </div>

          <div className="flex items-start gap-3 sm:gap-3.5 pl-0.5 sm:pl-1 pr-1 sm:pr-2">
            <QuoteGlyph className="w-[16px] sm:w-[18px] h-[14px] sm:h-[15px] shrink-0 mt-1 text-[#674ee6]" />
            <p className="text-[13px] sm:text-[14px] leading-[1.65] text-[#d4d4e0] font-normal">
              "{summary}"
            </p>
          </div>
        </article>
      )}

      {/* Performance Report: Strengths / Issues / Improvements */}
      <section className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-4 sm:p-6 lg:p-7 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#A27FF3] shrink-0" />
            <h3 className="text-[14.5px] sm:text-[15px] font-semibold text-white tracking-tight">
              Performance Report
            </h3>
          </div>
          <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8a8a9e]">
            FULL REVIEW
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-5">
          {/* Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <CircleCheck className="h-4 w-4 text-[#55c9a4]" strokeWidth={2.5} />
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#55c9a4]">
                What you did well
              </span>
            </div>
            <ul className="space-y-2.5">
              {strengths.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#d4d4e0]"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#55c9a4]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Issues */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <CircleX className="h-4 w-4 text-[#d8667a]" strokeWidth={2.5} />
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#d8667a]">
                What to fix
              </span>
            </div>
            <ul className="space-y-2.5">
              {issues.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#d4d4e0]"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#d8667a]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <TrendingUp className="h-4 w-4 text-[#9d7cf0]" />
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9d7cf0]">
                What to improve
              </span>
            </div>
            <ul className="space-y-2.5">
              {improvements.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#d4d4e0]"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#9d7cf0]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
