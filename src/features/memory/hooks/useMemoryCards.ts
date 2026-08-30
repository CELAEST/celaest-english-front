import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";

export const useMemoryCards = (category?: string) => {
  const queryClient = useQueryClient();
  const cardsKey = QUERY_KEYS.memory.cards(category);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: cardsKey,
    queryFn: () => apiMemoryRepository.getDueCards(category),
    staleTime: 5 * 60 * 1000, // 5 minutes cache deduplication
    refetchOnWindowFocus: false,
  });

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
      queryClient.setQueryData<MemoryCard[]>(cardsKey, (prev) =>
        prev ? prev.filter((c) => c.id !== deletedCardId) : [],
      );
    },
  });

  const reviewCard = async (cardId: string, score: number) => {
    return reviewMutation.mutateAsync({ cardId, score });
  };

  const deleteCard = async (cardId: string) => {
    return deleteMutation.mutateAsync(cardId);
  };

  const safeCards = Array.isArray(cards) ? cards : [];

  return {
    cards: safeCards,
    isLoading,
    reviewCard,
    deleteCard,
  };
};
