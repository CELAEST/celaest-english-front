import React, { useState } from "react";
import { ArrowUp } from "lucide-react";

interface PathwayChatInputBarProps {
  isSubmitting: boolean;
  onSubmit: (question: string) => void;
  suggestedQuestions?: string[] | undefined;
  showChips?: boolean | undefined;
}

const DEFAULT_CHIPS = [
  "¿Por qué en español decimos diferente?",
  "¿Cuál es el error más común?",
  "Dame otro ejemplo práctico",
];

export const PathwayChatInputBar: React.FC<PathwayChatInputBarProps> = ({
  isSubmitting,
  onSubmit,
  suggestedQuestions,
  showChips = false,
}) => {
  const [text, setText] = useState("");
  const chips = suggestedQuestions && suggestedQuestions.length > 0 ? suggestedQuestions : DEFAULT_CHIPS;

  const handleSubmit = (val?: string) => {
    const q = (val || text).trim();
    if (!q || isSubmitting) return;
    setText("");
    onSubmit(q);
  };

  return (
    <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/[0.05] select-none">
      {/* Suggested question chips (clean text links with subtle arrow) */}
      {showChips && (
        <div className="flex flex-col gap-0.5 pb-0.5">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleSubmit(chip)}
              className="group w-full text-left flex items-baseline gap-1.5 py-0.5 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <span className="text-[#A27FF3] text-[10px] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                →
              </span>
              <span className="truncate font-light underline underline-offset-2 decoration-white/20 group-hover:decoration-white/60">
                {chip}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu duda sobre esta regla..."
          disabled={isSubmitting}
          autoFocus
          className="w-full h-7.5 pl-2.5 pr-8 rounded-md bg-white/[0.03] border border-white/[0.08] focus:border-[#A27FF3]/60 text-xs text-white placeholder-white/25 focus:outline-none transition-all font-light"
        />
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className="absolute right-1 w-5.5 h-5.5 rounded bg-white text-black flex items-center justify-center hover:bg-white/90 disabled:opacity-20 transition-all cursor-pointer shadow-sm"
          title="Enviar pregunta"
        >
          {isSubmitting ? (
            <span className="w-2.5 h-2.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp size={11} strokeWidth={2.5} />
          )}
        </button>
      </form>
    </div>
  );
};
