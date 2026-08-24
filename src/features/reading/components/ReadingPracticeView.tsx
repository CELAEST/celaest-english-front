import React, { useEffect, useCallback } from "react";
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
import { ReturnArrowIcon } from "./ReadingBespokeIcons";
import { useReadingArticles } from "../hooks/useReadingArticles";
import { WordLookup } from "../../../domain/repositories/IReadingRepository";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";

export interface ReadingPracticeViewProps {
  onBackToWorkspace?: (() => void) | undefined;
}

export const ReadingPracticeView: React.FC<ReadingPracticeViewProps> = ({
  onBackToWorkspace,
}) => {
  const {
    currentArticle,
    currentPageIndex,
    totalPages,
    currentPageContent,
    fullContent,
    totalWords,
    readWords,
    estimatedMinutesRemaining,
    actualReadingTimeMin,
    progressPercentage,
    isCompleted,
    isGenerating,
    isLoading,
    nextPage,
    prevPage,
    generateNextArticle,
    getOrFetchQuiz,
    instantWordLookup,
  } = useReadingArticles();

  const articleCategory = currentArticle?.category || "BUSINESS";
  const articleReadTime = `${currentArticle?.readTimeMin || Math.max(1, Math.ceil(totalWords / 160))} MIN READ`;
  const articleTitle =
    currentArticle?.title ||
    "Navigating Cross-Functional Communication in Tech";
  const articleSubtitle =
    currentArticle?.excerpt ||
    "Effective collaboration across product, design, and engineering teams requires clear terminology and active listening.";

  const isSpecialView = isGenerating || isCompleted || isLoading;

  // Keyboard navigation: ArrowLeft / ArrowRight for reading pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight" && !isCompleted && !isGenerating && !isLoading) {
        nextPage();
      } else if (e.key === "ArrowLeft" && !isGenerating && !isLoading) {
        prevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage, isCompleted, isGenerating, isLoading]);

  const handleNextReading = useCallback(() => {
    generateNextArticle(articleCategory);
  }, [generateNextArticle, articleCategory]);

  const handleAddToMemory = useCallback(async (wordData: WordLookup) => {
    try {
      await apiMemoryRepository.createCard({
        category: "READING",
        userSaid: wordData.exampleSentence || `Using '${wordData.word}' in professional context.`,
        betterWay: wordData.word,
        translationSpanish: wordData.spanishTranslation,
        errorWord: wordData.word,
        correctWord: wordData.word,
        grammarExplanation: wordData.definition || `Vocabulary term: ${wordData.word} (${wordData.partOfSpeech || 'vocabulary'})`,
        cefrLevel: wordData.cefrLevel || currentArticle?.cefrLevel || "B1",
        audioUrl: wordData.audioUrl,
      });
    } catch (err) {
      console.warn("Failed to persist word to memory bank", err);
    }
  }, [currentArticle?.cefrLevel]);

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#000001] text-white flex flex-col select-none z-10 animate-[fadeIn_0.5s_ease-out_both] overflow-hidden">
      {/* Top Left Return to Workspace Action */}
      {onBackToWorkspace && (
        <button
          type="button"
          onClick={onBackToWorkspace}
          aria-label="Back to workspace"
          className="absolute top-3 left-4 sm:top-4 sm:left-6 z-30 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-[#9b9cb4] hover:text-white transition-all text-xs font-light cursor-pointer group"
        >
          <ReturnArrowIcon className="w-3.5 h-3.5 text-[#9b9cb4] group-hover:text-white" />
          <span>Workspace</span>
        </button>
      )}

      {/* Main Workspace Layout Canvas */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch px-4 sm:px-6 lg:px-10 xl:px-12 py-2 sm:py-3 gap-6 xl:gap-8 2xl:gap-12 z-10 overflow-hidden min-h-0">
        {/* Left / Central Column: Main Landmark */}
        <main
          role="main"
          aria-label="Reading Arena"
          className="flex-1 w-full flex flex-col h-full min-h-0 overflow-hidden xl:pl-4 2xl:pl-8"
        >
          {/* Top Centered Cosmic Orb Hero */}
          {!isSpecialView && (
            <ReadingHeader hideCenterOrb={isSpecialView} />
          )}

          {/* Content wrapper: fills vertical space */}
          <div
            className={`flex flex-col w-full max-w-[620px] mx-auto flex-1 min-h-0 ${
              isSpecialView
                ? "items-center justify-center"
                : "items-start justify-between"
            }`}
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
              className={`w-full flex-1 min-h-0 flex flex-col overflow-hidden ${
                isSpecialView
                  ? "items-center justify-center"
                  : "items-start justify-start"
              }`}
            >
              {isLoading ? (
                /* Initial cold-load article skeleton */
                <div className="w-full max-w-[620px] flex flex-col space-y-5 animate-pulse select-none py-4">
                  {/* Article Header Skeleton */}
                  <div className="flex flex-col space-y-2">
                    <div className="h-3 w-28 rounded bg-white/[0.07]" />
                    <div className="h-7 w-80 rounded-lg bg-white/[0.08]" />
                    <div className="h-4 w-64 rounded bg-white/[0.04]" />
                  </div>

                  {/* Text Body Skeleton Lines */}
                  <div className="flex flex-col space-y-2.5 pt-3">
                    {[1, 0.85, 0.95, 0.7, 0.9, 0.6, 0.8, 0.75].map((w, i) => (
                      <div
                        key={i}
                        className="h-4 rounded"
                        style={{
                          width: `${w * 100}%`,
                          backgroundColor: `rgba(255,255,255,${0.06 - i * 0.005})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : isGenerating ? (
                <ReadingPreparingView />
              ) : isCompleted ? (
                <ReadingCompleteView
                  articleId={currentArticle?.id}
                  articleTitle={currentArticle?.title}
                  articleContent={fullContent}
                  keywords={currentArticle?.keywords}
                  cefrLevel={currentArticle?.cefrLevel || "B1"}
                  readingTimeMin={actualReadingTimeMin}
                  cachedQuiz={currentArticle?.quiz}
                  onGetQuiz={getOrFetchQuiz}
                  onNextReading={handleNextReading}
                  onReviewReading={prevPage}
                />
              ) : (
                <ReadingArticleReader
                  content={currentPageContent}
                  onLookupWord={instantWordLookup}
                  onAddToMemory={handleAddToMemory}
                />
              )}
            </div>

            {/* Bottom Bar: Available during active reading & completed state to allow returning */}
            {!isGenerating && !isLoading && (
              <ReadingBottomBar
                progressPercentage={isCompleted ? 100 : progressPercentage}
                readTimeRemaining={
                  isCompleted
                    ? "Completed"
                    : `${estimatedMinutesRemaining} min read`
                }
                currentPage={isCompleted ? totalPages : currentPageIndex + 1}
                totalPages={totalPages}
                onNextPage={isCompleted ? undefined : nextPage}
                onPrevPage={prevPage}
              />
            )}
          </div>
        </main>

        {/* Right Sidebar Stack: Semantic Aside with Real Telemetry */}
        <aside
          role="complementary"
          aria-label="Reading telemetry and AI mentor"
          className="hidden xl:flex w-[270px] 2xl:w-[310px] flex-col space-y-3.5 2xl:space-y-4 shrink-0 overflow-y-auto no-scrollbar pt-1 pb-4 min-h-0 justify-start"
        >
          <ReadingAIMentorCard />
          <ReadingProgressCard
            progressPercentage={isCompleted ? 100 : progressPercentage}
            estimatedMinutesLeft={isCompleted ? 0 : estimatedMinutesRemaining}
            readWords={isCompleted ? totalWords : readWords}
            totalWords={totalWords}
          />
          <ReadingFocusCard
            focusTarget={currentArticle?.keywords?.[0] || currentArticle?.category || "Professional Vocabulary"}
            focusDescription="I'll highlight and clarify key terminology and concepts as you read."
          />
          <ReadingConfidenceCard
            confidenceLevel={currentArticle?.cefrLevel === "C1" || currentArticle?.cefrLevel === "C2" ? "Mastery" : "High"}
            confidenceDescription="You're understanding complex ideas and key technical terms well."
          />
        </aside>
      </div>
    </div>
  );
};
