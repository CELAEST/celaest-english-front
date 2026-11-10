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

  return (
    <div className="flex flex-col gap-2 min-h-[200px] max-h-[460px] animate-[fadeIn_0.2s_ease-out_both] select-none">
      {/* 1. Header (Exact Match of LessonBoardHeader) */}
      <div className="flex items-start justify-between pb-1.5 border-b border-white/[0.05]">
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

      {/* 2. Messages Container (Editorial Flow) */}
      <div className="flex-1 min-h-[130px] max-h-[260px] sm:max-h-[290px] overflow-y-auto space-y-3 px-0.5 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {!hasMessages ? (
          <div className="flex flex-col gap-2 py-1">
            <p className="text-xs text-white/75 leading-relaxed font-light">
              Estoy aquí para resolver cualquier duda sobre esta base. Escribe tu pregunta abajo o toca una sugerencia:
            </p>
            <PathwayChatInputBar
              isSubmitting={isSubmitting}
              onSubmit={askQuestion}
              suggestedQuestions={suggestedQuestions}
              showChips
            />
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <PathwayChatMessageBubble key={msg.id} message={msg} />
            ))}

            {/* Thinking Indicator (Subtle, No Loud Boxes) */}
            {isSubmitting && (
              <div className="text-[11px] text-[#A27FF3] italic font-light py-1 animate-pulse">
                Liam está estructurando la explicación...
              </div>
            )}
            <div ref={scrollEndRef} />
          </>
        )}
      </div>

      {/* 3. Input Bar (when messages exist) */}
      {hasMessages && (
        <PathwayChatInputBar
          isSubmitting={isSubmitting}
          onSubmit={askQuestion}
          suggestedQuestions={suggestedQuestions}
          showChips={messages.length < 3}
        />
      )}
    </div>
  );
};
