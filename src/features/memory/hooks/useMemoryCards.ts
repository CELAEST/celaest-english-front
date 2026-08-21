import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";

export const useMemoryCards = () => {
  const queryClient = useQueryClient();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.memory.cards(),
    queryFn: () => apiMemoryRepository.getDueCards(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache deduplication
    refetchOnWindowFocus: false,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, score }: { cardId: string; score: number }) =>
      apiMemoryRepository.reviewCard(cardId, score),
    onSuccess: (updatedCard) => {
      queryClient.setQueryData<MemoryCard[]>(QUERY_KEYS.memory.cards(), (prev) =>
        prev ? prev.map((c) => (c.id === updatedCard.id ? updatedCard : c)) : [updatedCard]
      );
    },
  });

  const reviewCard = async (cardId: string, score: number) => {
    return reviewMutation.mutateAsync({ cardId, score });
  };

  return {
    cards,
    isLoading,
    reviewCard,
  };
};
