import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { SpeechSynthesisService, MobileAudioUnlocker } from "../../conversation/services/speechSynthesisService";

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

    const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
    const deleteTimerRef = useRef<number | null>(null);

    // 3D Mathematical Tilt & Specular Glare Physics via CSS variables (Zero React Re-renders)
    const cardRef = useRef<HTMLDivElement>(null);
    const rafIdRef = useRef<number | null>(null);
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        if (deleteTimerRef.current) window.clearTimeout(deleteTimerRef.current);
        SpeechSynthesisService.stop();
      };
    }, []);

    useEffect(() => {
      setIsPlayingAudio(false);
      SpeechSynthesisService.stop();
    }, [card.id]);

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

    const handleCardClick = () => {
      // If user selected text (to copy a word or phrase), do not flip the card
      const selection = typeof window !== "undefined" ? window.getSelection() : null;
      if (selection && selection.toString().trim().length > 0) {
        return;
      }
      onFlip();
    };

    const handleBookmarkToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsBookmarked((prev: boolean) => !prev);
      if (onBookmark) onBookmark(card.id);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!confirmingDelete) {
        setConfirmingDelete(true);
        deleteTimerRef.current = window.setTimeout(() => {
          if (isMountedRef.current) setConfirmingDelete(false);
        }, 2500);
        return;
      }
      if (deleteTimerRef.current) window.clearTimeout(deleteTimerRef.current);
      setConfirmingDelete(false);
      if (onDelete) {
        onDelete(card.id);
      }
    };

    const rawCategory = (card.category || "").toUpperCase().trim();
    const normalizedCategory: "SPEAKING" | "WRITING" | "READING" =
      rawCategory === "WRITING"
        ? "WRITING"
        : rawCategory === "READING"
        ? "READING"
        : "SPEAKING";

    const handlePlayVoice = (e: React.MouseEvent) => {
      e.stopPropagation();
      let textToSpeak = card.betterWay || card.correctWord || card.userSaid;
      if (normalizedCategory === "READING") {
        textToSpeak = card.errorWord || card.betterWay || card.correctWord || card.userSaid;
      }
      if (!textToSpeak) return;

      MobileAudioUnlocker.unlock();
      setIsPlayingAudio(true);
      void SpeechSynthesisService.speak(textToSpeak, {
        voice: "en-US-AriaNeural",
        rate: 0.9,
        onStart: () => {
          if (isMountedRef.current) setIsPlayingAudio(true);
        },
        onEnd: () => {
          if (isMountedRef.current) setIsPlayingAudio(false);
        },
        onError: () => {
          if (isMountedRef.current) setIsPlayingAudio(false);
        },
      });
    };

    const handleScoreClick = (e: React.MouseEvent, score: number) => {
      e.stopPropagation();
      setSelectedScore(score);
      if (onReviewScore) {
        onReviewScore(score);
      }
    };

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
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[640px] lg:max-w-[690px] h-[415px] xs:h-[435px] sm:h-[460px] lg:h-[460px] max-h-[calc(100dvh-320px)] lg:max-h-[calc(100dvh-280px)] min-h-[260px] cursor-pointer select-none [perspective:1400px] group mx-auto"
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

            {/* Top Bar: Clean Category + Counter + Bookmark + Delete */}
            <div className="flex items-center justify-between z-10 shrink-0 text-[11px] font-mono text-white/40 pb-1">
              <span className="tracking-widest uppercase">
                {normalizedCategory}
              </span>

              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <span className="tracking-widest shrink-0 pr-1">
                  Card {formattedIndex}/{formattedTotal}
                </span>

                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark card"}
                  className={`min-w-[36px] min-h-[36px] p-1.5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    isBookmarked ? "text-[#F59E0B] bg-[#F59E0B]/10" : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                </button>

                {onDelete && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    aria-label={confirmingDelete ? "Confirm delete card" : "Delete card"}
                    title={confirmingDelete ? "Toca de nuevo para confirmar" : "Eliminar tarjeta"}
                    className={`min-h-[36px] min-w-[36px] px-2 py-1 rounded-lg flex items-center justify-center gap-1 text-xs font-mono transition-all cursor-pointer ${
                      confirmingDelete
                        ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                        : "text-white/40 hover:text-[#F87171] hover:bg-white/[0.05]"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    {confirmingDelete && (
                      <span className="text-[10px] whitespace-nowrap font-sans font-medium text-red-300">
                        ¿Eliminar?
                      </span>
                    )}
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
              className="pt-2 sm:pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40 z-10 shrink-0 mt-auto cursor-pointer min-h-[38px]"
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

              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <button
                  type="button"
                  onClick={handlePlayVoice}
                  aria-label="Listen to pronunciation"
                  className="min-w-[36px] min-h-[36px] p-1.5 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-pulse text-[#34D399]" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark card"}
                  className={`min-w-[36px] min-h-[36px] p-1.5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    isBookmarked ? "text-[#F59E0B] bg-[#F59E0B]/10" : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                </button>

                {onDelete && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    aria-label={confirmingDelete ? "Confirm delete card" : "Delete card"}
                    title={confirmingDelete ? "Toca de nuevo para confirmar" : "Eliminar tarjeta"}
                    className={`min-h-[36px] min-w-[36px] px-2 py-1 rounded-lg flex items-center justify-center gap-1 text-xs font-mono transition-all cursor-pointer ${
                      confirmingDelete
                        ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                        : "text-white/40 hover:text-[#F87171] hover:bg-white/[0.05]"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    {confirmingDelete && (
                      <span className="text-[10px] whitespace-nowrap font-sans font-medium text-red-300">
                        ¿Eliminar?
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Polymorphic Back Face Content */}
            <div className="flex-1 min-h-0 flex flex-col justify-center overflow-y-auto overscroll-contain py-1 scrollbar-none touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] select-none">
              {normalizedCategory === "SPEAKING" && <MemorySpeakingBack card={card} />}
              {normalizedCategory === "WRITING" && <MemoryWritingBack card={card} />}
              {normalizedCategory === "READING" && <MemoryReadingBack card={card} />}
            </div>

            {/* 4 Integrated SM-2 Rating Chips (WCAG compliant 44px min-h touch target) */}
            <div className="pt-2 sm:pt-2.5 border-t border-white/[0.06] flex flex-col space-y-1.5 sm:space-y-2 z-20 shrink-0 mt-auto">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {ratingChips.map((chip) => {
                  const isSelected = selectedScore === chip.score;
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={(e) => handleScoreClick(e, chip.score)}
                      className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-center transition-all cursor-pointer min-h-[44px] flex flex-col justify-center ${
                        isSelected
                          ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                          : "bg-white/[0.03] text-white/50 hover:bg-white/[0.08] hover:text-white active:scale-95"
                      }`}
                    >
                      <span className="block text-[11px] sm:text-xs font-mono uppercase leading-tight">{chip.label}</span>
                      <span className="block text-[9.5px] sm:text-[10px] opacity-60 leading-tight">{chip.interval}</span>
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
