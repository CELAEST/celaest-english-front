import React, { useRef, useEffect, useCallback } from "react";

export interface VideoOrbProps {
  className?: string;
  videoClassName?: string;
  poster?: string;
  /** Controls play rate if needed, default 1 */
  playbackRate?: number;
  /** Explicitly pause decoding when containing tab or view is inactive */
  isActive?: boolean;
}

/**
 * VideoOrb — Loop infinito de /assets/orve.mp4 / /assets/orve.webm
 * High-performance, low-power video component:
 * Auto-pauses when hidden (display: none / off-screen / tab inactive) via IntersectionObserver,
 * freeing GPU hardware decoders on mobile devices.
 * Zero-jump guarantee: First frame is decoded immediately with transparent background
 * and zero dark skeleton overlays or pulsating balls.
 */
const VideoOrbInner: React.FC<VideoOrbProps> = ({
  className = "w-full h-full object-contain pointer-events-none",
  videoClassName,
  poster,
  playbackRate = 1,
  isActive = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isIntersectingRef = useRef<boolean>(true);

  const tryPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v || !isActive || !isIntersectingRef.current) return;
    const p = v.play();
    if (p && typeof (p as Promise<void>).catch === "function") {
      (p as Promise<void>).catch(() => {});
    }
  }, [isActive]);

  const pauseVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
    } catch {}
  }, []);

  // IntersectionObserver: Pause decoding as soon as the element or parent is hidden (display: none / off-screen)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (typeof IntersectionObserver === "undefined") {
      isIntersectingRef.current = true;
      if (isActive) tryPlay();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = Boolean(entry?.isIntersecting);
        isIntersectingRef.current = isVisible;

        if (isVisible && isActive) {
          tryPlay();
        } else {
          pauseVideo();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(v);

    return () => {
      observer.disconnect();
    };
  }, [isActive, tryPlay, pauseVideo]);

  // Sync with isActive prop
  useEffect(() => {
    if (!isActive) {
      pauseVideo();
    } else if (isIntersectingRef.current) {
      tryPlay();
    }
  }, [isActive, tryPlay, pauseVideo]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = playbackRate;
    if (isActive && isIntersectingRef.current) {
      tryPlay();
    }

    const onEnded = () => {
      v.currentTime = 0;
      if (isActive && isIntersectingRef.current) tryPlay();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible" && isActive && isIntersectingRef.current) {
        tryPlay();
      } else if (document.visibilityState === "hidden") {
        pauseVideo();
      }
    };
    const onCanPlay = () => {
      if (isActive && isIntersectingRef.current) tryPlay();
    };

    v.addEventListener("ended", onEnded);
    v.addEventListener("canplay", onCanPlay);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", tryPlay);

    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", tryPlay);
    };
  }, [tryPlay, pauseVideo, playbackRate, isActive]);

  return (
    <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden select-none bg-transparent">
      <video
        ref={videoRef}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        // @ts-ignore
        disableRemotePlayback
        aria-hidden="true"
        className={`${videoClassName ?? className} rounded-full opacity-100`}
        style={{
          objectFit: "contain",
          backgroundColor: "transparent",
          willChange: "transform",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
        onClick={(e) => e.preventDefault()}
        onError={() => {
          const v = videoRef.current;
          if (v && isActive && isIntersectingRef.current) {
            tryPlay();
          }
        }}
        onStalled={() => {
          if (isActive && isIntersectingRef.current) tryPlay();
        }}
      >
        <source src="/assets/orve.webm" type="video/webm" />
        <source src="/assets/orve.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export const VideoOrb = React.memo(VideoOrbInner);
export default VideoOrb;
