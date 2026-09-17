import React, { useState, useEffect, useCallback } from "react";
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
import { useReadingAudioNarrator } from "../hooks/useReadingAudioNarrator";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingsProfile } from "../../settings/hooks/useSettingsProfile";
import { WordLookup } from "../../../domain/repositories/IReadingRepository";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { AiInfrastructureRecoveryModal } from "../../lab/components/AiInfrastructureRecoveryModal";
import { ERROR_DATA, ErrorScenarioData } from "../../../shared/constants/errorScenarios";
import { classifyAiError } from "../../../shared/services/aiErrorClassifier";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { logger } from "../../../shared/utils/logger";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";

export interface ReadingPracticeViewProps {
  onBackToWorkspace?: (() => void) | undefined;
  roleName?: string | undefined;
}

export const ReadingPracticeView: React.FC<ReadingPracticeViewProps> = ({
  onBackToWorkspace,
  roleName,
}) => {
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false);
  const [recoveryScenario, setRecoveryScenario] = useState<ErrorScenarioData>(
    ERROR_DATA["keys-exhausted-pool"],
  );
  const [recoveryCooldown, setRecoveryCooldown] = useState<number>(0);
  const [recoveryAction, setRecoveryAction] = useState<
    | { type: "generate_article" }
    | { type: "word_lookup"; word: string; context?: string | undefined }
    | null
  >(null);

  const { profile, isLoading: isProfileLoading } = useSettingsProfile();
  const effectiveProfession = roleName || profile?.profession;
  const userLevel = React.useMemo(() => {
    if (!profile?.cefrLevel) return isProfileLoading ? undefined : "B1";
    return profile.cefrLevel.split(" ")[0].trim().toUpperCase();
  }, [profile?.cefrLevel, isProfileLoading]);

  const {
    currentArticle,
    currentPageIndex,
    totalPages,
    currentPageContent,
    allPages,
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
    translateWordDirect,
  } = useReadingArticles(userLevel, effectiveProfession);

  const {
    isPlaying: isPlayingAudio,
    isPaused: isPausedAudio,
    currentWordIndex: activeKaraokeWordIndex,
    playbackRate: audioPlaybackRate,
    selectedVoice,
    setSelectedVoice,
    togglePlay: toggleAudioPlay,
    restart: restartAudioPlay,
    cyclePlaybackRate: cycleAudioRate,
  } = useReadingAudioNarrator(currentPageContent, allPages, currentPageIndex);

  const handleToggleVoice = useCallback(() => {
    setSelectedVoice(
      selectedVoice === "en-US-AriaNeural" ? "en-US-ChristopherNeural" : "en-US-AriaNeural",
    );
  }, [selectedVoice, setSelectedVoice]);

  const articleCategory = currentArticle?.category || "BUSINESS";
  const articleReadTime = `${currentArticle?.readTimeMin || Math.max(1, Math.ceil(totalWords / 160))} MIN READ`;
  const articleTitle = currentArticle?.title || "Navigating Cross-Functional Communication in Tech";
  const articleSubtitle =
    currentArticle?.excerpt ||
    "Effective collaboration across product, design, and engineering teams requires clear terminology and active listening.";

  const isSpecialView = isGenerating || isCompleted || isLoading;

  // Keyboard navigation: ArrowLeft / ArrowRight for reading pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const handleNextReading = useCallback(async () => {
    try {
      const isCore = await providerKeyVault.isCentralCoreEnabled();
      const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
      const hasKey = await providerKeyVault.hasKey(activeProvider);

      if (!isCore && !hasKey) {
        setRecoveryAction({ type: "generate_article" });
        setRecoveryScenario(ERROR_DATA["keys-exhausted-pool"]);
        setRecoveryCooldown(0);
        setIsRecoveryModalOpen(true);
        return;
      }

      await generateNextArticle(articleCategory);
    } catch (err: any) {
      setRecoveryAction({ type: "generate_article" });
      const { scenario, cooldownSeconds } = classifyAiError(err);
      setRecoveryScenario(scenario);
      setRecoveryCooldown(cooldownSeconds);
      setIsRecoveryModalOpen(true);
    }
  }, [generateNextArticle, articleCategory]);

  const handleOpenWordRecoveryModal = useCallback((word: string, context?: string) => {
    setRecoveryAction({ type: "word_lookup", word, context });
    const baseScenario = ERROR_DATA["keys-exhausted-pool"];
    setRecoveryScenario({
      ...baseScenario,
      humanHeadline: "Clúster Central Inactivo",
      humanSubtext: `El clúster central de IA no está disponible para traducir "${word}". Agrega tu clave gratuita de Groq, Gemini u OpenRouter para traducir este vocablo y continuar con tu lectura normalmente.`,
    });
    setRecoveryCooldown(0);
    setIsRecoveryModalOpen(true);
  }, []);

  const handleResumeFromRecovery = useCallback(async () => {
    setIsRecoveryModalOpen(false);
    if (recoveryAction?.type === "word_lookup") {
      try {
        await translateWordDirect(recoveryAction.word, recoveryAction.context);
      } catch (err) {
        logger.warn("Failed direct translation after recovery resume:", err);
      }
      return;
    }
    void handleNextReading();
  }, [recoveryAction, translateWordDirect, handleNextReading]);

  const queryClient = useQueryClient();

  const handleAddToMemory = useCallback(
    async (wordData: WordLookup) => {
      try {
        await apiMemoryRepository.createCard({
          category: "READING",
          userSaid: wordData.exampleSentence || `Using '${wordData.word}' in professional context.`,
          betterWay: wordData.word,
          translationSpanish: wordData.spanishTranslation,
          errorWord: wordData.word,
          correctWord: wordData.word,
          grammarExplanation:
            wordData.definition ||
            `Vocabulary term: ${wordData.word} (${wordData.partOfSpeech || "vocabulary"})`,
          cefrLevel: wordData.cefrLevel || currentArticle?.cefrLevel || "B1",
          audioUrl: wordData.audioUrl,
        });
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memory.all });
      } catch (err) {
        logger.warn("Failed to persist word to memory bank", err);
        throw err;
      }
    },
    [currentArticle, queryClient],
  );

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

      {/* Main Workspace Layout Canvas (Aligned with Writing standard 1:1) */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-6 sm:px-10 lg:px-14 py-3 sm:py-5 pt-3 sm:pt-4 gap-6 sm:gap-8 z-10 overflow-hidden">
        {/* Left / Central Column: Strictly aligned to the left */}
        <main
          role="main"
          aria-label="Reading Arena"
          className="flex-1 w-full flex flex-col h-full min-h-0 overflow-hidden"
        >
          {/* Top Centered Cosmic Orb Hero */}
          {!isSpecialView && <ReadingHeader hideCenterOrb={isSpecialView} />}

          {/* Content wrapper: centered in the viewport under the Orb, with internal text flush left */}
          <div
            className={`flex flex-col w-full max-w-[680px] mx-auto flex-1 min-h-0 ${
              isSpecialView ? "items-center justify-center" : "items-start justify-between"
            }`}
          >
            {/* Article Header only shown when reading active */}
            {!isSpecialView && (
              <ReadingArticleHeader
                category={articleCategory}
                cefrLevel={currentArticle?.cefrLevel || userLevel}
                readTime={articleReadTime}
                title={articleTitle}
                subtitle={articleSubtitle}
                isPlayingAudio={isPlayingAudio}
                isPausedAudio={isPausedAudio}
                playbackRate={audioPlaybackRate}
                selectedVoice={selectedVoice}
                onSelectVoice={setSelectedVoice}
                onToggleVoice={handleToggleVoice}
                onToggleAudio={toggleAudioPlay}
                onRestartAudio={restartAudioPlay}
                onCycleAudioRate={cycleAudioRate}
              />
            )}

            {/* Central Reader / Completion / Loading Switcher */}
            <div
              className={`w-full flex-1 min-h-0 flex flex-col overflow-visible ${
                isSpecialView
                  ? "items-center justify-center"
                  : "items-start justify-start text-left"
              }`}
            >
              {isLoading ? (
                /* Initial cold-load article skeleton */
                <div className="w-full flex flex-col space-y-5 animate-pulse select-none py-4 text-left">
                  <div className="flex flex-col space-y-2 text-left">
                    <div className="h-3 w-28 rounded bg-white/[0.07]" />
                    <div className="h-7 w-80 rounded-lg bg-white/[0.08]" />
                    <div className="h-4 w-64 rounded bg-white/[0.04]" />
                  </div>
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
                  fullContent={fullContent}
                  articlePhrasalVerbs={currentArticle?.phrasalVerbs}
                  onLookupWord={instantWordLookup}
                  onAddToMemory={handleAddToMemory}
                  onOpenRecoveryModal={handleOpenWordRecoveryModal}
                  onDirectTranslate={translateWordDirect}
                  activeKaraokeWordIndex={activeKaraokeWordIndex}
                />
              )}
            </div>

            {/* Bottom Bar: Available during active reading & completed state to allow returning */}
            {!isGenerating && !isLoading && (
              <ReadingBottomBar
                progressPercentage={isCompleted ? 100 : progressPercentage}
                readTimeRemaining={
                  isCompleted ? "Completed" : `${estimatedMinutesRemaining} min read`
                }
                currentPage={isCompleted ? totalPages : currentPageIndex + 1}
                totalPages={totalPages}
                onNextPage={isCompleted ? undefined : nextPage}
                onPrevPage={prevPage}
              />
            )}
          </div>
        </main>

        {/* Right Sidebar Stack: 4 Cards (Matches Writing: w-80 xl:w-96 space-y-4 py-1) */}
        <aside
          role="complementary"
          aria-label="Reading telemetry and AI mentor"
          className="hidden xl:flex w-80 xl:w-96 flex-col space-y-4 shrink-0 h-full max-h-full overflow-y-auto no-scrollbar py-1"
        >
          <ReadingAIMentorCard />
          <ReadingProgressCard
            progressPercentage={isCompleted ? 100 : progressPercentage}
            estimatedMinutesLeft={isCompleted ? 0 : estimatedMinutesRemaining}
            readWords={isCompleted ? totalWords : readWords}
            totalWords={totalWords}
          />
          <ReadingFocusCard
            focusTarget={
              currentArticle?.keywords?.[0] || currentArticle?.category || "Professional Vocabulary"
            }
            focusDescription="I'll highlight and clarify key terminology and concepts as you read."
          />
          <ReadingConfidenceCard
            confidenceLevel={
              currentArticle?.cefrLevel === "C1" || currentArticle?.cefrLevel === "C2"
                ? "Mastery"
                : "High"
            }
            confidenceDescription="You're understanding complex ideas and key technical terms well."
          />
        </aside>
      </div>

      {/* High-Luxury AI Infrastructure Recovery Modal */}
      <AiInfrastructureRecoveryModal
        isOpen={isRecoveryModalOpen}
        scenario={recoveryScenario}
        cooldown={recoveryCooldown}
        contextType="reading"
        onClose={() => setIsRecoveryModalOpen(false)}
        onImmediateResume={handleResumeFromRecovery}
      />
    </div>
  );
};
