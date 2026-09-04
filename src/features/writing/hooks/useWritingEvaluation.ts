import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { WritingSubmission } from "../../../domain/entities/WritingSubmission";
import { apiWritingRepository } from "../../../infrastructure/repositories/ApiWritingRepository";
import { logger } from "../../../shared/utils/logger";

export interface EvaluateWritingParams {
  taskCategory: string;
  title: string;
  content: string;
  taskDescription?: string;
  roleName?: string;
  targetLevel?: string;
}

const WRITING_EVAL_CACHE = new Map<string, WritingSubmission>();

function getWritingCacheKey(
  taskCategory: string,
  title: string,
  content: string,
  targetLevel: string = "B1",
): string {
  return `${taskCategory}::${title}::${targetLevel}::${content.toLowerCase().trim().replace(/\s+/g, " ")}`;
}

export const useWritingEvaluation = () => {
  const [submission, setSubmission] = useState<WritingSubmission | null>(null);

  const mutation = useMutation({
    mutationFn: async (params: EvaluateWritingParams) => {
      const cacheKey = getWritingCacheKey(
        params.taskCategory,
        params.title,
        params.content,
        params.targetLevel || "B1",
      );
      const cached = WRITING_EVAL_CACHE.get(cacheKey);
      if (cached) {
        logger.info("[useWritingEvaluation] Serving from idempotency cache (0 tokens):", cacheKey);
        return cached;
      }

      const result = await apiWritingRepository.evaluate(
        params.taskCategory,
        params.title,
        params.content,
        params.taskDescription,
        params.roleName,
        params.targetLevel,
      );

      WRITING_EVAL_CACHE.set(cacheKey, result);
      return result;
    },
    onSuccess: (result) => {
      setSubmission(result);
    },
  });

  const evaluateText = async (params: EvaluateWritingParams) => {
    const cacheKey = getWritingCacheKey(
      params.taskCategory,
      params.title,
      params.content,
      params.targetLevel || "B1",
    );
    const cached = WRITING_EVAL_CACHE.get(cacheKey);
    if (cached) {
      logger.info("[useWritingEvaluation] Serving cached text immediately:", cacheKey);
      setSubmission(cached);
      return cached;
    }
    return mutation.mutateAsync(params);
  };

  return {
    submission,
    isEvaluating: mutation.isPending,
    error: mutation.error ? mutation.error.message || "Failed to evaluate text" : null,
    evaluateText,
  };
};
