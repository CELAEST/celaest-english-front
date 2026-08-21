import React, { useState } from "react";
import { MemoryHeader } from "./MemoryHeader";
import { MemoryFilterTabs } from "./MemoryFilterTabs";
import { MemoryCardCarousel } from "./MemoryCardCarousel";
import { MemoryCardNav } from "./MemoryCardNav";
import { MemoryCardFront } from "./MemoryCardFront";
import { MemoryCardBack } from "./MemoryCardBack";
import { MemoryActionButtons } from "./MemoryActionButtons";
import { useMemoryCards } from "../hooks/useMemoryCards";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";

export interface MemoryViewProps {
  onBackToWorkspace?: () => void;
}

const CATEGORIES = ["SPEAKING", "READING", "WRITING"] as const;

export const MemoryView: React.FC<MemoryViewProps> = ({ onBackToWorkspace }) => {
  const [revealed, setRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [backRevealed, setBackRevealed] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const { cards, reviewCard } = useMemoryCards();

  const speakingCount = (cards || []).filter((c) => c.category?.toUpperCase() === "SPEAKING").length;
  const readingCount = (cards || []).filter((c) => c.category?.toUpperCase() === "READING").length;
  const writingCount = (cards || []).filter((c) => c.category?.toUpperCase() === "WRITING").length;

  const currentCategory = CATEGORIES[activeTab] || "SPEAKING";

  const filteredCards = (cards || []).filter((c) => {
    return c.category?.toUpperCase() === currentCategory;
  });

  const activeCard = (filteredCards && filteredCards.length > 0) ? (filteredCards[selectedIdx] || filteredCards[0]) : {
    id: `card-${currentCategory.toLowerCase()}`,
    category: currentCategory,
    userSaid: currentCategory === "SPEAKING" ? "I has been working here." : currentCategory === "READING" ? "Word: persevering" : "Draft: We must to launch today.",
    betterWay: currentCategory === "SPEAKING" ? "I have been working here." : currentCategory === "READING" ? "\"Persevering through challenges builds resilience.\"" : "We must launch today.",
    translationSpanish: currentCategory === "SPEAKING" ? "He estado trabajando aquí." : currentCategory === "READING" ? "perseverante" : "Debemos lanzar hoy.",
    errorWord: currentCategory === "SPEAKING" ? "has" : currentCategory === "READING" ? "persevering" : "to launch",
    correctWord: currentCategory === "SPEAKING" ? "have" : currentCategory === "READING" ? "persevering" : "launch",
    grammarExplanation: currentCategory === "SPEAKING" ? "Use 'have' with first-person pronoun 'I'." : currentCategory === "READING" ? "Adjective / Participle: Continuing in a course of action." : "Modal verb 'must' takes bare infinitive without 'to'.",
    cefrLevel: "B1",
  };

  const totalCards = filteredCards && filteredCards.length > 0 ? filteredCards.length : 1;

  const handleNextCard = () => {
    setBackRevealed(false);
    setSelectedIdx((prev) => (prev + 1) % totalCards);
  };

  const handlePrevCard = () => {
    setBackRevealed(false);
    setSelectedIdx((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#000001] text-white flex flex-col justify-between select-none overflow-hidden p-4 sm:p-6 lg:px-10 pt-4 sm:pt-6 pb-[6px]">
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

        {!revealed ? (
          <div key="carousel" className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden animate-[fadeIn_0.4s_ease-out_both]">
            {/* Filter Tabs ONLY (Unrevealed Mode) */}
            <MemoryFilterTabs
              activeTab={activeTab}
              speakingCount={speakingCount}
              readingCount={readingCount}
              writingCount={writingCount}
              onTabChange={(idx) => {
                setActiveTab(idx);
                setSelectedIdx(0);
              }}
            />

            {/* Carousel Section (Lowered slightly with flexible height) */}
            <div className="flex-1 min-h-0 flex items-center justify-center my-2 sm:my-3">
              <MemoryCardCarousel
                cards={filteredCards}
                onReveal={(idx) => {
                  setSelectedIdx(idx);
                  setRevealed(true);
                  setBackRevealed(false);
                }}
              />
            </div>
          </div>
        ) : (
          <DetailView
            activeCard={activeCard}
            currentIndex={selectedIdx + 1}
            totalCards={totalCards}
            backRevealed={backRevealed}
            onToggleBack={() => setBackRevealed((v) => !v)}
            onExit={() => setRevealed(false)}
            onNext={handleNextCard}
            onPrev={handlePrevCard}
            onReviewScore={(score) => {
              reviewCard(activeCard.id, score);
              handleNextCard();
            }}
          />
        )}
      </main>
    </div>
  );
};

function DetailView({
  activeCard,
  currentIndex,
  totalCards,
  backRevealed,
  onToggleBack,
  onExit,
  onNext,
  onPrev,
  onReviewScore,
}: {
  activeCard: any;
  currentIndex: number;
  totalCards: number;
  backRevealed: boolean;
  onToggleBack: () => void;
  onExit: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReviewScore: (score: number) => void;
}) {
  return (
    <div key="detail" className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden animate-[fadeIn_0.4s_ease-out_both]">
      {/* Card Navigation Controls (Card counter, dashes, arrows) */}
      <div className="flex items-center justify-between">
        <MemoryCardNav
          currentCard={currentIndex}
          totalCards={totalCards}
          onPrev={onPrev}
          onNext={onNext}
        />
        <button
          onClick={onExit}
          className="text-xs text-[#8a8a9e] hover:text-white transition-colors cursor-pointer px-3 py-1 rounded-full border border-white/10 hover:bg-white/10"
        >
          ✕ Exit Card
        </button>
      </div>

      {/* Cards — Front, Center Reveal, Back */}
      <div className="relative my-2 sm:my-3 flex-1 min-h-0 grid items-center gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-[1fr_auto_1fr] overflow-hidden">
        <MemoryCardFront
          category={activeCard.category}
          userSentence={activeCard.userSaid}
          errorWord={activeCard.errorWord}
          correctSentence={activeCard.betterWay}
          correctWord={activeCard.correctWord}
          onBookmark={() => apiMemoryRepository.toggleBookmark(activeCard.id)}
        />

        {/* Center reveal control */}
        <div className="flex items-center justify-center py-2 lg:flex-col lg:gap-2 lg:py-0 shrink-0">
          <button
            onClick={onToggleBack}
            aria-pressed={backRevealed}
            aria-label={backRevealed ? "Hide answer" : "Tap to reveal answer"}
            className="group flex flex-col items-center gap-2 outline-none cursor-pointer"
          >
            <span
              className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border bg-background/80 text-[#A27FF3] backdrop-blur transition-all duration-500 group-hover:scale-105 ${
                backRevealed
                  ? "border-[#A27FF3]/60 shadow-[0_0_30px_-6px_rgba(171,134,230,0.7)]"
                  : "border-[#A27FF3]/40 shadow-[0_0_24px_-8px_rgba(171,134,230,0.5)]"
              }`}
            >
              <svg
                className={`h-5 w-5 transition-transform duration-500 ${
                  backRevealed ? "translate-x-0.5" : ""
                }`}
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
            </span>
            <span className="w-24 text-center text-xs leading-snug text-[#999a9b] transition-colors group-hover:text-white/80">
              {backRevealed ? "Hide answer" : "Tap to reveal answer"}
            </span>
          </button>
        </div>

        <MemoryCardBack
          revealed={backRevealed}
          translation={activeCard.translationSpanish || "Traducción en español."}
          grammarExplanation={activeCard.grammarExplanation}
          mentorTip={activeCard.grammarExplanation || "Sigue practicando la regla gramatical."}
        />
      </div>

      {/* Review actions */}
      <div className="shrink-0 pt-1 pb-1">
        <MemoryActionButtons
          onStillNotClear={() => onReviewScore(1)}
          onAlmost={() => onReviewScore(3)}
          onGotIt={() => onReviewScore(5)}
        />
      </div>
    </div>
  );
}
