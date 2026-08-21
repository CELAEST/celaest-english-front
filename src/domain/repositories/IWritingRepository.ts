import { WritingSubmission } from "../entities/WritingSubmission";

export interface IWritingRepository {
  evaluate(taskCategory: string, title: string, content: string): Promise<WritingSubmission>;
}
