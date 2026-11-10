import React, { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { PathwayNode } from "../../../../../domain/entities/LearningPathway";
import { usePathwayBaseChat } from "../../../hooks/usePathwayBaseChat";
import { PathwayChatMessageBubble } from "./PathwayChatMessageBubble";
import { PathwayChatInputBar } from "./PathwayChatInputBar";

interface LessonBoardChatModeProps {
  node?: PathwayNode | undefined;
  baseCode: string;
  suggestedQuestions?: string[] | undefined;
  onClose: () => void;
  onThinkingChange?: ((isThinking: boolean) => void) | undefined;
}

export const LessonBoardChatMode: React.FC<LessonBoardChatModeProps> = ({
  node,
  baseCode,
  suggestedQuestions,
  onClose,
  onThinkingChange,
}) => {
  const { messages, isSubmitting, askQuestion, clearChat } = usePathwayBaseChat(node);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  // Sync thinking state with professor 3D avatar
  useEffect(() => {
    onThinkingChange?.(isSubmitting);
  }, [isSubmitting, onThinkingChange]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitting]);

  const hasMessages = messages.length > 0;
  const chips = suggestedQuestions && suggestedQuestions.length > 0 ? suggestedQuestions : [
    "¿Por qué en español decimos diferente?",
    "¿Cuál es el error más común?",
    "Dame otro ejemplo práctico",
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden select-none">
      {/* 1. Pinned Header (Strictly fixed at top, never scrolls or disappears) */}
      <div className="shrink-0 flex items-start justify-between pb-2 border-b border-white/[0.06]">
        <div>
          <div className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-[#A27FF3]">
            BASE {baseCode} · CONSULTA CON LIAM
          </div>
          <h3 className="text-[13.5px] sm:text-[14px] font-medium text-white tracking-tight mt-0.5">
            Dudas de la Lección
          </h3>
        </div>

        <div className="flex items-center gap-2 pt-0.5 shrink-0">
          {hasMessages && (
            <button
              type="button"
              onClick={clearChat}
              className="text-white/30 hover:text-rose-400 p-1 transition-colors cursor-pointer"
              title="Limpiar dudas de esta base"
            >
              <Trash2 size={12} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors cursor-pointer pb-0.5"
            title="Volver a la lección"
          >
            Clase ✕
          </button>
        </div>
      </div>

      {/* 2. Messages Container (The ONLY scrolling container in the card) */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-0.5 py-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {!hasMessages ? (
          <div className="flex flex-col gap-2.5 py-1">
            <p className="text-xs text-white/75 leading-relaxed font-light">
              Estoy aquí para resolver cualquier duda sobre esta base. Escribe tu pregunta abajo o toca una sugerencia:
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-white/35">
                Sugerencias para esta regla
              </span>
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => askQuestion(chip)}
                  className="group w-full text-left flex items-baseline gap-2 py-1 text-xs text-white/55 hover:text-white transition-colors cursor-pointer"
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
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <PathwayChatMessageBubble key={msg.id} message={msg} />
            ))}

            {/* Thinking Indicator */}
            {isSubmitting && (
              <div className="text-[11px] text-[#A27FF3] italic font-light py-1 animate-pulse">
                Liam está estructurando la explicación...
              </div>
            )}
            <div ref={scrollEndRef} />
          </>
        )}
      </div>

      {/* 3. Pinned Input Bar (Fixed at bottom, ALWAYS 100% visible, never cut off) */}
      <div className="shrink-0 pt-1.5">
        <PathwayChatInputBar
          isSubmitting={isSubmitting}
          onSubmit={askQuestion}
          showChips={false}
          variant="railZeroBox"
        />
      </div>
    </div>
  );
};
