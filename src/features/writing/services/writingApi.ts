import { HttpClient } from "../../../infrastructure/http/HttpClient";

export interface WritingSubmission {
  id: string;
  taskCategory: string;
  title: string;
  content: string;
  wordCount: number;
  scoreClarity: number;
  scoreGrammar: number;
  feedback: {
    summary: string;
    improvements: string[];
  };
}

export const writingApi = {
  evaluate: (taskCategory: string, title: string, content: string): Promise<WritingSubmission> => {
    return HttpClient.post<WritingSubmission>("/writing/evaluate", {
      taskCategory,
      title,
      content,
    });
  },
};
