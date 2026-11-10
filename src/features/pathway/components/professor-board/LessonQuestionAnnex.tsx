import React, { useState } from "react";
import { ArrowUp, Sparkles, X } from "lucide-react";

interface LessonQuestionAnnexProps {
  isSubmitting: boolean; onClose: () => void;
  onSubmit: (question: string) => Promise<void>;
  suggestedQuestions?: string[] | undefined;
}

const DEFAULT_CHIPS = [
  "¿Por qué en español decimos diferente?",
  "¿Cuál es el error más común?",
  "Dame otro ejemplo práctico",
];

export const LessonQuestionAnnex: React.FC<LessonQuestionAnnexProps> = ({
  isSubmitting, onClose, onSubmit, suggestedQuestions,
}) => {
  const [text, setText] = useState("");
  const chips = suggestedQuestions && suggestedQuestions.length > 0 ? suggestedQuestions : DEFAULT_CHIPS;

  const handleSubmit = (val?: string) => {
    const q = (val || text).trim();
    if (!q || isSubmitting) return;
    setText("");
    void onSubmit(q);
  };

  return (
    <div className="flex flex-col gap-2 pt-2.5 border-t border-white/[0.08] animate-[fadeIn_0.2s_ease-out_both] select-none">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#C4B2F7]">
        <span className="inline-flex items-center gap-1.5"><Sparkles size={11} /> Pregunta al Profesor</span>
        <button type="button" onClick={onClose} className="text-white/40 hover:text-white transition-colors cursor-pointer" title="Cerrar pregunta">
          <X size={13} />
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="group relative flex items-center gap-2.5 px-3.5 h-10 rounded-full bg-white/[0.03] border border-white/[0.12] focus-within:border-[#A27FF3]/70 focus-within:bg-white/[0.05] focus-within:shadow-[0_0_16px_rgba(162,127,243,0.18)] transition-all duration-200"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu duda sobre esta regla..."
          disabled={isSubmitting}
          autoFocus
          className="flex-1 min-w-0 bg-transparent border-none text-[12.5px] text-white placeholder-white/35 font-light focus:outline-none tracking-normal"
        />
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            text.trim() && !isSubmitting
              ? "bg-[#A27FF3] text-white shadow-[0_0_12px_rgba(162,127,243,0.45)] hover:bg-[#8B5CF6] hover:scale-105 active:scale-95 cursor-pointer"
              : "bg-white/[0.04] text-white/20 border border-white/[0.06] cursor-not-allowed"
          }`}
          title="Enviar pregunta"
        >
          {isSubmitting ? (
            <span className="w-2.5 h-2.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp size={12} strokeWidth={2.4} />
          )}
        </button>
      </form>

      {/* Suggested Questions — Pure Typography List (Zero Boxes) */}
      <div className="flex flex-col gap-0.5 pt-0.5">
        {chips.map((chip) => (
          <button
            key={chip} type="button" onClick={() => handleSubmit(chip)}
            className="group w-full text-left flex items-baseline gap-2 py-0.5 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-[#A27FF3] text-[10px] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</span>
            <span className="truncate font-light">{chip}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
