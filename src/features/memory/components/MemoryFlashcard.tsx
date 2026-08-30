import React, { useState } from "react";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import {
  MemorySpeakingFront,
  MemorySpeakingBack,
  MemoryWritingFront,
  MemoryWritingBack,
  MemoryReadingFront,
  MemoryReadingBack,
} from "./subcomponents";

export interface MemoryFlashcardProps {
  card: MemoryCard;
  cardIndex: number;
  totalCards: number;
  isFlipped: boolean;
  onFlip: () => void;
  onBookmark?: ((cardId: string) => void) | undefined;
  onDelete?: ((cardId: string) => void) | undefined;
}

export const MemoryFlashcard: React.FC<MemoryFlashcardProps> = React.memo(
  ({ card, cardIndex, totalCards, isFlipped, onFlip, onBookmark, onDelete }) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(card.bookmarked ?? false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked((prev: boolean) => !prev);
    if (onBookmark) onBookmark(card.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(card.id);
    }
  };

  const handlePlayVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToSpeak = card.betterWay || card.correctWord || card.userSaid;
    if (!textToSpeak) return;

    setIsPlayingAudio(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 1000);
    }
  };

  const rawCategory = (card.category || "").toUpperCase().trim();
  const normalizedCategory: "SPEAKING" | "WRITING" | "READING" =
    rawCategory === "WRITING"
      ? "WRITING"
      : rawCategory === "READING"
        ? "READING"
        : "SPEAKING";

  return (
    <div
      onClick={onFlip}
      className="relative w-full max-w-[640px] lg:max-w-[690px] h-[370px] sm:h-[410px] lg:h-[440px] max-h-[calc(100dvh-230px)] cursor-pointer select-none [perspective:1400px] group mx-auto"
    >
      <div
        className={`relative w-full h-full duration-600 [transform-style:preserve-3d] transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            FRONT FACE: Polymorphic category face
           ═══════════════════════════════════════════════════════════════════ */}
        <article className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[28px] sm:rounded-[32px] bg-[#070714]/90 border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_40px_rgba(112,72,232,0.1)] p-5 sm:p-7 lg:p-8 flex flex-col justify-between overflow-hidden group-hover:border-[#A27FF3]/40 transition-colors">
          <div className="pointer-events-none absolute -top-24 -left-24 w-56 h-56 bg-[#7048E8] opacity-15 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-56 h-56 bg-[#55c9a4] opacity-10 blur-[60px]" />

          {/* Top Bar: Pure Clean Text + Counter + Actions */}
          <div className="flex items-center justify-between z-10 shrink-0">
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[#C4B5FD] uppercase">
              {normalizedCategory}
            </span>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-medium text-[#8E90A6]">
                {cardIndex} <span className="text-white/20">/</span> {totalCards}
              </span>

              <button
                type="button"
                onClick={handleBookmarkToggle}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark card"}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  isBookmarked
                    ? "text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30"
                    : "text-[#8E90A6] hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  aria-label="Delete card"
                  title="Eliminar tarjeta"
                  className="p-1.5 rounded-xl text-[#8E90A6] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Front Face per Category */}
          {normalizedCategory === "SPEAKING" && (
            <MemorySpeakingFront
              card={card}
              isPlayingAudio={isPlayingAudio}
              onPlayVoice={handlePlayVoice}
            />
          )}
          {normalizedCategory === "WRITING" && (
            <MemoryWritingFront
              card={card}
              isPlayingAudio={isPlayingAudio}
              onPlayVoice={handlePlayVoice}
            />
          )}
          {normalizedCategory === "READING" && (
            <MemoryReadingFront
              card={card}
              isPlayingAudio={isPlayingAudio}
              onPlayVoice={handlePlayVoice}
            />
          )}

          {/* Bottom Flip Action Prompt */}
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#8E90A6] group-hover:text-[#C4B5FD] transition-colors z-10 shrink-0 pt-2 border-t border-white/[0.04]">
            <svg
              className="w-3.5 h-3.5 text-[#A27FF3] animate-spin [animation-duration:8s]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            <span>Tap card or press <kbd className="px-1.5 py-0.5 text-[9.5px] bg-white/[0.08] rounded font-mono text-white">Space</kbd> for translation & explanation</span>
          </div>
        </article>

        {/* ═══════════════════════════════════════════════════════════════════
            BACK FACE: Polymorphic category details
           ═══════════════════════════════════════════════════════════════════ */}
        <article className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[28px] sm:rounded-[32px] bg-[#070818]/95 border border-[#7048E8]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_40px_rgba(112,72,232,0.15)] p-5 sm:p-7 lg:p-8 flex flex-col justify-between overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 bg-[#7048E8] opacity-20 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-56 h-56 bg-[#55c9a4] opacity-10 blur-[60px]" />

          {/* Top Bar: Pure Clean Text + Audio Speaker + Actions */}
          <div className="flex items-center justify-between z-10 shrink-0">
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[#C4B5FD] uppercase">
              DETAILS · {normalizedCategory}
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePlayVoice}
                aria-label="Listen to pronunciation"
                className={`p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#C4B5FD] hover:text-white hover:bg-[#7048E8]/40 hover:border-[#A27FF3] active:scale-95 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? "bg-[#7048E8] text-white border-[#A27FF3] shadow-[0_0_16px_rgba(162,127,243,0.6)]"
                    : ""
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleBookmarkToggle}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark card"}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  isBookmarked
                    ? "text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30"
                    : "text-[#8E90A6] hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  aria-label="Delete card"
                  title="Eliminar tarjeta"
                  className="p-1.5 rounded-xl text-[#8E90A6] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Back Face per Category */}
          {normalizedCategory === "SPEAKING" && (
            <MemorySpeakingBack card={card} />
          )}
          {normalizedCategory === "WRITING" && (
            <MemoryWritingBack card={card} />
          )}
          {normalizedCategory === "READING" && (
            <MemoryReadingBack card={card} />
          )}

          {/* Bottom Flip Back Action Prompt */}
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#8E90A6] z-10 shrink-0 pt-2 border-t border-white/[0.04]">
            <span>Tap card or press <kbd className="px-1.5 py-0.5 text-[9.5px] bg-white/[0.08] rounded font-mono text-white">Space</kbd> to return to comparison</span>
          </div>
        </article>
      </div>
    </div>
  );
});
