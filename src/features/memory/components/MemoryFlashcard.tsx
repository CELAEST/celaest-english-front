import React, { useState, useCallback, useRef } from "react";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import {
  MemorySpeakingFront,
  MemorySpeakingBack,
  MemoryWritingFront,
  MemoryWritingBack,
  MemoryReadingFront,
  MemoryReadingBack,
} from "./subcomponents";
import { Bookmark, Trash2, RotateCw, Volume2 } from "lucide-react";

export interface MemoryFlashcardProps {
  card: MemoryCard;
  cardIndex: number;
  totalCards: number;
  isFlipped: boolean;
  onFlip: () => void;
  onBookmark?: ((cardId: string) => void) | undefined;
  onDelete?: ((cardId: string) => void) | undefined;
  onReviewScore?: ((score: number) => void) | undefined;
}

export const MemoryFlashcard: React.FC<MemoryFlashcardProps> = React.memo(
  ({
    card,
    cardIndex,
    totalCards,
    isFlipped,
    onFlip,
    onBookmark,
    onDelete,
    onReviewScore,
  }) => {
    const [isBookmarked, setIsBookmarked] = useState<boolean>(card.bookmarked ?? false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [selectedScore, setSelectedScore] = useState<number | null>(null);

    // 3D Mathematical Tilt & Specular Glare Physics via CSS variables (Zero React Re-renders)
    const cardRef = useRef<HTMLDivElement>(null);
    const rafIdRef = useRef<number | null>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = ((x - centerX) / centerX) * 4.5;
        const tiltY = ((y - centerY) / centerY) * -4.5;
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;

        el.style.setProperty("--tilt-x", `${tiltX}`);
        el.style.setProperty("--tilt-y", `${tiltY}`);
        el.style.setProperty("--glare-x", `${glareX}%`);
        el.style.setProperty("--glare-y", `${glareY}%`);
        el.style.setProperty("--glare-op", "0.14");
      });
    }, []);

    const handleMouseLeave = useCallback(() => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      const el = cardRef.current;
      if (!el) return;
      el.style.setProperty("--tilt-x", "0");
      el.style.setProperty("--tilt-y", "0");
      el.style.setProperty("--glare-x", "50%");
      el.style.setProperty("--glare-y", "50%");
      el.style.setProperty("--glare-op", "0");
    }, []);

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

    const handleScoreClick = (e: React.MouseEvent, score: number) => {
      e.stopPropagation();
      setSelectedScore(score);
      if (onReviewScore) {
        onReviewScore(score);
      }
    };

    const rawCategory = (card.category || "").toUpperCase().trim();
    const normalizedCategory: "SPEAKING" | "WRITING" | "READING" =
      rawCategory === "WRITING"
        ? "WRITING"
        : rawCategory === "READING"
        ? "READING"
        : "SPEAKING";

    const formattedIndex = cardIndex < 10 ? `0${cardIndex}` : `${cardIndex}`;
    const formattedTotal = totalCards < 10 ? `0${totalCards}` : `${totalCards}`;

    const ratingChips = [
      { label: "Again", interval: "<1m", score: 1 },
      { label: "Hard", interval: "12h", score: 2 },
      { label: "Good", interval: "1d", score: 3 },
      { label: "Easy", interval: "4d", score: 5 },
    ];

    return (
      <div
        ref={cardRef}
        onClick={onFlip}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[640px] lg:max-w-[690px] h-[390px] sm:h-[430px] lg:h-[460px] max-h-[calc(100dvh-220px)] cursor-pointer select-none [perspective:1400px] group mx-auto"
      >
        {/* ── Subtle Atmospheric Backlight Aura (Layer 1 - Background Contrast) ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 sm:-inset-8 rounded-[40px] transition-all duration-500 opacity-60 group-hover:opacity-90 z-0"
          style={{
            background: isFlipped
              ? "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(162, 127, 243, 0.22), rgba(52, 211, 153, 0.08) 45%, transparent 75%)"
              : "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(112, 72, 232, 0.22), rgba(162, 127, 243, 0.12) 45%, transparent 75%)",
            filter: "blur(40px)",
            transform: "translate3d(calc(var(--tilt-x, 0) * 2px), calc(var(--tilt-y, 0) * -2px), -10px)",
          }}
        />

        {/* ── 3D Card Shell ── */}
        <div
          className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] z-10"
          style={{
            transform: `rotateY(calc(var(--tilt-x, 0) * 1deg + ${isFlipped ? 180 : 0}deg)) rotateX(calc(var(--tilt-y, 0) * 1deg))`,
          }}
        >
          {/* Dynamic Specular Sheen (Shared Overlays) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(450px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,var(--glare-op, 0)), transparent 70%)",
            }}
          />

          {/* ═══════════════════════════════════════════════════════════════════
              FRONT FACE: Minimalist Luxury Glass
             ═══════════════════════════════════════════════════════════════════ */}
          <article className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0e0c1b]/95 via-[#06050e]/98 to-[#020206] border border-white/[0.12] shadow-[0_32px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(162,127,243,0.18),inset_0_1px_0_rgba(255,255,255,0.15)] flex flex-col justify-between overflow-hidden">
            {/* Top 1px Specular Hairline */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

            {/* Top Bar: Category + Syntax Tag + Counter + Bookmark */}
            <div className="flex items-center justify-between z-10 shrink-0 text-[11px] font-mono text-white/40">
              <span className="tracking-widest uppercase">
                {normalizedCategory} •{" "}
                {normalizedCategory === "READING"
                  ? "VOCABULARY & RETENTION"
                  : card.errorWord
                  ? "SYNTAX & RETENTION"
                  : "CORE LEXICON"}
              </span>

              <div className="flex items-center gap-3">
                <span className="tracking-widest">
                  Card {formattedIndex}/{formattedTotal}
                </span>

                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark card"}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    isBookmarked ? "text-[#F59E0B]" : "text-white/40 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                </button>

                {onDelete && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    aria-label="Delete card"
                    title="Eliminar tarjeta"
                    className="p-1 rounded text-white/40 hover:text-[#F87171] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Polymorphic Front Face Content */}
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

            {/* Bottom Footer: Click to inspect + SM-2 Interval */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40 z-10 shrink-0">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <RotateCw className="w-3 h-3 text-[#A27FF3]" />
                {normalizedCategory === "READING"
                  ? "Click to flip for definition & meaning"
                  : normalizedCategory === "WRITING"
                  ? "Click to inspect structural rules"
                  : "Click to inspect grammar rule"}
              </span>
              <span>SM-2 Interval</span>
            </div>
          </article>

          {/* ═══════════════════════════════════════════════════════════════════
              BACK FACE: Minimalist Luxury Glass ($180^\circ$ Flip)
             ═══════════════════════════════════════════════════════════════════ */}
          <article className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0e0c1b]/95 via-[#06050e]/98 to-[#020206] border border-white/[0.12] shadow-[0_32px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(162,127,243,0.18),inset_0_1px_0_rgba(255,255,255,0.15)] flex flex-col justify-between overflow-hidden">
            {/* Top 1px Specular Hairline */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

            {/* Top Bar: Details + Audio + Actions */}
            <div className="flex items-center justify-between z-10 shrink-0 text-[11px] font-mono text-white/40">
              <span className="tracking-widest uppercase">
                {normalizedCategory === "READING" ? "Definition & Lexicon Context" : "Grammar Rule & Context"} • {normalizedCategory}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayVoice}
                  aria-label="Listen to pronunciation"
                  className="p-1 rounded text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-pulse text-[#34D399]" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark card"}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    isBookmarked ? "text-[#F59E0B]" : "text-white/40 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Dynamic Polymorphic Back Face Content */}
            {normalizedCategory === "SPEAKING" && <MemorySpeakingBack card={card} />}
            {normalizedCategory === "WRITING" && <MemoryWritingBack card={card} />}
            {normalizedCategory === "READING" && <MemoryReadingBack card={card} />}

            {/* 4 Integrated SM-2 Rating Chips */}
            <div className="pt-3 border-t border-white/[0.04] flex flex-col space-y-2 z-10 shrink-0">
              <div className="grid grid-cols-4 gap-1.5">
                {ratingChips.map((chip) => {
                  const isSelected = selectedScore === chip.score;
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={(e) => handleScoreClick(e, chip.score)}
                      className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                          : "bg-white/[0.03] text-white/50 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      <span className="block text-[10px] font-mono uppercase">{chip.label}</span>
                      <span className="block text-[9px] opacity-50">{chip.interval}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-white/30 pt-1">
                <span>Click rating chip or press 1, 2, 3</span>
                <span>Space to return</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  },
);
