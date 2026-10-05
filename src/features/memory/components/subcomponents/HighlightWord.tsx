import React from "react";

interface HighlightWordProps {
  sentence?: string;
  word?: string;
  color: string;
}

export const HighlightWord: React.FC<HighlightWordProps> = ({
  sentence = "",
  word = "",
  color,
}) => {
  const safeSentence = typeof sentence === "string" ? sentence : String(sentence || "");
  const safeWord = typeof word === "string" ? word : String(word || "");

  if (!safeWord.trim() || !safeSentence.trim()) return <>{safeSentence}</>;
  const cleanWord = safeWord.trim();

  try {
    const escaped = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "i");
    const parts = safeSentence.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === cleanWord.toLowerCase() ? (
            <span key={i} className="relative font-semibold" style={{ color }}>
              {part}
              <span
                className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full"
                style={{ backgroundColor: `${color}cc` }}
              />
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
  } catch {
    return <>{safeSentence}</>;
  }
};
