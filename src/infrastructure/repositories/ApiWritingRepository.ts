import {
  IWritingRepository,
  WritingProgressDTO,
  SaveWritingProgressPayload,
} from "../../domain/repositories/IWritingRepository";
import { WritingSubmission } from "../../domain/entities/WritingSubmission";
import { HttpClient } from "../http/HttpClient";

export class ApiWritingRepository implements IWritingRepository {
  async evaluate(
    taskCategory: string,
    title: string,
    content: string,
    taskDescription?: string,
    roleName?: string,
    targetLevel?: string,
  ): Promise<WritingSubmission> {
    return HttpClient.post<WritingSubmission>(
      "/writing/evaluate",
      {
        taskCategory,
        title,
        taskDescription,
        content,
        roleName,
        targetLevel,
      },
      { timeoutMs: 60_000 },
    );
  }

  async getProgress(cefrLevel?: string): Promise<WritingProgressDTO | null> {
    try {
      const url = cefrLevel
        ? `/writing/progress?cefrLevel=${encodeURIComponent(cefrLevel)}`
        : "/writing/progress";
      return await HttpClient.get<WritingProgressDTO | null>(url);
    } catch {
      return null;
    }
  }

  async saveProgress(payload: SaveWritingProgressPayload): Promise<WritingProgressDTO | null> {
    try {
      return await HttpClient.post<WritingProgressDTO>("/writing/progress", payload);
    } catch {
      return null;
    }
  }
}

export const apiWritingRepository = new ApiWritingRepository();
