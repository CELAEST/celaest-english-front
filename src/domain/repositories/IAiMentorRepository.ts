import { AiMentorFeedback } from "../entities/AiMentorFeedback";

export interface IAiMentorRepository {
  getFeedback(): Promise<AiMentorFeedback>;
}
