import { IAiMentorRepository } from "../../domain/repositories/IAiMentorRepository";
import { AiMentorFeedback } from "../../domain/entities/AiMentorFeedback";
import { HttpClient } from "../http/HttpClient";

export class ApiAiMentorRepository implements IAiMentorRepository {
  async getFeedback(): Promise<AiMentorFeedback> {
    return HttpClient.get<AiMentorFeedback>("/aimentor/feedback");
  }
}

export const apiAiMentorRepository = new ApiAiMentorRepository();
