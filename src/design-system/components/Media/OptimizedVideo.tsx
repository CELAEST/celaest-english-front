import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";

export interface OptimizedVideoProps {
  /** Base asset path (e.g. "/assets/begin1") or full path. If extensionless, .webm and .mp4 will be appended. */
  src?: string;
  /** Explicit WebM source URL */
  webmSrc?: string;
  /** Explicit MP4 source URL */
  mp4Src?: string;
  /** Optional poster image URL (WebP recommended for speed) */
  poster?: string;
  /** Custom CSS classes for the <video> element */
  className?: string;
  /** Additional inline CSS properties */
  style?: React.CSSProperties;
  /** Declarative playback state. When false, pauses video decoding immediately */
  isActive?: boolean;
  /** Whether the video loops infinitely (default: true) */
  loop?: boolean;
  /** Whether audio is muted (default: true) */
  muted?: boolean;
  /** Whether playback starts automatically (default: true) */
  autoPlay?: boolean;
  /** Media preloading hint (default: "metadata" to conserve network/RAM) */
  preload?: "metadata" | "auto" | "none";
  /** Playback rate modifier (default: 1) */
  playbackRate?: number;
  /** Callback fired when first frame/data is loaded */
  onLoadedData?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  /** Callback fired when media can begin playing */
  onCanPlay?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  /** Hides media from assistive technology when used as visual decoration (default: true) */
  ariaHidden?: boolean;
}

export interface OptimizedVideoHandle {
  play: () => Promise<void> | void;
  pause: () => void;
  getVideoElement: () => HTMLVideoElement | null;
}

/**
 * OptimizedVideo — High-efficiency HTML5 video primitive for CELAEST Lingua.
 * 
 * Performance & Power Standards:
 * - Dual Source: Automatically serves VP9 WebM for modern Chromium/Firefox/Safari and H.264 MP4 fallback.
 * - IntersectionObserver: Automatically calls pause() when off-screen or inside display: none,
 *   freeing hardware video decoder contexts on mobile devices.
 * - VisibilityChange: Halts video frame decoding when the browser tab is minimized or mobile app backgrounded.
 * - Anti-Jank: Catches play() promise interruptions to eliminate uncaught AbortError logs on rapid unmounts.
 * - Hardware Acceleration: Enforces GPU compositor layering with translateZ(0) and backface-visibility.
 */
const OptimizedVideoInternal = forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  (
    {
      src,
      webmSrc,
      mp4Src,
      poster,
      className = "w-full h-full object-contain pointer-events-none",
      style,
      isActive = true,
      loop = true,
      muted = true,
      autoPlay = true,
      preload = "metadata",
      playbackRate = 1,
      onLoadedData,
      onCanPlay,
      ariaHidden = true,
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    const isIntersectingRef = useRef<boolean>(true);

    useImperativeHandle(ref, () => internalRef.current as HTMLVideoElement);

    // Resolve sources
    const finalWebm = webmSrc ?? (src ? (src.endsWith(".webm") ? src : `${src.replace(/\.(mp4|webm)$/, "")}.webm`) : undefined);
    const finalMp4 = mp4Src ?? (src ? (src.endsWith(".mp4") ? src : `${src.replace(/\.(mp4|webm)$/, "")}.mp4`) : undefined);

    const tryPlay = useCallback(() => {
      const v = internalRef.current;
      if (!v || !isActive || !autoPlay || !isIntersectingRef.current) return;
      const p = v.play();
      if (p && typeof (p as Promise<void>).catch === "function") {
        (p as Promise<void>).catch(() => {});
      }
    }, [isActive, autoPlay]);

    const pauseVideo = useCallback(() => {
      const v = internalRef.current;
      if (!v) return;
      try {
        v.pause();
      } catch {}
    }, []);

    // IntersectionObserver: Pause decoding as soon as element is hidden or off-screen
    useEffect(() => {
      const v = internalRef.current;
      if (!v) return;

      if (typeof IntersectionObserver === "undefined") {
        isIntersectingRef.current = true;
        if (isActive && autoPlay) tryPlay();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const isVisible = Boolean(entry?.isIntersecting);
          isIntersectingRef.current = isVisible;

          if (isVisible && isActive && autoPlay) {
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
    }, [isActive, autoPlay, tryPlay, pauseVideo]);

    // React to isActive prop changes
    useEffect(() => {
      if (!isActive) {
        pauseVideo();
      } else if (isIntersectingRef.current && autoPlay) {
        tryPlay();
      }
    }, [isActive, autoPlay, tryPlay, pauseVideo]);

    // Handle document visibility and playback rate
    useEffect(() => {
      const v = internalRef.current;
      if (!v) return;

      v.playbackRate = playbackRate;
      if (isActive && autoPlay && isIntersectingRef.current) {
        tryPlay();
      }

      const onEnded = () => {
        if (loop) {
          v.currentTime = 0;
          if (isActive && isIntersectingRef.current) tryPlay();
        }
      };

      const onVisibility = () => {
        if (document.visibilityState === "visible" && isActive && autoPlay && isIntersectingRef.current) {
          tryPlay();
        } else if (document.visibilityState === "hidden") {
          pauseVideo();
        }
      };

      const handleCanPlay = (e: Event) => {
        if (isActive && autoPlay && isIntersectingRef.current) tryPlay();
        if (onCanPlay) onCanPlay(e as unknown as React.SyntheticEvent<HTMLVideoElement>);
      };

      v.addEventListener("ended", onEnded);
      v.addEventListener("canplay", handleCanPlay);
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("focus", tryPlay);

      return () => {
        v.removeEventListener("ended", onEnded);
        v.removeEventListener("canplay", handleCanPlay);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("focus", tryPlay);
      };
    }, [tryPlay, pauseVideo, playbackRate, isActive, autoPlay, loop, onCanPlay]);

    return (
      <video
        ref={internalRef}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload={preload}
        disablePictureInPicture
        // @ts-ignore
        disableRemotePlayback
        aria-hidden={ariaHidden ? "true" : undefined}
        className={className}
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
          ...style,
        }}
        onLoadedData={onLoadedData}
        onError={() => {
          const v = internalRef.current;
          if (v && isActive && isIntersectingRef.current && autoPlay) {
            tryPlay();
          }
        }}
        onStalled={() => {
          if (isActive && isIntersectingRef.current && autoPlay) tryPlay();
        }}
      >
        {finalWebm && <source src={finalWebm} type="video/webm" />}
        {finalMp4 && <source src={finalMp4} type="video/mp4" />}
      </video>
    );
  },
);

OptimizedVideoInternal.displayName = "OptimizedVideo";

export const OptimizedVideo = React.memo(OptimizedVideoInternal);
export default OptimizedVideo;
