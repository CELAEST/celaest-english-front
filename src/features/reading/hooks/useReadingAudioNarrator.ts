import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { logger } from "../../../shared/utils/logger";

export interface WordCharSpan {
  wordIndex: number;
  start: number;
  end: number;
}

export interface UseReadingAudioNarratorReturn {
  isPlaying: boolean;
  isPaused: boolean;
  currentWordIndex: number | null;
  playbackRate: number;
  togglePlay: () => void;
  stop: () => void;
  cyclePlaybackRate: () => void;
}

export function useReadingAudioNarrator(text: string): UseReadingAudioNarratorReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  // Default to 0.85x (clear, comfortable ESL cadence for learners)
  const [playbackRate, setPlaybackRate] = useState<number>(0.85);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<string[]>([]);

  // Tokenize words and map character offsets
  const wordSpans = useMemo<WordCharSpan[]>(() => {
    const trimmed = text ? text.trim() : "";
    if (!trimmed) return [];
    const spans: WordCharSpan[] = [];
    const regex = /\S+/g;
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = regex.exec(trimmed)) !== null) {
      spans.push({
        wordIndex: idx++,
        start: match.index,
        end: match.index + match[0].length,
      });
    }
    wordsRef.current = trimmed.split(/\s+/).filter(Boolean);
    return spans;
  }, [text]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(null);
    utteranceRef.current = null;
  }, []);

  // Stop when text changes or on unmount
  useEffect(() => {
    stop();
    return () => {
      stop();
    };
  }, [text, stop]);

  const cyclePlaybackRate = useCallback(() => {
    setPlaybackRate((prev) => {
      if (prev <= 0.75) return 0.85; // 0.75x (slow/clear) -> 0.85x (comfortable ESL)
      if (prev <= 0.85) return 1.0;  // 0.85x -> 1.0x (standard)
      if (prev <= 1.0) return 1.2;   // 1.0x -> 1.2x (fast)
      return 0.75;                   // 1.2x -> 0.75x (slow)
    });
  }, []);

  const togglePlay = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      logger.warn("SpeechSynthesis not supported on this device.");
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.rate = playbackRate;
    utterance.lang = "en-US";

    const voices = (window.speechSynthesis.getVoices?.() || []) as SpeechSynthesisVoice[];
    const naturalVoice = voices.find(
      (v) => v?.lang?.startsWith("en-") && (v.name?.includes("Google") || v.name?.includes("Natural") || v.name?.includes("Samantha")),
    ) || voices.find((v) => v?.lang?.startsWith("en-"));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name === "word" || event.charIndex !== undefined) {
        const charIdx = event.charIndex;
        const matched = wordSpans.find((span) => charIdx >= span.start && charIdx <= span.end);
        if (matched) {
          setCurrentWordIndex(matched.wordIndex);
        }
      }
    };

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      if (wordSpans.length > 0) setCurrentWordIndex(0);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(null);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(null);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isPlaying, isPaused, text, playbackRate, wordSpans]);

  return {
    isPlaying,
    isPaused,
    currentWordIndex,
    playbackRate,
    togglePlay,
    stop,
    cyclePlaybackRate,
  };
}
