import React, { useRef, useCallback, useEffect } from "react";

export interface MemoryEmptyStateProps {
  category: string;
  hasOtherCards?: boolean | undefined;
  onSwitchCategory?: (() => void) | undefined;
  onStartPractice?: (() => void) | undefined;
  hideHeader?: boolean | undefined;
  isActive?: boolean | undefined;
}

export const MemoryEmptyState: React.FC<MemoryEmptyStateProps> = React.memo(({
  category,
  hasOtherCards = false,
  onSwitchCategory,
  onStartPractice,
  hideHeader = false,
  isActive = true,
}) => {
  const isCategoryCatchUp = hasOtherCards;
  const showHeader = !hideHeader;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Desktop fine-pointer hover triggers loop, unhover pauses to static frame
  const handleMouseEnter = useCallback(() => {
    if (videoRef.current && typeof videoRef.current.play === "function") {
      const p = videoRef.current.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Keep ambient video playing smoothly
  }, []);

  // Automatic smooth playback whenever active; pause when backgrounded or inactive
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      if (!isActive || document.visibilityState === "hidden") {
        if (typeof video.pause === "function") {
          try {
            video.pause();
          } catch {}
        }
        return;
      }

      // Always ensure video plays when active
      if (typeof video.play === "function") {
        const p = video.play();
        if (p && typeof p.catch === "function") {
          p.catch(() => {});
        }
      }
    };

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    window.addEventListener("focus", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      window.removeEventListener("focus", syncPlayback);
    };
  }, [isActive]);

  return (
    <div className="relative flex flex-col flex-1 h-full w-full justify-between items-center select-none min-h-0">
      {/* ── Background Video Backdrop — Detrás de todo (z-0) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
      >
        <div
          className="pointer-events-auto cursor-pointer group relative flex items-center justify-center -translate-y-2 xs:-translate-y-3 sm:-translate-y-6 lg:-translate-y-8 origin-center scale-[1.46] xs:scale-[1.54] sm:scale-[1.22] md:scale-[1.10] lg:scale-100 transition-transform duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <video
            ref={videoRef}
            poster="/assets/cards_poster.webp"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className="w-full sm:w-auto h-auto max-w-[min(96vw,520px)] sm:max-w-[min(96vw,1200px)] max-h-[58vh] xs:max-h-[64vh] sm:max-h-[70vh] lg:max-h-[76vh] object-contain select-none"
            style={{ willChange: "transform", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
          >
            <source src="/assets/cards.mp4" type="video/mp4" />
            <source src="/assets/cards.webm" type="video/webm" />
          </video>
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
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pb-2 sm:pb-4 lg:pb-6 animate-[fadeIn_0.4s_ease-out_both]">
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

