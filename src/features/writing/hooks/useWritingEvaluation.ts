import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { WritingSubmission } from "../../../domain/entities/WritingSubmission";
import { apiWritingRepository } from "../../../infrastructure/repositories/ApiWritingRepository";

export interface EvaluateWritingParams {
  taskCategory: string;
  title: string;
  content: string;
  taskDescription?: string;
}

export const useWritingEvaluation = () => {
  const [submission, setSubmission] = useState<WritingSubmission | null>(null);

  const mutation = useMutation({
    mutationFn: async (params: EvaluateWritingParams) => {
      return apiWritingRepository.evaluate(
        params.taskCategory,
        params.title,
        params.content,
        params.taskDescription,
      );
    },
    onSuccess: (result) => {
      setSubmission(result);
    },
  });

  const evaluateText = async (params: EvaluateWritingParams) => {
    return mutation.mutateAsync(params);
  };

  return {
    submission,
    isEvaluating: mutation.isPending,
    error: mutation.error ? mutation.error.message || "Failed to evaluate text" : null,
    evaluateText,
  };
};
