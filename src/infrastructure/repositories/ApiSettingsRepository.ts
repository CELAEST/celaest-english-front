import { ISettingsRepository } from "../../domain/repositories/ISettingsRepository";
import { UserProfile, UpdateSettingsPayload } from "../../domain/entities/UserProfile";
import { HttpClient } from "../http/HttpClient";

export class ApiSettingsRepository implements ISettingsRepository {
  async getProfile(): Promise<UserProfile> {
    return HttpClient.get<UserProfile>("/user/profile");
  }

  async updateSettings(payload: UpdateSettingsPayload): Promise<UserProfile> {
    return HttpClient.put<UserProfile>("/user/settings", payload);
  }
}

export const apiSettingsRepository = new ApiSettingsRepository();
