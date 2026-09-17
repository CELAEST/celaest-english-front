import React, { useState, useEffect, useRef } from "react";

export interface KineticLuxuryTextProps {
  text: string;
  trigger?: boolean | number;
  className?: string;
  durationMs?: number;
  as?: "span" | "h3" | "p" | "div";
}

const LUXURY_CHARS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LUXURY_CHARS_LOWER = "abcdefghijklmnopqrstuvwxyz";

export const KineticLuxuryText: React.FC<KineticLuxuryTextProps> = ({
  text,
  trigger = false,
  className = "",
  durationMs = 450,
  as: Component = "span",
}) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Clear any previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!text) {
      setDisplayText("");
      return;
    }

    const totalSteps = text.length;
    const intervalTime = Math.max(16, Math.floor(durationMs / (totalSteps * 3)));
    let step = 0;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "." || char === "—" || char === "-") return char;
            // Reveal finalized character progressively from left to right
            if (index < Math.floor(step / 3)) {
              return text[index];
            }
            // Scramble using matching case for luxury feel
            if (char === char.toUpperCase() && char !== char.toLowerCase()) {
              return LUXURY_CHARS_UPPER[Math.floor(Math.random() * LUXURY_CHARS_UPPER.length)];
            }
            return LUXURY_CHARS_LOWER[Math.floor(Math.random() * LUXURY_CHARS_LOWER.length)];
          })
          .join("");
      });

      step++;

      if (step >= totalSteps * 3 + 1) {
        setDisplayText(text);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, intervalTime);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, trigger, durationMs]);

  return <Component className={className}>{displayText}</Component>;
};
