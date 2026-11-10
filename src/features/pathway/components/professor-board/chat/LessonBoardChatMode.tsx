import React, { useEffect, useRef } from "react";
import { Sparkles, Trash2, X } from "lucide-react";
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
    <div className="flex flex-col gap-2 min-h-[220px] max-h-[460px] animate-[fadeIn_0.2s_ease-out_both] select-none">
      {/* 1. Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C4B2F7] flex items-center gap-1.5">
            <Sparkles size={11} className="text-[#A27FF3]" />
            <span>Base {baseCode} · Dudas Centralizadas</span>
          </div>
          <h3 className="text-sm font-medium text-white truncate mt-0.5">
            Consulta con Liam
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasMessages && (
            <button
              type="button"
              onClick={clearChat}
              className="text-white/35 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
              title="Limpiar dudas de esta base"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-mono text-white/70 hover:text-white transition-all cursor-pointer"
            title="Volver a la lección"
          >
            <span>Clase</span>
            <X size={12} />
          </button>
        </div>
      </div>

      {/* 2. Messages Container */}
      <div className="flex-1 min-h-[140px] max-h-[280px] sm:max-h-[300px] overflow-y-auto space-y-3 px-1 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {!hasMessages ? (
          <div className="flex flex-col gap-2.5 py-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white/80 leading-relaxed font-light">
              <span className="font-medium text-[#A27FF3] block mb-1">
                ¿Qué duda tienes sobre esta base?
              </span>
              Pregúntame cualquier inquietud sobre la regla, la trampa o los ejemplos. Tus consultas quedarán guardadas aquí para repasar siempre que vuelvas.
            </div>
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

            {/* Thinking Indicator */}
            {isSubmitting && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-white/60 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] animate-ping" />
                <span className="font-light text-[11.5px]">Liam está preparando una explicación clara...</span>
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
          showChips={false}
        />
      )}
    </div>
  );
};
