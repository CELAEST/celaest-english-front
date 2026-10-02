import { useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";

export const useMemoryCards = (category?: string) => {
  const queryClient = useQueryClient();
  const currentUserId = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;
  const cardsKey = QUERY_KEYS.memory.cards(category, currentUserId);

  const { data: cards = [], isLoading, refetch } = useQuery({
    queryKey: cardsKey,
    queryFn: () => apiMemoryRepository.getDueCards(category),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  // Zero-Reload Cross-Feature Sync: Listen for global memory changes across features
  useEffect(() => {
    const handleMemoryUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ action?: string }>;
      // Ignore 'reviewed' actions: in-place review card states are already handled via setQueryData to avoid mutating deck indices mid-session
      if (customEvent.detail?.action === "reviewed") {
        return;
      }
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memory.all });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("celaest:memory-updated", handleMemoryUpdated);
      return () => {
        window.removeEventListener("celaest:memory-updated", handleMemoryUpdated);
      };
    }
  }, [queryClient]);

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, score }: { cardId: string; score: number }) =>
      apiMemoryRepository.reviewCard(cardId, score),
    onSuccess: (updatedCard) => {
      queryClient.setQueryData<MemoryCard[]>(cardsKey, (prev) =>
        prev ? prev.map((c) => (c.id === updatedCard.id ? updatedCard : c)) : [updatedCard],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cardId: string) => apiMemoryRepository.deleteCard(cardId),
    onSuccess: (_, deletedCardId) => {
      queryClient.setQueriesData<MemoryCard[]>(
        { queryKey: QUERY_KEYS.memory.all },
        (prev) => (prev ? prev.filter((c) => c.id !== deletedCardId) : []),
      );
    },
  });

  const { mutateAsync: mutateReview } = reviewMutation;
  const { mutateAsync: mutateDelete } = deleteMutation;

  const reviewCard = useCallback(
    async (cardId: string, score: number) => {
      return mutateReview({ cardId, score });
    },
    [mutateReview],
  );

  const deleteCard = useCallback(
    async (cardId: string) => {
      return mutateDelete(cardId);
    },
    [mutateDelete],
  );

  const safeCards = Array.isArray(cards) ? cards : [];

  return {
    cards: safeCards,
    isLoading,
    reviewCard,
    deleteCard,
    refetch,
  };
};
