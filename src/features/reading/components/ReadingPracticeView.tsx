import React from "react";
import { ReadingHeader } from "./ReadingHeader";
import { ReadingArticleHeader } from "./ReadingArticleHeader";
import { ReadingArticleReader } from "./ReadingArticleReader";
import { ReadingBottomBar } from "./ReadingBottomBar";
import { ReadingAIMentorCard } from "./ReadingAIMentorCard";
import { ReadingProgressCard } from "./ReadingProgressCard";
import { ReadingFocusCard } from "./ReadingFocusCard";
import { ReadingConfidenceCard } from "./ReadingConfidenceCard";
import { ReadingPreparingView } from "./ReadingPreparingView";
import { ReadingCompleteView } from "./ReadingCompleteView";
import { useReadingArticles } from "../hooks/useReadingArticles";

export interface ReadingPracticeViewProps {
  onBackToWorkspace?: () => void;
  onFocusMode?: () => void;
}

export const ReadingPracticeView: React.FC<ReadingPracticeViewProps> = () => {
  const {
    currentArticle,
    currentPageIndex,
    totalPages,
    currentPageContent,
    progressPercentage,
    isCompleted,
    isGenerating,
    nextPage,
    prevPage,
    generateNextArticle,
    getOrFetchQuiz,
    instantWordLookup,
  } = useReadingArticles();

  const articleCategory = currentArticle?.category || "BUSINESS";
  const articleReadTime = `${currentArticle?.readTimeMin || 4} MIN READ`;
  const articleTitle =
    currentArticle?.title ||
    "Navigating Cross-Functional Communication in Tech";
  const articleSubtitle =
    currentArticle?.excerpt ||
    "Effective collaboration across product, design, and engineering teams requires clear terminology and active listening.";

  const isSpecialView = isGenerating || isCompleted;

  return (
    <div
      className={`relative w-full h-[100dvh] max-h-[100dvh] bg-[#000001] text-white flex flex-col justify-between select-none z-10 animate-[fadeIn_0.5s_ease-out_both] overflow-hidden`}
    >
      {/* Main Workspace Layout Canvas */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-4 sm:px-8 lg:px-12 py-2 sm:py-3 gap-8 xl:gap-12 2xl:gap-16 z-10 overflow-hidden">
        {/* Left / Central Column: Contains Header Orb, Story, and Progress Bar (Balanced vertical & optical center) */}
        <div className="flex-1 w-full flex flex-col justify-center my-auto items-center h-full min-h-0 overflow-y-auto no-scrollbar xl:pl-8 2xl:pl-12 py-2">
          {/* Top Centered Cosmic Orb Hero */}
          {!isSpecialView && (
            <ReadingHeader hideCenterOrb={isSpecialView} />
          )}

          <div
            className={`flex flex-col w-full max-w-[620px] my-auto ${isSpecialView ? "items-center justify-center" : "items-start space-y-3 sm:space-y-4"}`}
          >
            {/* Article Header only shown when reading active */}
            {!isSpecialView && (
              <ReadingArticleHeader
                category={articleCategory}
                readTime={articleReadTime}
                title={articleTitle}
                subtitle={articleSubtitle}
              />
            )}

            {/* Central Reader / Completion / Loading Switcher */}
            <div
              className={`w-full min-h-0 flex flex-col ${isSpecialView ? "items-center justify-center overflow-visible" : "items-start justify-start text-left overflow-visible"}`}
            >
              {isGenerating ? (
                <ReadingPreparingView />
              ) : isCompleted ? (
                <ReadingCompleteView
                  articleId={currentArticle?.id}
                  articleTitle={currentArticle?.title}
                  articleContent={currentArticle?.content || (currentArticle?.pages || []).join(" ")}
                  keywords={currentArticle?.keywords}
                  cefrLevel={currentArticle?.cefrLevel}
                  readingTimeMin={currentArticle?.readTimeMin || 4}
                  cachedQuiz={currentArticle?.quiz}
                  onGetQuiz={getOrFetchQuiz}
                  onNextReading={() => generateNextArticle(articleCategory)}
                />
              ) : (
                <ReadingArticleReader
                  content={currentPageContent}
                  onLookupWord={instantWordLookup}
                />
              )}
            </div>

            {/* Fixed Bottom Bar (Always available, allowing user to navigate back into story from completion screen) */}
            <ReadingBottomBar
              progressPercentage={isCompleted ? 100 : progressPercentage}
              readTimeRemaining={isCompleted ? "Complete" : `${Math.max(1, totalPages - currentPageIndex)} min read`}
              onNextPage={isCompleted ? undefined : nextPage}
              onPrevPage={prevPage}
            />
          </div>
        </div>

        {/* Right Sidebar Stack: Starts directly at the top of the canvas with generous gap */}
        <div className="hidden xl:flex w-[290px] 2xl:w-[330px] flex-col space-y-3.5 2xl:space-y-4 shrink-0 overflow-y-auto no-scrollbar pt-1 pb-4">
          <ReadingAIMentorCard />
          <ReadingProgressCard
            progressPercentage={isCompleted ? 100 : progressPercentage}
            readWords={(currentPageIndex + 1) * 155}
            totalWords={totalPages * 155}
          />
          <ReadingFocusCard />
          <ReadingConfidenceCard />
        </div>
      </div>
    </div>
  );
};
