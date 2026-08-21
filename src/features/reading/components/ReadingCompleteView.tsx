import React, { useState } from "react";
import { ReadingCompletionQuiz } from "./ReadingCompletionQuiz";
import { GenerateQuizResponse } from "../../../domain/repositories/IReadingRepository";

export interface ReadingCompleteViewProps {
  articleId?: string | undefined;
  articleTitle?: string | undefined;
  articleContent?: string | undefined;
  keywords?: string[] | undefined;
  cefrLevel?: string | undefined;
  readingTimeMin?: number | undefined;
  cachedQuiz?: GenerateQuizResponse | undefined;
  onGetQuiz?:
    | ((
        articleId: string,
        title: string,
        content: string,
        keywords?: string[],
        level?: string
      ) => Promise<GenerateQuizResponse>)
    | undefined;
  onNextReading: () => void;
}

export const ReadingCompleteView: React.FC<ReadingCompleteViewProps> = ({
  articleId,
  articleTitle,
  articleContent,
  keywords,
  cefrLevel,
  readingTimeMin = 4,
  cachedQuiz,
  onGetQuiz,
  onNextReading,
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  if (showQuiz) {
    return (
      <div className="w-full flex items-center justify-center py-1 sm:py-2">
        <ReadingCompletionQuiz
          articleId={articleId}
          articleTitle={articleTitle || "Reading Article"}
          articleContent={articleContent || ""}
          keywords={keywords}
          cefrLevel={cefrLevel}
          cachedQuiz={cachedQuiz}
          onGetQuiz={onGetQuiz}
          onFinishQuiz={(score) => {
            setQuizScore(score);
            setShowQuiz(false);
          }}
          onSkip={() => setShowQuiz(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[560px] my-auto flex flex-col items-center justify-center space-y-4 sm:space-y-6 select-none animate-[fadeSlideUp_0.4s_ease-out_both] overflow-visible">
      {/* Top Section: Standalone Bespoke Check Icon & Elegant Typography */}
      <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2 pt-1 shrink-0">
        {/* Custom Standalone Glow Checkmark */}
        <div className="flex items-center justify-center mb-0.5 animate-[fadeIn_0.5s_ease-out_both]">
          <svg
            className="w-10 h-10 sm:w-11 sm:h-11 text-[#22c55e] filter drop-shadow-[0_0_16px_rgba(34,197,94,0.7)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide leading-tight">
          Reading complete
        </h2>

        <p className="text-xs sm:text-sm text-[#8e90a6] font-light max-w-sm leading-relaxed px-2">
          Great job! You&apos;ve finished this reading.
          <br />
          Ready to test your comprehension or start the next one?
        </p>

        {/* Clean Typography Action / Quiz Score (Zero Card Container) */}
        <div className="pt-1.5">
          {quizScore !== null ? (
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-light text-white/90 animate-[fadeIn_0.3s_ease-out_both] select-none py-1">
              <svg
                className="w-4 h-4 text-[#22c55e] filter drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="tracking-wide">
                Comprehension Quiz:{" "}
                <span className="font-semibold text-[#4ade80] filter drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">
                  {quizScore}/3 correct
                </span>
              </span>
            </div>
          ) : (
            <button
              onClick={() => setShowQuiz(true)}
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-light text-[#A27FF3] hover:text-white transition-all duration-300 cursor-pointer group py-1 select-none"
            >
              <span className="text-[#A27FF3] text-sm group-hover:scale-110 group-hover:text-white transition-transform filter drop-shadow-[0_0_8px_rgba(162,127,243,0.8)]">
                ✦
              </span>
              <span className="tracking-wide font-normal">
                Take Comprehension Quiz <span className="text-[#8e90a6] text-xs font-light">(3 Questions)</span>
              </span>
              <span className="text-[#A27FF3] group-hover:translate-x-1.5 group-hover:text-white transition-transform text-xs font-semibold">
                →
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Center Interactive "Next reading" Button with Micro-Sparkles */}
      <div className="flex flex-col items-center space-y-2 shrink-0">
        <div className="flex items-center space-x-5">
          <span className="text-[#A27FF3]/50 text-xs animate-pulse">✦</span>
          <span className="text-[#A27FF3] text-sm animate-pulse delay-100">✧</span>

          <button
            onClick={onNextReading}
            aria-label="Start next reading"
            className="w-14 h-14 sm:w-15 sm:h-15 rounded-full border border-[#261d5c] bg-[#05060d] hover:border-[#A27FF3] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_35px_rgba(112,72,232,0.35)] flex items-center justify-center cursor-pointer group"
          >
            <svg
              className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <span className="text-[#A27FF3] text-sm animate-pulse delay-150">✧</span>
          <span className="text-[#A27FF3]/50 text-xs animate-pulse delay-200">✦</span>
        </div>

        <span className="text-xs sm:text-sm font-medium text-white/90 tracking-wide">
          Next reading
        </span>
      </div>

      {/* Clean, Flat WHAT YOU DID Summary */}
      <div className="w-full pt-3 pb-1 border-t border-white/[0.06] flex flex-col items-center space-y-2 shrink-0">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#6b6c84] uppercase">
          WHAT YOU DID
        </span>

        <div className="w-full grid grid-cols-3 text-center">
          {/* Stat 1: Reading Time */}
          <div className="flex flex-col items-center space-y-0.5">
            <span className="text-sm sm:text-base font-medium text-white">
              {readingTimeMin} min
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#6b6c84] font-light">
              Reading time
            </span>
          </div>

          {/* Stat 2: Words read */}
          <div className="flex flex-col items-center space-y-0.5 border-x border-white/[0.06]">
            <span className="text-sm sm:text-base font-medium text-white">
              180 words
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#6b6c84] font-light">
              Completed
            </span>
          </div>

          {/* Stat 3: CEFR Level */}
          <div className="flex flex-col items-center space-y-0.5">
            <span className="text-sm sm:text-base font-medium text-white">
              {cefrLevel || "B1"}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#6b6c84] font-light">
              CEFR Level
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
