import { WritingSubmission } from "../entities/WritingSubmission";

export interface WritingProgressDTO {
  userId: string;
  cefrLevel: string;
  roleName: string;
  taskIndex: number;
  taskBatch: unknown[];
  activeTask: unknown;
  editorDraft: string;
  seenPrompts: string[];
  updatedAt: string;
}

export interface SaveWritingProgressPayload {
  cefrLevel: string;
  roleName: string;
  taskIndex: number;
  taskBatch?: unknown[];
  activeTask?: unknown;
  editorDraft?: string;
  seenPrompts?: string[];
}

export interface IWritingRepository {
  evaluate(
    taskCategory: string,
    title: string,
    content: string,
    taskDescription?: string,
    roleName?: string,
    targetLevel?: string,
  ): Promise<WritingSubmission>;

  getProgress(cefrLevel?: string): Promise<WritingProgressDTO | null>;
  saveProgress(payload: SaveWritingProgressPayload): Promise<WritingProgressDTO | null>;
}
