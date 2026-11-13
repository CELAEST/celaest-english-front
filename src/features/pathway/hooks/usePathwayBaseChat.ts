import { useState, useEffect, useCallback, useRef } from "react";
import { PathwayNode } from "../../../domain/entities/LearningPathway";
import { PathwayQAService, ProfessorAnswer } from "../services/PathwayQAService";

export interface PathwayChatMessage {
  id: string;
  sender: "user" | "liam";
  timestamp: number;
  text?: string;
  answer?: ProfessorAnswer;
}

export interface UsePathwayBaseChatOptions {
  cefrLevel?: string | undefined;
  onAiError?: ((err: unknown, retryFn: () => void, previewText?: string) => void) | undefined;
}

export function usePathwayBaseChat(
  node?: PathwayNode | undefined,
  options?: UsePathwayBaseChatOptions,
) {
  const nodeId = node?.id ?? "default_base";
  const storageKey = `celaest_pathway_chat_${nodeId}`;
  const cefrLevel = options?.cefrLevel;
  const onAiError = options?.onAiError;

  const [messages, setMessages] = useState<PathwayChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored) as PathwayChatMessage[];
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesRef = useRef<PathwayChatMessage[]>(messages);
  messagesRef.current = messages;

  // Sync when node changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`celaest_pathway_chat_${nodeId}`);
      if (stored) {
        setMessages(JSON.parse(stored) as PathwayChatMessage[]);
        return;
      }
    } catch {
      // ignore
    }
    setMessages([]);
  }, [nodeId]);

  // Persist to localStorage
  const persistMessages = useCallback(
    (newMessages: PathwayChatMessage[]) => {
      setMessages(newMessages);
      try {
        if (newMessages.length > 0) {
          localStorage.setItem(`celaest_pathway_chat_${nodeId}`, JSON.stringify(newMessages));
        } else {
          localStorage.removeItem(`celaest_pathway_chat_${nodeId}`);
        }
      } catch {
        // ignore
      }
    },
    [nodeId],
  );

  const askQuestion = useCallback(
    async (questionText: string, askOpts?: { skipAppendUser?: boolean }) => {
      const trimmed = questionText.trim();
      if (!trimmed || isSubmitting || !node) return;

      const updatedWithUser = askOpts?.skipAppendUser
        ? messagesRef.current
        : [
            ...messagesRef.current,
            {
              id: `u_${Date.now()}`,
              sender: "user" as const,
              timestamp: Date.now(),
              text: trimmed,
            },
          ];
      if (!askOpts?.skipAppendUser) {
        persistMessages(updatedWithUser);
      }
      setIsSubmitting(true);

      try {
        const answer = await PathwayQAService.askProfessor({
          question: trimmed,
          node,
          cefrLevel,
        });

        const liamMsg: PathwayChatMessage = {
          id: `l_${Date.now()}`,
          sender: "liam",
          timestamp: Date.now(),
          answer,
        };

        persistMessages([...updatedWithUser, liamMsg]);
      } catch (err) {
        if (onAiError) {
          onAiError(
            err,
            () => {
              void askQuestion(trimmed, { skipAppendUser: true });
            },
            trimmed,
          );
        } else {
          const errorNotice: PathwayChatMessage = {
            id: `l_${Date.now()}`,
            sender: "liam",
            timestamp: Date.now(),
            text: "No se pudo conectar con el motor de IA en este momento. Configura tu clave o reintenta en un segundo.",
          };
          persistMessages([...updatedWithUser, errorNotice]);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [node, cefrLevel, isSubmitting, onAiError, persistMessages],
  );

  const clearChat = useCallback(() => {
    persistMessages([]);
  }, [persistMessages]);

  return {
    messages,
    isSubmitting,
    askQuestion,
    clearChat,
  };
}

