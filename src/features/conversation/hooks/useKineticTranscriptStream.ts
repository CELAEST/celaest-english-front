/**
 * Progressive Word-by-Word Reveal Hook for Live Speech Dictation
 * Smooths incoming chunked AI transcripts into a fluid ~28ms/word cadence while actively listening,
 * snapping synchronously (0ms delay) on stop, submit, clear, or manual keyboard edits.
 */

import { useEffect, useRef, useState } from "react";

const WORD_REVEAL_INTERVAL_MS = 28;

export function useKineticTranscriptStream(
  targetTranscript: string,
  isListening: boolean,
): string {
  const [displayedText, setDisplayedText] = useState<string>(targetTranscript);
  const displayedRef = useRef<string>(targetTranscript);

  useEffect(() => {
    // Instant synchronous snap when not recording, cleared, or shortened by manual backspace
    if (!isListening || !targetTranscript || targetTranscript.length <= displayedRef.current.length) {
      displayedRef.current = targetTranscript;
      setDisplayedText(targetTranscript);
      return;
    }

    const current = displayedRef.current;
    // If prefix changed slightly due to boundary normalization, snap cleanly up to common word prefix
    if (current && !targetTranscript.startsWith(current)) {
      const currentWords = current.split(/\s+/);
      const targetWords = targetTranscript.split(/\s+/);
      let commonCount = 0;
      const minLen = Math.min(currentWords.length, targetWords.length);
      while (commonCount < minLen && currentWords[commonCount] === targetWords[commonCount]) {
        commonCount += 1;
      }
      const alignedPrefix = targetWords.slice(0, Math.max(commonCount, currentWords.length - 1)).join(" ");
      displayedRef.current = alignedPrefix;
      setDisplayedText(alignedPrefix);
    }

    const timer = setInterval(() => {
      const shown = displayedRef.current;
      if (shown.length >= targetTranscript.length) {
        clearInterval(timer);
        return;
      }

      const remaining = targetTranscript.slice(shown.length);
      const nextWordMatch = remaining.match(/^\s*\S+/);
      const nextSlice = nextWordMatch ? nextWordMatch[0] : remaining;
      const updated = shown + nextSlice;
      displayedRef.current = updated;
      setDisplayedText(updated);

      if (updated.length >= targetTranscript.length) {
        clearInterval(timer);
      }
    }, WORD_REVEAL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [targetTranscript, isListening]);

  return isListening ? displayedText : targetTranscript;
}
