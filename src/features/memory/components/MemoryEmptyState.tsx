import React, { useRef, useCallback, useEffect } from "react";

export interface MemoryEmptyStateProps {
  category: string;
  hasOtherCards?: boolean | undefined;
  onSwitchCategory?: (() => void) | undefined;
  onStartPractice?: (() => void) | undefined;
  hideHeader?: boolean | undefined;
}

export const MemoryEmptyState: React.FC<MemoryEmptyStateProps> = React.memo(({
  category,
  hasOtherCards = false,
  onSwitchCategory,
  onStartPractice,
  hideHeader = false,
}) => {
  const isCategoryCatchUp = hasOtherCards;
  const showHeader = !hideHeader;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Desktop hover triggers loop, unhover pauses to static image
  const handleMouseEnter = useCallback(() => {
    if (videoRef.current && typeof videoRef.current.play === "function") {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Only pause on desktop unhover, never stop on mobile
    if (
      typeof window !== "undefined" &&
      window.innerWidth >= 768 &&
      videoRef.current &&
      typeof videoRef.current.pause === "function"
    ) {
      videoRef.current.pause();
    }
  }, []);

  // Automatic playback on mobile; interactive hover on desktop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (isMobile) {
        if (typeof video.play === "function") {
          video.play().catch(() => {});
        }
      } else {
        if (typeof video.pause === "function") {
          video.pause();
        }
      }
    };

    syncPlayback();
    window.addEventListener("resize", syncPlayback);
    return () => window.removeEventListener("resize", syncPlayback);
  }, []);

  return (
    <div className="relative flex flex-col flex-1 h-full w-full justify-between items-center select-none min-h-0">
      {/* ── Background Video Backdrop — Detrás de todo (z-0) con hover interactivo ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
      >
        <div
          className="pointer-events-auto cursor-pointer group relative flex items-center justify-center -translate-y-10 xs:-translate-y-12 sm:-translate-y-12 lg:-translate-y-14 xl:-translate-y-16 transition-all duration-500 ease-out hover:scale-[1.02] scale-[1.46] xs:scale-[1.52] sm:scale-100 origin-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <video
            ref={videoRef}
            src="/assets/cards.mp4"
            poster="/assets/cards_poster.png"
            loop
            muted
            playsInline
            preload="auto"
            className="w-auto h-auto max-w-[min(98vw,1440px)] max-h-[58vh] sm:max-h-[66vh] lg:max-h-[72vh] xl:max-h-[78vh] object-contain select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] filter brightness-105 contrast-105"
          />
        </div>
      </div>

      {/* Spacer center area — deja que el video se luzca en el centro sin tapar */}
      <div className="flex-1 min-h-0 pointer-events-none" />

      {/* Título/desc solo si se solicita */}
      {showHeader && (
        <div className="relative z-20 text-center max-w-md mx-auto mb-4">
          <h3 className="text-xl sm:text-2xl font-serif font-light text-white">
            {isCategoryCatchUp ? (
              <>
                All caught up in <span className="italic text-white/90">{category.toLowerCase()}</span>
              </>
            ) : (
              <>
                Your Personalized <span className="italic text-white/90">Memory Deck</span>
              </>
            )}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-white/40 font-light">
            {isCategoryCatchUp
              ? "You have completed all reviews for this category."
              : "Click “Add to Memory” during practice to curate your deck."}
          </p>
        </div>
      )}

      {/* ── Foreground Actions — Por encima del video (z-20) ── */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pb-3 sm:pb-4 lg:pb-6 animate-[fadeIn_0.4s_ease-out_both]">
        {isCategoryCatchUp && onSwitchCategory && (
          <button
            type="button"
            onClick={onSwitchCategory}
            className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/90 hover:text-white text-xs font-medium active:scale-95 transition-all cursor-pointer border border-white/[0.12] backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          >
            Review other categories
          </button>
        )}
        {onStartPractice && (
          <button
            type="button"
            onClick={onStartPractice}
            className="px-6 sm:px-7 py-2 sm:py-2.5 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
          >
            Start Practice Session
          </button>
        )}
      </div>
    </div>
  );
});

