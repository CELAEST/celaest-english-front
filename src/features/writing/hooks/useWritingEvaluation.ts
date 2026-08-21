import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WritingSubmission } from "../../../domain/entities/WritingSubmission";
import { apiWritingRepository } from "../../../infrastructure/repositories/ApiWritingRepository";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";

const evaluationCache = new Map<string, WritingSubmission>();

export const useWritingEvaluation = () => {
  const [submission, setSubmission] = useState<WritingSubmission | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ taskCategory, title, content }: { taskCategory: string; title: string; content: string }) => {
      const cacheKey = `${taskCategory}:${title}:${content.trim()}`;
      if (evaluationCache.has(cacheKey)) {
        return evaluationCache.get(cacheKey)!;
      }
      return apiWritingRepository.evaluate(taskCategory, title, content);
    },
    onSuccess: (result, variables) => {
      const cacheKey = `${variables.taskCategory}:${variables.title}:${variables.content.trim()}`;
      evaluationCache.set(cacheKey, result);
      setSubmission(result);
      queryClient.setQueryData(QUERY_KEYS.writing.submissions, result);
    },
  });

  const evaluateText = async (taskCategory: string, title: string, content: string) => {
    const cacheKey = `${taskCategory}:${title}:${content.trim()}`;
    if (evaluationCache.has(cacheKey)) {
      const cached = evaluationCache.get(cacheKey)!;
      setSubmission(cached);
      return cached;
    }
    return mutation.mutateAsync({ taskCategory, title, content });
  };

  return {
    submission,
    isEvaluating: mutation.isPending,
    error: mutation.error ? (mutation.error.message || "Failed to evaluate text") : null,
    evaluateText,
  };
};
