import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemoryHeader } from "./MemoryHeader";
import { MemoryFilterTabs } from "./MemoryFilterTabs";
import { MemoryCardCarousel } from "./MemoryCardCarousel";
import { MemoryEmptyState } from "./MemoryEmptyState";
import { MemoryCompletionView } from "./MemoryCompletionView";
import { VideoOrb } from "../../../design-system/components/Orb/VideoOrb";
import { useMemoryCards } from "../hooks/useMemoryCards";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import { logger } from "../../../shared/utils/logger";

export interface MemoryViewProps {
  onBackToWorkspace?: (() => void) | undefined;
}

const CATEGORIES = ["SPEAKING", "READING", "WRITING"] as const;

export const MemoryView: React.FC<MemoryViewProps> = ({ onBackToWorkspace }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedSessionCount, setReviewedSessionCount] = useState(0);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  const { cards = [], isLoading, reviewCard, deleteCard } = useMemoryCards();

  const currentCategory = CATEGORIES[activeTab] || "SPEAKING";

  const normalizeCategory = (cat?: string): string => {
    const upper = (cat || "").toUpperCase().trim();
    if (upper === "SPEAKING" || upper === "INTERVIEW" || upper === "CONVERSATION")
      return "SPEAKING";
    if (upper === "READING") return "READING";
    if (upper === "WRITING") return "WRITING";
    return upper || "SPEAKING";
  };

  const cardList = Array.isArray(cards) ? cards : [];

  // Filter real cards by category (memoized: only recomputed when the card list
  // or the active category changes, not on every keystroke/flip).
  const filteredCards = useMemo(
    () => cardList.filter((c) => normalizeCategory(c?.category) === currentCategory),
    [cardList, currentCategory],
  );

  const { speakingCount, readingCount, writingCount } = useMemo(() => {
    let speaking = 0;
    let reading = 0;
    let writing = 0;
    for (const c of cardList) {
      const n = normalizeCategory(c?.category);
      if (n === "SPEAKING") speaking++;
      else if (n === "READING") reading++;
      else if (n === "WRITING") writing++;
    }
    return { speakingCount: speaking, readingCount: reading, writingCount: writing };
  }, [cardList]);

  const totalCards = filteredCards.length;
  const activeCard: MemoryCard | undefined = filteredCards[selectedIdx];

  const hasAnyCardsInOtherTabs = useMemo(
    () =>
      (activeTab !== 0 && speakingCount > 0) ||
      (activeTab !== 1 && readingCount > 0) ||
      (activeTab !== 2 && writingCount > 0),
    [activeTab, speakingCount, readingCount, writingCount],
  );

  const hasAutoSelectedTabRef = useRef(false);

  // Intelligent auto-tab selection: If the current tab has 0 cards but another category has cards on initial load,
  // automatically transition to the category where the user actually has curated cards.
  useEffect(() => {
    if (isLoading || cardList.length === 0 || hasAutoSelectedTabRef.current) return;

    const currentCount =
      activeTab === 0 ? speakingCount : activeTab === 1 ? readingCount : writingCount;

    if (currentCount === 0) {
      if (readingCount > 0) {
        setActiveTab(1);
      } else if (writingCount > 0) {
        setActiveTab(2);
      } else if (speakingCount > 0) {
        setActiveTab(0);
      }
      hasAutoSelectedTabRef.current = true;
    }
  }, [isLoading, cardList.length, activeTab, speakingCount, readingCount, writingCount]);

  // Stable callbacks so memoized children (carousel, flashcard, filter tabs)
  // don't re-render on unrelated parent state changes (e.g. flip, hover).
  const onFlip = useCallback(() => setIsFlipped((prev) => !prev), []);
  const onBookmark = useCallback(
    (cardId: string) => apiMemoryRepository.toggleBookmark(cardId),
    [],
  );
  const handleTabSwitch = useCallback((idx: number) => {
    hasAutoSelectedTabRef.current = true;
    setActiveTab(idx);
    setSelectedIdx(0);
    setSlideDirection(1);
    setIsFlipped(false);
    setIsSessionCompleted(false);
  }, []);

  const handleSwitchToAvailableCategory = useCallback(() => {
    if (readingCount > 0) handleTabSwitch(1);
    else if (writingCount > 0) handleTabSwitch(2);
    else if (speakingCount > 0) handleTabSwitch(0);
  }, [readingCount, writingCount, speakingCount, handleTabSwitch]);

  const handleNextCard = useCallback(() => {
    if (totalCards === 0) return;
    setSlideDirection(1);
    setIsFlipped(false);
    setSelectedIdx((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const handlePrevCard = useCallback(() => {
    if (totalCards === 0) return;
    setSlideDirection(-1);
    setIsFlipped(false);
    setSelectedIdx((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  const handleReviewScore = useCallback(
    async (score: number) => {
      if (!activeCard) return;

      try {
        await reviewCard(activeCard.id, score);
      } catch (err) {
        logger.warn("Failed to update SRS review score:", err);
      }

      setReviewedSessionCount((prev) => prev + 1);

      // If this was the last card in the deck or user reviewed all cards in this category
      if (selectedIdx >= totalCards - 1 || totalCards <= 1) {
        setIsSessionCompleted(true);
      } else {
        handleNextCard();
      }
    },
    [activeCard, reviewCard, selectedIdx, totalCards, handleNextCard],
  );

  // Global Keyboard Shortcuts (Space to flip, 1, 2, 3 to rate, Left/Right to navigate, Esc to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "Escape" && onBackToWorkspace) {
        onBackToWorkspace();
      } else if (!isSessionCompleted && totalCards > 0) {
        if (e.key === " " || e.code === "Space") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        } else if (e.key === "1") {
          e.preventDefault();
          handleReviewScore(1);
        } else if (e.key === "2") {
          e.preventDefault();
          handleReviewScore(3);
        } else if (e.key === "3") {
          e.preventDefault();
          handleReviewScore(5);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          handleNextCard();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrevCard();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isSessionCompleted,
    totalCards,
    handleReviewScore,
    handleNextCard,
    handlePrevCard,
    onBackToWorkspace,
  ]);

  const handleDeleteCard = useCallback(
    async (cardId: string) => {
      try {
        await deleteCard(cardId);
        if (selectedIdx >= totalCards - 1 && selectedIdx > 0) {
          setSelectedIdx((prev) => prev - 1);
        }
      } catch (err) {
        logger.error("Failed to delete card", err);
      }
    },
    [deleteCard, selectedIdx, totalCards],
  );

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#000001] text-white flex flex-col justify-between select-none overflow-hidden p-3 sm:p-5 lg:px-8 pt-3 sm:pt-4 pb-3 sm:pb-5">
      {/* ── Subtle Permanent Ambient Background Illuminations ── */}
      {/* Violet core glow — center-left, anchors the card area */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[35%] left-[30%] w-[500px] h-[400px] z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(112, 72, 232, 0.12), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Emerald accent — bottom-right, subtle warmth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[10%] right-[15%] w-[420px] h-[350px] z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(52, 211, 153, 0.07), transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      {/* Indigo whisper — top-right, secondary depth layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[5%] right-[25%] w-[380px] h-[300px] z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(162, 127, 243, 0.09), transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      {/* Warm crimson hint — bottom-left, very faint for tonal richness */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[20%] left-[10%] w-[300px] h-[250px] z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(248, 113, 113, 0.05), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Root Background Glowing Memory Sphere — Visible alongside video backdrop */}
      {!isSessionCompleted && (
        <div className="pointer-events-none absolute right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 top-1 sm:top-2 w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] z-0 opacity-90 overflow-hidden hidden sm:block">
          <VideoOrb className="h-full w-full object-contain scale-110 pointer-events-none mix-blend-screen" />
        </div>
      )}

      <motion.main
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-between overflow-hidden z-10 min-h-0"
      >
        {/* Header — cuando vacío, muestra “Your Personalized Memory Deck” arriba y deja solo botón abajo */}
        {totalCards === 0 && !isLoading && !isSessionCompleted ? (
          <MemoryHeader
            title="Your Personalized Memory Deck"
            subtitle='Click "Add to Memory" during practice to curate your deck.'
            onBack={onBackToWorkspace}
          />
        ) : (
          <MemoryHeader onBack={onBackToWorkspace} />
        )}

        {/* Category Filter Tabs — Persistent in DOM, never unmounts, kinetic laser line glides seamlessly */}
        <div className="relative z-20 shrink-0 pt-1">
          <MemoryFilterTabs
            activeTab={activeTab}
            speakingCount={speakingCount}
            readingCount={readingCount}
            writingCount={writingCount}
            onTabChange={handleTabSwitch}
          />
        </div>

        {/* Content Deck Area with AnimatePresence & luxury entrance animation */}
        <div className="relative flex-1 min-h-0 flex flex-col w-full overflow-hidden">
          <AnimatePresence mode="wait">
            {isSessionCompleted ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 min-h-0 flex items-center justify-center"
              >
                <MemoryCompletionView
                  reviewedCount={reviewedSessionCount || totalCards}
                  category={currentCategory}
                  onRestart={() => {
                    setIsSessionCompleted(false);
                    setSelectedIdx(0);
                    setIsFlipped(false);
                  }}
                  onReturnToOverview={() => {
                    setIsSessionCompleted(false);
                    setSelectedIdx(0);
                    setIsFlipped(false);
                    if (hasAnyCardsInOtherTabs) {
                      handleSwitchToAvailableCategory();
                    }
                  }}
                />
              </motion.div>
            ) : totalCards === 0 && !isLoading ? (
              <motion.div
                key={`empty-${activeTab}`}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex-1 min-h-0 flex flex-col w-full"
              >
                <MemoryEmptyState
                  category={currentCategory}
                  hasOtherCards={hasAnyCardsInOtherTabs}
                  onSwitchCategory={handleSwitchToAvailableCategory}
                  onStartPractice={onBackToWorkspace}
                  hideHeader={true}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`deck-${activeTab}`}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 min-h-0 flex items-center justify-center my-auto py-2"
              >
                <MemoryCardCarousel
                  cards={filteredCards}
                  activeIndex={selectedIdx}
                  isFlipped={isFlipped}
                  onFlip={onFlip}
                  onPrev={handlePrevCard}
                  onNext={handleNextCard}
                  onBookmark={onBookmark}
                  onDelete={handleDeleteCard}
                  onReviewScore={handleReviewScore}
                  direction={slideDirection}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};
