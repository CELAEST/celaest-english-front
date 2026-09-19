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
      if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
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
        className="relative w-full max-w-[640px] lg:max-w-[690px] h-[415px] xs:h-[435px] sm:h-[460px] lg:h-[490px] max-h-[calc(100dvh-180px)] min-h-[380px] cursor-pointer select-none [perspective:1400px] group mx-auto"
      >
        {/* ── Subtle Atmospheric Backlight Aura (Soft Whisper Shading) ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 sm:-inset-6 rounded-[40px] transition-all duration-500 opacity-35 group-hover:opacity-50 z-0"
          style={{
            background: isFlipped
              ? "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(162, 127, 243, 0.16), rgba(52, 211, 153, 0.08) 50%, transparent 75%)"
              : "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(124, 58, 237, 0.18), rgba(162, 127, 243, 0.1) 50%, transparent 75%)",
            filter: "blur(50px)",
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
          <article className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl p-3.5 xs:p-4 sm:p-6 lg:p-7 bg-gradient-to-b from-[#0d0b1a]/95 via-[#070510]/98 to-[#020206] border border-white/[0.1] shadow-[0_24px_50px_rgba(0,0,0,0.85),0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between overflow-hidden">
            {/* Top 1px Specular Hairline */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-400/30 to-transparent pointer-events-none" />

            {/* Top Bar: Clean Category + Counter + Bookmark */}
            <div className="flex items-center justify-between z-10 shrink-0 text-[11px] font-mono text-white/40 pb-1">
              <span className="tracking-widest uppercase">
                {normalizedCategory}
              </span>

              <div className="flex items-center gap-3">
                <span className="tracking-widest shrink-0">
                  Card {formattedIndex}/{formattedTotal}
                </span>

                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark card"}
                  className={`p-1.5 sm:p-1 rounded transition-colors cursor-pointer ${
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
                    className="p-1.5 sm:p-1 rounded text-white/40 hover:text-[#F87171] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Polymorphic Front Face Content */}
            <div className="flex-1 min-h-0 flex flex-col justify-center py-1 touch-pan-y select-none">
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
            </div>

            {/* Bottom Footer: Minimalist Tap to flip without SM-2 clutter */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onFlip()}
              className="pt-2 sm:pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40 z-10 shrink-0 mt-auto cursor-pointer"
            >
              <span className="flex items-center gap-2 hover:text-white transition-colors">
                <RotateCw className="w-3.5 h-3.5 text-[#A27FF3] shrink-0" />
                <span className="tracking-wide">
                  {normalizedCategory === "READING"
                    ? "Tap to flip for definition"
                    : normalizedCategory === "WRITING"
                    ? "Tap to inspect structural rules"
                    : "Tap to inspect grammar rule"}
                </span>
              </span>
              <span className="text-[10px] text-white/25 hidden sm:inline tracking-widest uppercase">
                Space to flip
              </span>
            </div>
          </article>

          {/* ═══════════════════════════════════════════════════════════════════
              BACK FACE: Minimalist Luxury Glass ($180^\circ$ Flip)
             ═══════════════════════════════════════════════════════════════════ */}
          <article className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl p-3.5 xs:p-4.5 sm:p-6 lg:p-7 bg-gradient-to-b from-[#0d0b1a]/95 via-[#070510]/98 to-[#020206] border border-white/[0.1] shadow-[0_24px_50px_rgba(0,0,0,0.85),0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between overflow-hidden">
            {/* Top 1px Specular Hairline */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-400/30 to-transparent pointer-events-none" />

            {/* Top Bar: Clean Back Header + Audio + Actions */}
            <div className="flex items-center justify-between z-10 shrink-0 text-[11px] font-mono text-white/40 pb-1">
              <span className="tracking-widest uppercase">
                {normalizedCategory === "READING"
                  ? "Definition"
                  : normalizedCategory === "WRITING"
                  ? "Editorial Polish"
                  : "Grammar Rule"}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayVoice}
                  aria-label="Listen to pronunciation"
                  className="p-1.5 sm:p-1 rounded text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-pulse text-[#34D399]" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark card"}
                  className={`p-1.5 sm:p-1 rounded transition-colors cursor-pointer ${
                    isBookmarked ? "text-[#F59E0B]" : "text-white/40 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Dynamic Polymorphic Back Face Content */}
            <div className="flex-1 min-h-0 flex flex-col justify-center overflow-y-auto overscroll-contain py-1 scrollbar-none touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] select-none">
              {normalizedCategory === "SPEAKING" && <MemorySpeakingBack card={card} />}
              {normalizedCategory === "WRITING" && <MemoryWritingBack card={card} />}
              {normalizedCategory === "READING" && <MemoryReadingBack card={card} />}
            </div>

            {/* 4 Integrated SM-2 Rating Chips */}
            <div className="pt-2 sm:pt-2.5 border-t border-white/[0.06] flex flex-col space-y-1.5 sm:space-y-2 z-20 shrink-0 mt-auto">
              <div className="grid grid-cols-4 gap-1.5">
                {ratingChips.map((chip) => {
                  const isSelected = selectedScore === chip.score;
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={(e) => handleScoreClick(e, chip.score)}
                      className={`py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl text-center transition-all cursor-pointer min-h-[36px] sm:min-h-0 flex flex-col justify-center ${
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

              <div className="flex items-center justify-between text-[9.5px] sm:text-[10px] font-mono text-white/30 pt-0.5 sm:pt-1 gap-2 overflow-hidden">
                <span className="min-w-0 truncate">Click rating chip or press 1, 2, 3</span>
                <span className="shrink-0 whitespace-nowrap">Space to return</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  },
);
