import React from "react";

interface LessonTypedTextProps {
  fullText: string;
  typedText: string;
  isTyping: boolean;
  onClick: () => void;
}

// English examples between “ ” and pronunciation guides between [ ] stand out like chalk underlines.
const TOKEN = /(“[^”]*”?|\[[^\]]*\]?)/g;

const renderChalk = (text: string): React.ReactNode[] =>
  text.split(TOKEN).map((part, i) => {
    if (part.startsWith("“")) {
      return (
        <span key={i} className="text-white font-medium underline decoration-white/25 underline-offset-4">
          {part}
        </span>
      );
    }
    if (part.startsWith("[")) {
      return (
        <span key={i} className="font-mono text-[12px] text-[#C4B2F7]">
          {part}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });

/**
 * The full text is rendered invisibly underneath so the board keeps a stable height
 * while the visible copy writes itself in, line by line.
 */
export const LessonTypedText: React.FC<LessonTypedTextProps> = ({ fullText, typedText, isTyping, onClick }) => (
  <div className="grid cursor-pointer" onClick={onClick} aria-live="polite">
    <p aria-hidden className="invisible col-start-1 row-start-1 text-[13px] leading-[1.7] font-light">
      {fullText}
    </p>
    <p className="col-start-1 row-start-1 text-[13px] leading-[1.7] font-light text-white/75">
      {renderChalk(typedText)}
      {isTyping && <span className="ml-0.5 inline-block h-[14px] w-[1.5px] translate-y-[2px] animate-pulse bg-[#A27FF3]" />}
    </p>
  </div>
);
