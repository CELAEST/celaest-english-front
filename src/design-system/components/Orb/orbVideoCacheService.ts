import { useState, useEffect } from "react";

/**
 * OrbVideoCacheService — High-performance Media Caching & Hardware Pre-warming.
 * 
 * Enforces instant, zero-delay mounting of video orbs across all features (Interview, Memory, Writing, Reading).
 * 
 * Performance Architecture:
 * 1. Multi-Tier Cache: CacheStorage API (disk/PWA persistent) -> RAM Blob URL -> Direct Stream.
 * 2. Instant Decoding: Pre-fetches the ~145-190KB orb video into memory as a Blob URL,
 *    eliminating HTTP range-request handshakes and network buffering delay on tab navigation.
 * 3. Hardware Decoder Pre-warming: Spins up a 1-frame background decoder on startup so
 *    mobile GPU media decoders (AVFoundation / MediaCodec) are already hot when the user opens a feature.
 */

type CacheListener = (blobUrl: string, assetUrl: string) => void;

class OrbVideoCacheServiceImpl {
  private static instance: OrbVideoCacheServiceImpl;
  private memoryCache: Map<string, string> = new Map(); // assetUrl -> blobUrl
  private inFlightPromises: Map<string, Promise<string>> = new Map();
  private listeners: Set<CacheListener> = new Set();
  private isDecoderWarmed = false;

  private constructor() {
    // Eagerly initiate preload in browser environments when idle (skip in unit test runner)
    if (
      typeof window !== "undefined" &&
      !(typeof process !== "undefined" && process.env?.NODE_ENV === "test")
    ) {
      const schedulePreload = () => {
        void this.preload("/assets/orve.mp4");
        void this.preload("/assets/orve.webm");
        void this.preload("/assets/home.mp4");
      };

      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(schedulePreload);
      } else {
        setTimeout(schedulePreload, 200);
      }
    }
  }

  public static getInstance(): OrbVideoCacheServiceImpl {
    if (!OrbVideoCacheServiceImpl.instance) {
      OrbVideoCacheServiceImpl.instance = new OrbVideoCacheServiceImpl();
    }
    return OrbVideoCacheServiceImpl.instance;
  }

  public getCachedUrl(assetUrl: string): string | null {
    return this.memoryCache.get(assetUrl) ?? null;
  }

  public subscribe(listener: CacheListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Preload an asset into local CacheStorage and in-memory Blob URL
   */
  public async preload(assetUrl: string = "/assets/orve.mp4"): Promise<string> {
    if (typeof window === "undefined") return assetUrl;

    // 1. Check in-memory RAM cache
    const existing = this.memoryCache.get(assetUrl);
    if (existing) return existing;

    // 2. Check in-flight promise to avoid duplicate concurrent fetches
    const inFlight = this.inFlightPromises.get(assetUrl);
    if (inFlight) return inFlight;

    const fetchPromise = (async () => {
      try {
        let blob: Blob | null = null;
        const targetUrl =
          typeof window !== "undefined" && window.location?.origin && !assetUrl.startsWith("http")
            ? new URL(assetUrl, window.location.origin).href
            : assetUrl;

        // Try Cache API first for instant offline/PWA recall
        if ("caches" in window) {
          try {
            const cache = await caches.open("celaest-media-cache-v1");
            const cachedResponse = await cache.match(targetUrl);
            if (cachedResponse) {
              blob = await cachedResponse.blob();
            } else {
              const netResponse = await fetch(targetUrl, { cache: "force-cache" });
              if (netResponse.ok) {
                await cache.put(targetUrl, netResponse.clone());
                blob = await netResponse.blob();
              }
            }
          } catch {
            // Cache API restricted or failed, fallback to direct fetch
          }
        }

        // Direct fetch fallback if Cache API was unavailable or didn't yield a blob
        if (!blob) {
          const resp = await fetch(targetUrl, { cache: "force-cache" });
          if (resp.ok) {
            blob = await resp.blob();
          }
        }

        if (blob && typeof URL.createObjectURL === "function") {
          const blobUrl = URL.createObjectURL(blob);
          this.memoryCache.set(assetUrl, blobUrl);
          this.notifyListeners(blobUrl, assetUrl);
          this.warmHardwareDecoder(blobUrl);
          return blobUrl;
        }
      } catch (err) {
        // Log quietly without throwing to avoid breaking consumer render trees
        console.warn(`[OrbVideoCache] Preload failed for ${assetUrl}, falling back to static path:`, err);
      } finally {
        this.inFlightPromises.delete(assetUrl);
      }

      return assetUrl;
    })();

    this.inFlightPromises.set(assetUrl, fetchPromise);
    return fetchPromise;
  }

  /**
   * Pre-warms the GPU hardware video decoder for 1 frame
   */
  public warmHardwareDecoder(blobUrl: string): void {
    if (this.isDecoderWarmed || typeof document === "undefined") return;
    this.isDecoderWarmed = true;

    try {
      const probe = document.createElement("video");
      probe.muted = true;
      probe.playsInline = true;
      probe.preload = "auto";
      probe.src = blobUrl;
      probe.style.position = "fixed";
      probe.style.opacity = "0.001";
      probe.style.pointerEvents = "none";
      probe.style.width = "1px";
      probe.style.height = "1px";
      probe.style.top = "-9999px";
      probe.setAttribute("aria-hidden", "true");

      const cleanup = () => {
        try {
          probe.pause();
          probe.removeAttribute("src");
          probe.load();
          probe.remove();
        } catch {}
      };

      document.body.appendChild(probe);
      const playPromise = probe.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => setTimeout(cleanup, 100)).catch(cleanup);
      } else {
        setTimeout(cleanup, 100);
      }
    } catch {
      // Ignored if autoplay is strictly blocked in headless mode
    }
  }

  private notifyListeners(blobUrl: string, assetUrl: string): void {
    this.listeners.forEach((listener) => {
      try {
        listener(blobUrl, assetUrl);
      } catch (e) {
        console.error("[OrbVideoCache] Listener error:", e);
      }
    });
  }
}

export const orbVideoCacheService = OrbVideoCacheServiceImpl.getInstance();

/**
 * React hook to consume cached Blob URL for instant video orb rendering
 */
export function useOrbVideoSrc(assetUrl: string = "/assets/orve.mp4"): {
  videoSrc: string;
  isCached: boolean;
} {
  const [videoSrc, setVideoSrc] = useState<string>(() => {
    return orbVideoCacheService.getCachedUrl(assetUrl) ?? assetUrl;
  });
  const [isCached, setIsCached] = useState<boolean>(() => {
    return Boolean(orbVideoCacheService.getCachedUrl(assetUrl));
  });

  useEffect(() => {
    const cached = orbVideoCacheService.getCachedUrl(assetUrl);
    if (cached) {
      setVideoSrc(cached);
      setIsCached(true);
      return;
    }

    // Trigger preload if not yet in cache
    void orbVideoCacheService.preload(assetUrl);

    // Subscribe to cache completion
    return orbVideoCacheService.subscribe((blobUrl, url) => {
      if (url === assetUrl) {
        setVideoSrc(blobUrl);
        setIsCached(true);
      }
    });
  }, [assetUrl]);

  return { videoSrc, isCached };
}
