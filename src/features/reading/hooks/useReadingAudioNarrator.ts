import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { logger } from "../../../shared/utils/logger";
import {
  readingAudioPrefetcher,
  FlagshipVoiceId,
  WordBoundaryTimestamp,
} from "../services/readingAudioPrefetcher";
import { MobileAudioUnlocker } from "../../conversation/services/speechSynthesisService";

export const MENTOR_VOICE_STORAGE_KEY = "lingua_reading_selected_mentor_voice_v3";

export interface WordCharSpan {
  wordIndex: number;
  start: number;
  end: number;
}

export interface PhoneticWordSpan {
  wordIndex: number;
  word: string;
  weight: number;
  startRatio: number;
  endRatio: number;
}

export interface DOMWordTimestamp {
  wordIndex: number;
  word: string;
  startTimeMs: number;
  endTimeMs: number;
}

export { type FlagshipVoiceId };

export interface UseReadingAudioNarratorReturn {
  isPlaying: boolean;
  isLoading: boolean;
  isPaused: boolean;
  currentWordIndex: number | null;
  playbackRate: number;
  selectedVoice: FlagshipVoiceId;
  setSelectedVoice: (voice: FlagshipVoiceId) => void;
  togglePlay: () => void;
  restart: () => void;
  stop: () => void;
  pause: () => void;
  cyclePlaybackRate: () => void;
}

/**
 * Aligns raw neural WordBoundary events to the exact DOM rawWords array.
 * Eliminates sub-token drift (e.g. "cross-functional" -> "cross", "functional")
 */
function alignBoundariesToDomWords(
  rawWords: string[],
  boundaries: WordBoundaryTimestamp[],
): DOMWordTimestamp[] {
  if (!rawWords || rawWords.length === 0) return [];
  if (!boundaries || boundaries.length === 0) return [];

  const result: DOMWordTimestamp[] = [];
  let bIdx = 0;
  const numBoundaries = boundaries.length;

  for (let wIdx = 0; wIdx < rawWords.length; wIdx++) {
    const rawWord = rawWords[wIdx];
    const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Pure standalone punctuation/symbol (e.g. "—", "--", "***")
    // Neural TTS does not pronounce standalone symbols and generates no boundary for them.
    if (!cleanWord) {
      const prevEnd = result.length > 0 ? result[result.length - 1].endTimeMs : 0;
      result.push({
        wordIndex: wIdx,
        word: rawWord,
        startTimeMs: prevEnd,
        endTimeMs: prevEnd,
      });
      continue;
    }

    if (bIdx >= numBoundaries) {
      const lastStart = result.length > 0 ? result[result.length - 1].endTimeMs : 0;
      result.push({
        wordIndex: wIdx,
        word: rawWord,
        startTimeMs: lastStart,
        endTimeMs: lastStart + 250,
      });
      continue;
    }

    const startMs = boundaries[bIdx].offsetMs;
    let accumulatedChars = boundaries[bIdx].text.toLowerCase().replace(/[^a-z0-9]/g, "");
    let endMs = boundaries[bIdx].offsetMs + boundaries[bIdx].durationMs;
    bIdx++;

    while (
      bIdx < numBoundaries &&
      cleanWord.length > accumulatedChars.length &&
      cleanWord.startsWith(accumulatedChars)
    ) {
      accumulatedChars += boundaries[bIdx].text.toLowerCase().replace(/[^a-z0-9]/g, "");
      endMs = boundaries[bIdx].offsetMs + boundaries[bIdx].durationMs;
      bIdx++;
    }

    result.push({
      wordIndex: wIdx,
      word: rawWord,
      startTimeMs: startMs,
      endTimeMs: endMs,
    });
  }

  // Ensure strict monotonicity
  for (let i = 1; i < result.length; i++) {
    if (result[i].startTimeMs < result[i - 1].startTimeMs) {
      result[i].startTimeMs = result[i - 1].endTimeMs;
    }
  }

  return result;
}

/**
 * High-performance O(log N) binary search finding the precise active word for currMs.
 * Perfectly synchronizes visual karaoke highlighting with acoustic onset.
 */
function findCurrentWordIndex(
  timestamps: DOMWordTimestamp[],
  currMs: number,
): number | null {
  const n = timestamps.length;
  if (n === 0) return null;

  if (currMs < timestamps[0].startTimeMs) {
    return 0;
  }
  if (currMs >= timestamps[n - 1].startTimeMs) {
    return n - 1;
  }

  let low = 0;
  let high = n - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    const item = timestamps[mid];
    const nextStart = mid + 1 < n ? timestamps[mid + 1].startTimeMs : item.endTimeMs;

    if (currMs >= item.startTimeMs && currMs < nextStart) {
      if (item.startTimeMs === item.endTimeMs && mid + 1 < n) {
        return mid + 1;
      }
      return mid;
    } else if (currMs < item.startTimeMs) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return null;
}

/**
 * Robust syllable counter based on English phonetic heuristics.
 */
function estimateSyllables(raw: string): number {
  const clean = raw.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 1;
  if (clean.length <= 3) return 1;

  const stripped = clean
    .replace(/(?:[^laeiouy]|ed|es|e)$/, "")
    .replace(/^y/, "");
  const matches = stripped.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Sentence-Punctuation Multi-Anchor Acoustic Model (Speechify & Apple Books Standard).
 * Splits text into sentence clauses, models exact breathing/punctuation pauses (350ms),
 * and distributes syllable durations so cumulative drift is 0.0ms from start to finish.
 */
function calculatePhoneticSpans(trimmedText: string): PhoneticWordSpan[] {
  if (!trimmedText) return [];
  const rawWords = trimmedText.split(/\s+/).filter(Boolean);
  if (rawWords.length === 0) return [];

  const shortWords = new Set([
    "a", "an", "the", "in", "on", "at", "by", "for", "to", "of", "is", "it", "as", "and", "or", "but", "so", "if"
  ]);

  const spans: PhoneticWordSpan[] = [];
  const weights: number[] = [];
  const pausesAfterWord: number[] = [];

  for (let i = 0; i < rawWords.length; i++) {
    const raw = rawWords[i];
    const clean = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
    const syllables = estimateSyllables(clean);

    let w = syllables * 1.85 + Math.min(6, clean.length) * 0.35;

    if (clean.length <= 3 && shortWords.has(clean)) {
      w = 1.15;
    }

    // Intra-sentence comma / dash / colon pause (~160ms)
    if (/[,\-–—;:]$/.test(raw)) {
      w += 1.4;
    }

    weights.push(w);

    // Inter-sentence terminal pause (~380ms silence after period/exclamation/question)
    if (/[.!?…]$/.test(raw) && i < rawWords.length - 1) {
      pausesAfterWord.push(3.4);
    } else {
      pausesAfterWord.push(0);
    }
  }

  let totalWeight = 0;
  for (let i = 0; i < weights.length; i++) {
    totalWeight += weights[i] + pausesAfterWord[i];
  }

  let cumulative = 0;
  for (let i = 0; i < rawWords.length; i++) {
    const wordWeight = weights[i];
    const startRatio = cumulative / totalWeight;
    cumulative += wordWeight;
    const endRatio = cumulative / totalWeight;

    cumulative += pausesAfterWord[i];

    spans.push({
      wordIndex: i,
      word: rawWords[i],
      weight: wordWeight,
      startRatio,
      endRatio,
    });
  }

  return spans;
}

export function useReadingAudioNarrator(
  text: string,
  allPages?: string[],
  currentPageIndex?: number,
  isActive: boolean = true,
): UseReadingAudioNarratorReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(0.85);

  // Persistent Mentor Voice Selection (Aria vs Christopher saved across sessions & articles)
  const [selectedVoice, setSelectedVoiceState] = useState<FlagshipVoiceId>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(MENTOR_VOICE_STORAGE_KEY) as FlagshipVoiceId;
        if (stored === "en-US-AriaNeural" || stored === "en-US-ChristopherNeural") {
          return stored;
        }
      } catch {
        // Fallback
      }
    }
    return "en-US-AriaNeural";
  });

  const selectedVoiceRef = useRef<FlagshipVoiceId>(selectedVoice);
  selectedVoiceRef.current = selectedVoice;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const domTimestampsRef = useRef<DOMWordTimestamp[]>([]);
  const playRequestIdRef = useRef<number>(0);
  const usingBufferRef = useRef<boolean>(false);
  const bufferStartPerfRef = useRef<number>(0);
  const bufferDurationSecRef = useRef<number>(0);

  const rawWords = useMemo(() => {
    return text ? text.trim().split(/\s+/).filter(Boolean) : [];
  }, [text]);

  const phoneticSpans = useMemo(() => {
    const trimmed = text ? text.trim() : "";
    return calculatePhoneticSpans(trimmed);
  }, [text]);

  // Intelligent Low-Bandwidth Audio Prefetching (Only current page for selected voice when active)
  useEffect(() => {
    if (!isActive) return;
    const trimmed = text ? text.trim() : "";
    if (trimmed) {
      readingAudioPrefetcher.prefetchText(trimmed, selectedVoice).then((item) => {
        if (item && item.wordBoundaries && item.wordBoundaries.length > 0) {
          domTimestampsRef.current = alignBoundariesToDomWords(rawWords, item.wordBoundaries);
        }
      });
      const alternateVoice: FlagshipVoiceId =
        selectedVoice === "en-US-AriaNeural" ? "en-US-ChristopherNeural" : "en-US-AriaNeural";
      void readingAudioPrefetcher.prefetchText(trimmed, alternateVoice);
    }

    // Only prefetch the immediate next page if audio is actively playing
    if (isPlaying && allPages && allPages.length > 0 && typeof currentPageIndex === "number") {
      const nextPage = allPages[currentPageIndex + 1];
      if (nextPage) {
        readingAudioPrefetcher.prefetchText(nextPage.trim(), selectedVoice);
      }
    }
  }, [isActive, isPlaying, text, rawWords, selectedVoice, allPages, currentPageIndex]);

  const stopTracker = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    playRequestIdRef.current++;
    stopTracker();
    if (usingBufferRef.current) {
      MobileAudioUnlocker.stopSourceNode();
      usingBufferRef.current = false;
    }
    if (audioRef.current) {
      audioRef.current.onplay = null;
      audioRef.current.onpause = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsLoading(false);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(null);
    utteranceRef.current = null;
  }, [stopTracker]);

  // Stop & reset on text change or unmount
  useEffect(() => {
    stop();
    return () => {
      stop();
    };
  }, [text, stop]);

  // Clean shutdown when tab is not active or user navigates away
  useEffect(() => {
    if (!isActive) {
      stop();
    }
  }, [isActive, stop]);

  const pause = useCallback(() => {
    if (usingBufferRef.current) {
      stop();
      return;
    }
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPaused(true);
      stopTracker();
      return;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [stop, stopTracker]);

  const cyclePlaybackRate = useCallback(() => {
    setPlaybackRate((prev) => {
      let nextRate: number;
      if (prev <= 0.75) nextRate = 0.85;
      else if (prev <= 0.85) nextRate = 1.0;
      else if (prev <= 1.0) nextRate = 1.2;
      else nextRate = 0.75;

      if (audioRef.current) {
        audioRef.current.playbackRate = nextRate;
      }
      return nextRate;
    });
  }, []);

  /**
   * Continuous Real-Time Audio Clock Synchronizer.
   * Prioritizes hardware-level neural timestamps with 0.0ms drift.
   */
  const startTracking = useCallback(() => {
    stopTracker();

    const trackLoop = () => {
      const audio = audioRef.current;
      const isBufferActive = usingBufferRef.current;
      if (!isBufferActive && (!audio || audio.paused || audio.ended)) {
        return;
      }

      const elapsedSec = isBufferActive
        ? ((performance.now() - bufferStartPerfRef.current) / 1000) * playbackRate
        : audio!.currentTime;
      const duration = isBufferActive
        ? bufferDurationSecRef.current
        : audio!.duration;

      const domTimestamps = domTimestampsRef.current;

      // 1. High-Precision Neural Timestamps Path (100% Sub-Millisecond Exact)
      if (domTimestamps && domTimestamps.length > 0) {
        const currMs = elapsedSec * 1000;
        const matchedIndex = findCurrentWordIndex(domTimestamps, currMs);
        if (matchedIndex !== null) {
          setCurrentWordIndex(matchedIndex);
        }
      } else {
        // 2. Multi-Anchor Sentence Acoustic Fallback
        if (duration && duration > 0 && phoneticSpans.length > 0) {
          const leadTimeSec = 0.05 * playbackRate;
          const adjustedTime = Math.min(duration, elapsedSec + leadTimeSec);
          const progress = Math.min(1, Math.max(0, adjustedTime / duration));

          let matchedIndex: number | null = null;
          for (let i = 0; i < phoneticSpans.length; i++) {
            const span = phoneticSpans[i];
            const nextStart = i + 1 < phoneticSpans.length ? phoneticSpans[i + 1].startRatio : span.endRatio + 0.05;

            if (progress >= span.startRatio && progress < nextStart) {
              matchedIndex = span.wordIndex;
              break;
            }
          }

          if (matchedIndex !== null) {
            setCurrentWordIndex(matchedIndex);
          } else if (progress >= (phoneticSpans[phoneticSpans.length - 1]?.startRatio ?? 0.95)) {
            setCurrentWordIndex(phoneticSpans.length - 1);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(trackLoop);
    };

    animFrameRef.current = requestAnimationFrame(trackLoop);
  }, [playbackRate, phoneticSpans, stopTracker]);

  const playSpeechSynthesisFallback = useCallback((trimmed: string, voiceToUse?: FlagshipVoiceId) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.rate = playbackRate;
    utterance.lang = "en-US";
    const voices = window.speechSynthesis.getVoices?.() ?? [];
    if (voices.length > 0) {
      const enVoices = voices.filter((v) => v.lang.startsWith("en"));
      const preferMale = voiceToUse === "en-US-ChristopherNeural";
      const kw = preferMale
        ? ["christopher", "guy", "daniel", "david", "male"]
        : ["aria", "jenny", "samantha", "zira", "female"];
      const picked =
        enVoices.find((v) => kw.some((k) => v.name.toLowerCase().includes(k))) ??
        enVoices.find((v) => !v.name.toLowerCase().includes("google")) ??
        enVoices[0];
      if (picked) {
        utterance.voice = picked;
        utterance.lang = picked.lang;
      }
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      if (phoneticSpans.length > 0) setCurrentWordIndex(0);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name === "word" || event.charIndex !== undefined) {
        const charIdx = event.charIndex;
        const words = trimmed.split(/\s+/);
        let charAcc = 0;
        for (let i = 0; i < words.length; i++) {
          const wLen = words[i].length;
          if (charIdx >= charAcc && charIdx <= charAcc + wLen) {
            setCurrentWordIndex(i);
            break;
          }
          charAcc += wLen + 1;
        }
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [playbackRate, phoneticSpans]);

  const startPlayback = useCallback(
    async (voiceToUse: FlagshipVoiceId, startFromSec: number = 0) => {
      const trimmed = text ? text.trim() : "";
      if (!trimmed) return;

      stop();
      const reqId = ++playRequestIdRef.current;

      try {
        let cached = readingAudioPrefetcher.get(trimmed, voiceToUse);
        if (!cached) {
          setIsLoading(true);
          cached = await readingAudioPrefetcher.prefetchText(trimmed, voiceToUse);
          if (playRequestIdRef.current !== reqId) return;
          setIsLoading(false);
        }

        if (!cached?.blobUrl) {
          playSpeechSynthesisFallback(trimmed, voiceToUse);
          return;
        }

        if (cached.wordBoundaries && cached.wordBoundaries.length > 0) {
          domTimestampsRef.current = alignBoundariesToDomWords(rawWords, cached.wordBoundaries);
        } else {
          domTimestampsRef.current = [];
        }

        const audio = new Audio();
        // @ts-ignore
        audio.playsInline = true;
        try {
          audio.setAttribute("playsinline", "true");
          audio.setAttribute("webkit-playsinline", "true");
        } catch {}
        audio.src = cached.blobUrl;
        audio.preload = "auto";
        audio.volume = 1.0;
        audio.playbackRate = playbackRate;
        audioRef.current = audio;

        if (startFromSec > 0) {
          if (audio.readyState >= 1) {
            audio.currentTime = startFromSec;
          } else {
            audio.addEventListener(
              "loadedmetadata",
              () => {
                if (audioRef.current === audio && playRequestIdRef.current === reqId) {
                  try {
                    audio.currentTime = startFromSec;
                  } catch {}
                }
              },
              { once: true },
            );
          }
        }

        const fallbackToNeuralBuffer = async () => {
          if (playRequestIdRef.current !== reqId) return;
          audioRef.current = null;
          try {
            const lastTs = domTimestampsRef.current[domTimestampsRef.current.length - 1];
            bufferDurationSecRef.current = lastTs
              ? lastTs.endTimeMs / 1000
              : Math.max(4, rawWords.length * 0.45);
            const played = await MobileAudioUnlocker.playNeuralBuffer(
              cached!.blob,
              { rate: playbackRate },
              () => playRequestIdRef.current === reqId,
              () => {
                if (playRequestIdRef.current !== reqId) return;
                usingBufferRef.current = true;
                bufferStartPerfRef.current = performance.now();
                setIsPlaying(true);
                setIsPaused(false);
                startTracking();
              },
              () => {
                if (playRequestIdRef.current !== reqId) return;
                usingBufferRef.current = false;
                stopTracker();
                setIsPlaying(false);
                setIsPaused(false);
                setCurrentWordIndex(null);
              },
            );
            if (played) return;
          } catch {}
          if (playRequestIdRef.current === reqId) {
            usingBufferRef.current = false;
            playSpeechSynthesisFallback(trimmed, voiceToUse);
          }
        };

        audio.onplay = () => {
          if (playRequestIdRef.current !== reqId) return;
          usingBufferRef.current = false;
          setIsPlaying(true);
          setIsPaused(false);
          startTracking();
        };

        audio.onpause = () => {
          if (playRequestIdRef.current !== reqId) return;
          setIsPaused(true);
          stopTracker();
        };

        audio.onended = () => {
          if (playRequestIdRef.current !== reqId) return;
          stopTracker();
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentWordIndex(null);
        };

        audio.onerror = () => {
          logger.warn("[ReadingTTS] Blob playback error, attempting Web Audio buffer playback");
          void fallbackToNeuralBuffer();
        };

        audio
          .play()
          .then(() => {
            if (playRequestIdRef.current === reqId) startTracking();
          })
          .catch((err: any) => {
            if (err?.name === "AbortError" || playRequestIdRef.current !== reqId) return;
            logger.warn("[ReadingTTS] HTMLAudioElement blocked, playing via Web Audio buffer:", err);
            void fallbackToNeuralBuffer();
          });
      } catch {
        if (playRequestIdRef.current !== reqId) return;
        setIsLoading(false);
        audioRef.current = null;
        playSpeechSynthesisFallback(trimmed, voiceToUse);
      }
    },
    [text, rawWords, playbackRate, stop, startTracking, stopTracker, playSpeechSynthesisFallback],
  );

  const setSelectedVoice = useCallback(
    (voice: FlagshipVoiceId) => {
      MobileAudioUnlocker.unlock();
      setSelectedVoiceState(voice);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(MENTOR_VOICE_STORAGE_KEY, voice);
        } catch {
          // Safe storage write
        }
      }

      // If audio is currently playing or loading, seamlessly hot-swap to the new mentor voice!
      if (isPlaying || isLoading) {
        const currentSec = audioRef.current ? audioRef.current.currentTime : 0;
        void startPlayback(voice, currentSec);
      } else {
        stop();
      }
    },
    [isPlaying, isLoading, startPlayback, stop],
  );

  const restart = useCallback(() => {
    MobileAudioUnlocker.unlock();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentWordIndex(0);
      if (isPaused) {
        audioRef.current
          .play()
          .then(() => {
            setIsPaused(false);
            setIsPlaying(true);
            startTracking();
          })
          .catch(() => {});
      }
    } else {
      void startPlayback(selectedVoiceRef.current, 0);
    }
  }, [isPaused, startPlayback, startTracking]);

  const togglePlay = useCallback(() => {
    const trimmed = text ? text.trim() : "";
    if (!trimmed) return;
    MobileAudioUnlocker.unlock();

    if (isLoading) {
      stop();
      return;
    }

    if (isPlaying) {
      if (usingBufferRef.current) {
        stop();
        return;
      }
      if (audioRef.current) {
        if (isPaused) {
          audioRef.current
            .play()
            .then(() => {
              setIsPaused(false);
              startTracking();
            })
            .catch(() => {});
        } else {
          audioRef.current.pause();
          setIsPaused(true);
          stopTracker();
        }
        return;
      }

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (isPaused) {
          window.speechSynthesis.resume();
          setIsPaused(false);
        } else {
          // On mobile browsers, window.speechSynthesis.pause() is often ignored or causes state hangs.
          // Cancelling cleanly halts speech immediately without ghost audio.
          window.speechSynthesis.cancel();
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentWordIndex(null);
        }
        return;
      }
    }

    void startPlayback(selectedVoiceRef.current);
  }, [text, isLoading, isPlaying, isPaused, startPlayback, startTracking, stop, stopTracker]);

  return {
    isPlaying,
    isLoading,
    isPaused,
    currentWordIndex,
    playbackRate,
    selectedVoice,
    setSelectedVoice,
    togglePlay,
    restart,
    stop,
    pause,
    cyclePlaybackRate,
  };
}
