import React from "react";

export interface HighlightedSentenceProps {
  text: string;
  highlight?: string | undefined;
  className?: string;
}

/** Renders `text` marking the first case-insensitive occurrence of `highlight`. */
export const HighlightedSentence: React.FC<HighlightedSentenceProps> = ({ text, highlight, className = "" }) => {
  const idx = highlight ? text.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (!highlight || idx < 0) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {text.slice(0, idx)}
      <span className="text-[#C4B5FD] font-medium underline decoration-[#A78BFA]/60 underline-offset-4">
        {text.slice(idx, idx + highlight.length)}
      </span>
      {text.slice(idx + highlight.length)}
    </span>
  );
};

