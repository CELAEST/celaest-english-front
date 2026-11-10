import React, { useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

export type PathwayChatInputVariant = "railZeroBox" | "glassCapsule" | "ambientHalo";

export interface PathwayChatInputBarProps {
  isSubmitting: boolean;
  onSubmit: (question: string) => void;
  suggestedQuestions?: string[] | undefined;
  showChips?: boolean | undefined;
  placeholder?: string | undefined;
  variant?: PathwayChatInputVariant | undefined;
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
  placeholder = "Escribe tu duda sobre esta regla...",
  variant = "railZeroBox",
}) => {
  const [text, setText] = useState("");
  const chips = suggestedQuestions && suggestedQuestions.length > 0 ? suggestedQuestions : DEFAULT_CHIPS;

  const handleSubmit = (val?: string) => {
    const q = (val || text).trim();
    if (!q || isSubmitting) return;
    setText("");
    onSubmit(q);
  };

  const hasText = Boolean(text.trim());

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06] select-none">
      {/* Suggested question chips (clean text links with subtle arrow) */}
      {showChips && (
        <div className="flex flex-col gap-1 pb-0.5">
          <div className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-white/35 flex items-center gap-1.5 pt-0.5">
            <span>Sugerencias para esta regla</span>
          </div>
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleSubmit(chip)}
              className="group w-full text-left flex items-baseline gap-2 py-0.5 text-xs text-white/55 hover:text-white transition-colors cursor-pointer"
            >
              <span className="text-[#A27FF3] text-[10px] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                →
              </span>
              <span className="truncate font-light underline underline-offset-2 decoration-white/15 group-hover:decoration-white/50">
                {chip}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Input Bar — Variant 1: Rail Linear (Zero-Box Puro — Sin Cajas) */}
      {variant === "railZeroBox" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="group relative flex items-center gap-2.5 pb-2 pt-1 border-b border-white/[0.12] focus-within:border-[#A27FF3] transition-colors duration-200"
        >
          <div className="flex items-center gap-1.5 shrink-0 text-[#A27FF3]/75 group-focus-within:text-[#A27FF3] transition-colors">
            <Sparkles size={13} />
            <span className="hidden sm:inline font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/40 group-focus-within:text-[#DDD6FE] transition-colors">
              Liam
            </span>
          </div>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            disabled={isSubmitting}
            autoFocus
            className="flex-1 min-w-0 bg-transparent border-none text-[12.5px] sm:text-[13px] text-white placeholder-white/35 font-light focus:outline-none tracking-normal"
          />

          <button
            type="submit"
            disabled={!hasText || isSubmitting}
            className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              hasText && !isSubmitting
                ? "bg-[#A27FF3] text-white shadow-[0_0_14px_rgba(162,127,243,0.45)] hover:bg-[#8B5CF6] hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-white/[0.04] text-white/20 border border-white/[0.06] cursor-not-allowed"
            }`}
            title="Enviar pregunta a Liam"
          >
            {isSubmitting ? (
              <span className="w-2.5 h-2.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp size={12} strokeWidth={2.4} />
            )}
          </button>
        </form>
      )}

      {/* Input Bar — Variant 2: Quiet Luxury Glass Capsule (Linear / Raycast) */}
      {variant === "glassCapsule" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="group relative flex items-center gap-2.5 px-3 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.055] backdrop-blur-xl border border-white/[0.09] focus-within:border-[#A27FF3]/70 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_20px_rgba(162,127,243,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-200"
        >
          <Sparkles size={13} className="text-[#A27FF3] shrink-0 opacity-70 group-focus-within:opacity-100 transition-opacity" />

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            disabled={isSubmitting}
            autoFocus
            className="flex-1 min-w-0 bg-transparent border-none text-xs sm:text-[12.5px] text-white placeholder-white/35 font-light focus:outline-none"
          />

          <button
            type="submit"
            disabled={!hasText || isSubmitting}
            className={`shrink-0 w-6.5 h-6.5 rounded-lg flex items-center justify-center transition-all duration-200 ${
              hasText && !isSubmitting
                ? "bg-[#A27FF3] text-white shadow-[0_0_12px_rgba(162,127,243,0.45)] hover:bg-[#8B5CF6] hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-white/[0.04] text-white/20 border border-white/[0.05] cursor-not-allowed"
            }`}
            title="Enviar pregunta a Liam"
          >
            {isSubmitting ? (
              <span className="w-2.5 h-2.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp size={12} strokeWidth={2.4} />
            )}
          </button>
        </form>
      )}

      {/* Input Bar — Variant 3: Ambient Obsidian Halo (Apple Intelligence) */}
      {variant === "ambientHalo" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="group relative flex items-center gap-2.5 px-3.5 h-10 rounded-2xl bg-black/50 border border-white/[0.07] hover:border-white/[0.12] focus-within:border-[#A27FF3]/70 focus-within:shadow-[0_0_20px_rgba(162,127,243,0.22)] transition-all duration-200"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] shadow-[0_0_8px_#A27FF3] shrink-0" />

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            disabled={isSubmitting}
            autoFocus
            className="flex-1 min-w-0 bg-transparent border-none text-xs text-white placeholder-white/35 font-light focus:outline-none"
          />

          <span className="hidden sm:inline font-mono text-[9px] text-white/25 border border-white/10 px-1.5 py-0.5 rounded">
            ↵
          </span>

          <button
            type="submit"
            disabled={!hasText || isSubmitting}
            className={`shrink-0 w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all duration-200 ${
              hasText && !isSubmitting
                ? "bg-[#A27FF3] text-white shadow-[0_0_12px_rgba(162,127,243,0.45)] cursor-pointer"
                : "bg-white/[0.03] text-white/20 cursor-not-allowed"
            }`}
            title="Enviar pregunta a Liam"
          >
            {isSubmitting ? (
              <span className="w-2.5 h-2.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp size={11} strokeWidth={2.2} />
            )}
          </button>
        </form>
      )}
    </div>
  );
};
