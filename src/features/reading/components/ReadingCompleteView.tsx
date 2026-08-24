import React, { useState, useMemo } from "react";
import { ReadingCompletionQuiz } from "./ReadingCompletionQuiz";
import { GenerateQuizResponse } from "../../../domain/repositories/IReadingRepository";
import {
  ReadingSuccessIcon,
  ComprehensionQuizIcon,
  NextReadingArrowIcon,
  ChronometerIcon,
  LexiconWordCountIcon,
  CefrGraduatedTierIcon,
  ReturnArrowIcon,
} from "./ReadingBespokeIcons";

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
  onReviewReading?: () => void;
}

export const ReadingCompleteView: React.FC<ReadingCompleteViewProps> = React.memo(({
  articleId,
  articleTitle,
  articleContent,
  keywords,
  cefrLevel,
  readingTimeMin = 4,
  cachedQuiz,
  onGetQuiz,
  onNextReading,
  onReviewReading,
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const wordCount = useMemo(() => {
    if (!articleContent) return 0;
    const words = articleContent.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [articleContent]);

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
    <div className="w-full max-w-lg lg:max-w-xl mx-auto my-auto flex flex-col items-center justify-between space-y-6 sm:space-y-8 select-none animate-[fadeSlideUp_0.45s_ease-out_both] overflow-visible py-3 sm:py-6">
      {/* 1. Header Section */}
      <div className="flex flex-col items-center text-center space-y-2.5 pt-1 shrink-0">
        <div className="flex items-center justify-center mb-1">
          <ReadingSuccessIcon />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-[32px] font-sans font-light text-white tracking-tight leading-tight">
          Reading Complete
        </h2>

        <p className="text-xs sm:text-sm text-[#9b9cb4] font-light max-w-sm sm:max-w-md leading-relaxed px-2">
          You have completed this chapter. Test your comprehension with a quick assessment or continue to the next reading.
        </p>

        {/* Assessment Action Trigger */}
        <div className="pt-2">
          {quizScore !== null ? (
            <div className="inline-flex items-center space-x-2.5 text-xs sm:text-sm font-medium text-white/90 animate-[fadeIn_0.3s_ease-out_both] select-none py-2 px-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 shadow-[0_0_16px_rgba(10,185,129,0.15)]">
              <svg
                className="w-4 h-4 text-emerald-400 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="tracking-wide text-xs font-normal">
                Comprehension Assessment:{" "}
                <span className="font-semibold text-emerald-400">
                  {quizScore}/3 correct
                </span>
              </span>
            </div>
          ) : (
            <div className="relative inline-flex p-[1px] rounded-full overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_4px_24px_rgba(112,72,232,0.18)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.08] via-[#8B5CF6]/60 to-white/[0.08] animate-border-gleam" />

              <button
                type="button"
                onClick={() => setShowQuiz(true)}
                className="relative rounded-full px-5 py-2.5 bg-[#080814]/95 backdrop-blur-xl flex items-center space-x-2.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] select-none group-hover:bg-[#0c0c20]/95"
              >
                <ComprehensionQuizIcon />
                <span className="text-white font-medium tracking-tight">
                  Take Comprehension Quiz
                </span>
                <span className="text-[#a5a6c2] text-xs font-light tracking-wide">
                  · 3 questions
                </span>
                <svg
                  className="w-3.5 h-3.5 text-[#C4B5FD] group-hover:translate-x-1 transition-transform duration-200 ml-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Center Primary Directional Action + Review Trigger */}
      <div className="flex flex-col items-center space-y-3 shrink-0 py-1">
        <button
          type="button"
          onClick={onNextReading}
          aria-label="Start next reading"
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-[#3b2b73] bg-[#070814] hover:border-[#A27FF3] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(112,72,232,0.35)] flex items-center justify-center cursor-pointer group"
        >
          <NextReadingArrowIcon />
        </button>

        <span className="text-xs sm:text-sm font-semibold text-white/95 tracking-wide">
          Next reading
        </span>

        {onReviewReading && (
          <button
            type="button"
            onClick={onReviewReading}
            className="group inline-flex items-center space-x-1.5 text-xs text-[#7e8096] hover:text-white transition-colors duration-200 cursor-pointer pt-1"
          >
            <ReturnArrowIcon />
            <span className="font-light tracking-wide">Re-read article</span>
          </button>
        )}
      </div>

      {/* 3. Pure Naked Telemetry Grid */}
      <div className="w-full pt-2 flex flex-col items-center space-y-3 shrink-0">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#6b6c84] uppercase">
          SESSION TELEMETRY
        </span>

        <div className="w-full grid grid-cols-3 text-center items-center py-2 px-1">
          {/* Stat 1: Reading Time */}
          <div className="flex flex-col items-center space-y-1.5 group">
            <ChronometerIcon />
            <span className="text-base sm:text-lg font-semibold text-white tracking-tight">
              {readingTimeMin} min
            </span>
            <span className="text-[11px] sm:text-xs text-[#7e8096] font-light tracking-wide">
              Reading Time
            </span>
          </div>

          {/* Stat 2: Dynamic Words read */}
          <div className="flex flex-col items-center space-y-1.5 border-x border-white/[0.08] group">
            <LexiconWordCountIcon />
            <span className="text-base sm:text-lg font-semibold text-white tracking-tight">
              {wordCount} words
            </span>
            <span className="text-[11px] sm:text-xs text-[#7e8096] font-light tracking-wide">
              Completed
            </span>
          </div>

          {/* Stat 3: CEFR Level */}
          <div className="flex flex-col items-center space-y-1.5 group">
            <CefrGraduatedTierIcon />
            <span className="text-base sm:text-lg font-semibold text-white tracking-tight">
              {cefrLevel || "B1"}
            </span>
            <span className="text-[11px] sm:text-xs text-[#7e8096] font-light tracking-wide">
              CEFR Level
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ReadingCompleteView.displayName = "ReadingCompleteView";
