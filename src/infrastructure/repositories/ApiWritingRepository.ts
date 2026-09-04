import { IWritingRepository } from "../../domain/repositories/IWritingRepository";
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
}

export const apiWritingRepository = new ApiWritingRepository();
