import { ExtractedWritingError } from "../../../../domain/entities/WritingSubmission";

export interface WritingErrorItem extends ExtractedWritingError {
  id: string;
}

export const getWritingErrorId = (submissionId: string, index: number): string =>
  `${submissionId}-err-${index}`;

export const getTierLabel = (score: number): string => {
  if (score >= 90) return "Executive Level";
  if (score >= 80) return "Advanced Level";
  if (score >= 70) return "Competent Level";
  return "Developing Level";
};
