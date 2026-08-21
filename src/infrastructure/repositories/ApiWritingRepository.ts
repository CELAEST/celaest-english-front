import { IWritingRepository } from "../../domain/repositories/IWritingRepository";
import { WritingSubmission } from "../../domain/entities/WritingSubmission";
import { HttpClient } from "../http/HttpClient";

export class ApiWritingRepository implements IWritingRepository {
  async evaluate(taskCategory: string, title: string, content: string): Promise<WritingSubmission> {
    return HttpClient.post<WritingSubmission>("/writing/evaluate", {
      taskCategory,
      title,
      content,
    });
  }
}

export const apiWritingRepository = new ApiWritingRepository();
