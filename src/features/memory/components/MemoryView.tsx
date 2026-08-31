import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MemoryHeader } from "./MemoryHeader";
import { MemoryFilterTabs } from "./MemoryFilterTabs";
import { MemoryCardCarousel } from "./MemoryCardCarousel";
import { MemoryEmptyState } from "./MemoryEmptyState";
import { MemoryCompletionView } from "./MemoryCompletionView";
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

  // Stable callbacks so memoized children (carousel, flashcard, filter tabs)
  // don't re-render on unrelated parent state changes (e.g. flip, hover).
  const onFlip = useCallback(() => setIsFlipped((prev) => !prev), []);
  const onBookmark = useCallback(
    (cardId: string) => apiMemoryRepository.toggleBookmark(cardId),
    [],
  );
  const handleTabSwitch = useCallback((idx: number) => {
    setActiveTab(idx);
    setSelectedIdx(0);
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
    setIsFlipped(false);
    setSelectedIdx((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const handlePrevCard = useCallback(() => {
    if (totalCards === 0) return;
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

      {/* Root Background Glowing Memory Sphere */}
      <div className="pointer-events-none absolute right-8 sm:right-28 lg:right-[260px] -top-1 sm:top-1 w-[155px] sm:w-[190px] lg:w-[230px] h-[155px] sm:h-[190px] lg:h-[230px] z-0 opacity-90">
        <img
          src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png"
          alt="Glowing memory sphere background"
          className="h-full w-full object-contain scale-110"
        />
      </div>

      <main className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-between overflow-hidden z-10 min-h-0">
        {/* Header */}
        <MemoryHeader onBack={onBackToWorkspace} />

        {/*  State 1: Session Completed Screen  */}
        {isSessionCompleted ? (
          <div className="flex-1 min-h-0 flex items-center justify-center">
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
          </div>
        ) : totalCards === 0 && !isLoading ? (
          /*  State 2: Empty State (0 Cards in active category)  */
          <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden animate-[fadeIn_0.35s_ease-out_both]">
            <MemoryFilterTabs
              activeTab={activeTab}
              speakingCount={speakingCount}
              readingCount={readingCount}
              writingCount={writingCount}
              onTabChange={handleTabSwitch}
            />
            <MemoryEmptyState
              category={currentCategory}
              hasOtherCards={hasAnyCardsInOtherTabs}
              onSwitchCategory={handleSwitchToAvailableCategory}
              onStartPractice={onBackToWorkspace}
            />
          </div>
        ) : (
          /*  State 3: Master Grand Carousel Deck with 3D Flip & Peek Cards  */
          <div
            key={`deck-${activeTab}`}
            className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden animate-[fadeIn_0.35s_ease-out_both]"
          >
            {/* Category Filter Tabs */}
            <MemoryFilterTabs
              activeTab={activeTab}
              speakingCount={speakingCount}
              readingCount={readingCount}
              writingCount={writingCount}
              onTabChange={handleTabSwitch}
            />

            {/* Center Carousel Row with Grand Active 3D Flip Card & Side Peek Cards */}
            <div className="flex-1 min-h-0 flex items-center justify-center my-auto py-2">
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
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
