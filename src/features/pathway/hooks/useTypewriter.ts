import { useCallback, useEffect, useRef, useState } from "react";

export interface TypewriterState {
  typed: string;
  progress: number;
  isDone: boolean;
  finish: () => void;
}

/**
 * Reveals `text` progressively. Restarts whenever `text` changes.
 * `charsPerSecond` can be lowered while the professor speaks so the writing keeps pace with the voice.
 */
export function useTypewriter(text: string, charsPerSecond: number): TypewriterState {
  const [count, setCount] = useState(0);
  const speedRef = useRef(charsPerSecond);
  speedRef.current = charsPerSecond;

  useEffect(() => {
    setCount(0);
    if (!text) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      acc += ((now - last) / 1000) * speedRef.current;
      last = now;
      const step = Math.floor(acc);
      if (step > 0) {
        acc -= step;
        setCount((c) => Math.min(text.length, c + step));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  const finish = useCallback(() => setCount(text.length), [text]);
  const isDone = count >= text.length;

  return {
    typed: text.slice(0, count),
    progress: text.length ? count / text.length : 1,
    isDone,
    finish,
  };
}
