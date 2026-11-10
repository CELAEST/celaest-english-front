import { useState, useEffect, useCallback } from "react";
import { PathwayNode } from "../../../domain/entities/LearningPathway";
import { PathwayQAService, ProfessorAnswer } from "../services/PathwayQAService";

export interface PathwayChatMessage {
  id: string;
  sender: "user" | "liam";
  timestamp: number;
  text?: string;
  answer?: ProfessorAnswer;
}

export function usePathwayBaseChat(node?: PathwayNode | undefined) {
  const nodeId = node?.id ?? "default_base";
  const storageKey = `celaest_pathway_chat_${nodeId}`;

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
    async (questionText: string) => {
      const trimmed = questionText.trim();
      if (!trimmed || isSubmitting || !node) return;

      const userMsg: PathwayChatMessage = {
        id: `u_${Date.now()}`,
        sender: "user",
        timestamp: Date.now(),
        text: trimmed,
      };

      const updatedWithUser = [...messages, userMsg];
      persistMessages(updatedWithUser);
      setIsSubmitting(true);

      try {
        const answer = await PathwayQAService.askProfessor({
          question: trimmed,
          node,
        });

        const liamMsg: PathwayChatMessage = {
          id: `l_${Date.now()}`,
          sender: "liam",
          timestamp: Date.now(),
          answer,
        };

        persistMessages([...updatedWithUser, liamMsg]);
      } catch {
        const fallbackMsg: PathwayChatMessage = {
          id: `l_${Date.now()}`,
          sender: "liam",
          timestamp: Date.now(),
          text: `En esta lección "${node.title}", enfócate en la regla central. Intenta formular tu pregunta nuevamente.`,
        };
        persistMessages([...updatedWithUser, fallbackMsg]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [node, isSubmitting, messages, persistMessages],
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

