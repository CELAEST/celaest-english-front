import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

export type FlagshipVoiceId = "en-US-AriaNeural" | "en-US-ChristopherNeural";

export interface WordBoundaryTimestamp {
  offsetMs: number;
  durationMs: number;
  text: string;
}

export interface CachedAudioItem {
  blobUrl: string;
  blob: Blob;
  audio: HTMLAudioElement;
  wordBoundaries: WordBoundaryTimestamp[];
  loadedAt: number;
}

/**
 * Intelligent In-Memory Audio Preload & Prefetching Engine for CELAEST Reading.
 * Pre-downloads and decodes audio in background before the user clicks "Listen",
 * capturing sub-millisecond word boundaries from the neural engine.
 */
class ReadingAudioPrefetcher {
  private cache = new Map<string, CachedAudioItem>();
  private inFlight = new Map<string, Promise<CachedAudioItem | null>>();
  private maxCacheEntries = 50;

  private makeKey(text: string, voice: FlagshipVoiceId): string {
    return `${text.trim()}::${voice}`;
  }

  /**
   * Check if audio for a specific text & voice is already preloaded in memory.
   */
  public has(text: string, voice: FlagshipVoiceId): boolean {
    const key = this.makeKey(text, voice);
    return this.cache.has(key);
  }

  /**
   * Get cached audio element & blob URL if preloaded.
   */
  public get(text: string, voice: FlagshipVoiceId): CachedAudioItem | null {
    const key = this.makeKey(text, voice);
    return this.cache.get(key) ?? null;
  }

  /**
   * Prefetches a single text block for a specific voice in background.
   */
  public async prefetchText(
    text: string,
    voice: FlagshipVoiceId = "en-US-AriaNeural",
  ): Promise<CachedAudioItem | null> {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const key = this.makeKey(trimmed, voice);
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    if (this.inFlight.has(key)) {
      return this.inFlight.get(key)!;
    }

    const fetchPromise = (async (): Promise<CachedAudioItem | null> => {
      try {
        const streamUrl = `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(
          trimmed,
        )}&voice=${encodeURIComponent(voice)}&rate=0%`;

        const response = await fetch(streamUrl, {
          method: "GET",
          headers: { Accept: "audio/mpeg" },
        });

        if (!response.ok) {
          throw new Error(`TTS server returned status ${response.status}`);
        }

        // Extract sub-millisecond word boundaries from neural TTS header
        let wordBoundaries: WordBoundaryTimestamp[] = [];
        const wbHeader =
          response.headers.get("X-Word-Boundaries") ||
          response.headers.get("x-word-boundaries");

        if (wbHeader) {
          try {
            const decodedJSON = atob(wbHeader);
            wordBoundaries = JSON.parse(decodedJSON) as WordBoundaryTimestamp[];
          } catch (e) {
            logger.warn("[AudioPrefetcher] Could not parse word boundary header:", e);
          }
        }

        const blob = await response.blob();
        if (blob.size === 0) {
          throw new Error("Received empty audio blob");
        }

        const blobUrl = URL.createObjectURL(blob);
        const audio = new Audio(blobUrl);
        audio.preload = "auto";

        const item: CachedAudioItem = {
          blobUrl,
          blob,
          audio,
          wordBoundaries,
          loadedAt: Date.now(),
        };

        // Evict oldest if capacity exceeded
        if (this.cache.size >= this.maxCacheEntries) {
          const oldestKey = this.cache.keys().next().value;
          if (oldestKey) {
            const oldItem = this.cache.get(oldestKey);
            if (oldItem) URL.revokeObjectURL(oldItem.blobUrl);
            this.cache.delete(oldestKey);
          }
        }

        this.cache.set(key, item);
        return item;
      } catch (err) {
        logger.warn(`[AudioPrefetcher] Failed to prefetch "${trimmed.slice(0, 30)}..." for ${voice}:`, err);
        return null;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, fetchPromise);
    return fetchPromise;
  }

  /**
   * Pre-fetches all pages of an article in priority order:
   * 1. Current Page (Aria & Christopher)
   * 2. Next Page (Aria & Christopher)
   * 3. Subsequent Pages (Aria & Christopher)
   */
  public prefetchArticlePages(
    pages: string[],
    currentPageIndex: number = 0,
    voices: FlagshipVoiceId[] = ["en-US-AriaNeural", "en-US-ChristopherNeural"],
  ): void {
    if (!pages || pages.length === 0) return;

    const sortedIndices: number[] = [];
    if (currentPageIndex >= 0 && currentPageIndex < pages.length) {
      sortedIndices.push(currentPageIndex);
    }
    if (currentPageIndex + 1 < pages.length) {
      sortedIndices.push(currentPageIndex + 1);
    }
    for (let i = 0; i < pages.length; i++) {
      if (!sortedIndices.includes(i)) sortedIndices.push(i);
    }

    const scheduleNext = async () => {
      for (const idx of sortedIndices) {
        const pageText = pages[idx];
        if (!pageText) continue;

        for (const voice of voices) {
          await this.prefetchText(pageText, voice);
        }
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
        scheduleNext();
      });
    } else {
      setTimeout(scheduleNext, 50);
    }
  }

  /**
   * Clean up all cached object URLs on reset.
   */
  public clear(): void {
    for (const item of this.cache.values()) {
      try {
        URL.revokeObjectURL(item.blobUrl);
      } catch {
        // Safe disposal
      }
    }
    this.cache.clear();
    this.inFlight.clear();
  }
}

export const readingAudioPrefetcher = new ReadingAudioPrefetcher();
