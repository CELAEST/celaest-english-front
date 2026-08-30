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
  if (!word || !sentence) return <>{sentence || ""}</>;
  const cleanWord = word.trim();
  if (!cleanWord) return <>{sentence}</>;

  const regex = new RegExp(
    `(${cleanWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "i",
  );
  const parts = sentence.split(regex);

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
};
