import { useQuery } from "@tanstack/react-query";
import { AiMentorFeedback } from "../../../domain/entities/AiMentorFeedback";
import { apiAiMentorRepository } from "../../../infrastructure/repositories/ApiAiMentorRepository";

export const useAiMentorFeedback = () => {
  const { data: feedback = null, isLoading } = useQuery<AiMentorFeedback | null>({
    queryKey: ["aimentor", "feedback"],
    queryFn: async () => {
      try {
        return await apiAiMentorRepository.getFeedback();
      } catch (err) {
        console.warn("AI Mentor API offline, using fallback", err);
        return null;
      }
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    feedback,
    messageTitle: feedback?.messageTitle || "I adapt to you.",
    messageBody: feedback?.messageBody || "The more you use Lingua, the better I understand how to help you.",
    isActive: feedback?.active ?? true,
    isLoading,
  };
};
