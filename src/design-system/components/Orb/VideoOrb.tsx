import React, { useRef, useEffect, useCallback } from "react";

export interface VideoOrbProps {
  className?: string;
  videoClassName?: string;
  poster?: string;
  /** Controls play rate if needed, default 1 */
  playbackRate?: number;
}

/**
 * VideoOrb — Loop infinito de /assets/orve.mp4
 * Mantiene 1:1 el layout de la imagen PNG anterior (w-full h-full object-contain)
 * Nunca para: autoPlay + loop + muted + playsInline + auto-resume en visibilitychange / pause / error
 */
export const VideoOrb: React.FC<VideoOrbProps> = ({
  className = "w-full h-full object-contain pointer-events-none",
  videoClassName,
  poster,
  playbackRate = 1,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const tryPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof (p as Promise<void>).catch === "function") {
      (p as Promise<void>).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = playbackRate;
    tryPlay();

    const onPause = () => {
      if (!v.ended) tryPlay();
    };
    const onEnded = () => {
      v.currentTime = 0;
      tryPlay();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    const onCanPlay = () => tryPlay();

    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("canplay", onCanPlay);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", tryPlay);

    return () => {
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", tryPlay);
    };
  }, [tryPlay, playbackRate]);

  return (
    <video
      ref={videoRef}
      src="/assets/orve.mp4"
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
      className={videoClassName ?? className}
      style={{ objectFit: "contain", willChange: "transform", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
      onClick={(e) => e.preventDefault()}
      onError={() => {
        const v = videoRef.current;
        if (v) {
          try {
            v.load();
            tryPlay();
          } catch {}
        }
      }}
      onStalled={() => tryPlay()}
    />
  );
};

export default VideoOrb;
