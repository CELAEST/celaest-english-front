import { ISettingsRepository } from "../../domain/repositories/ISettingsRepository";
import { UserProfile, UpdateSettingsPayload } from "../../domain/entities/UserProfile";
import {
  AiProvider,
  ConfigureAiProviderPayload,
  ProviderTestResult,
} from "../../domain/entities/AiProvider";
import { HttpClient } from "../http/HttpClient";

export class ApiSettingsRepository implements ISettingsRepository {
  async getProfile(): Promise<UserProfile> {
    return HttpClient.get<UserProfile>("/user/profile");
  }

  async updateSettings(payload: UpdateSettingsPayload): Promise<UserProfile> {
    return HttpClient.put<UserProfile>("/user/settings", payload);
  }

  async getAiProviders(): Promise<AiProvider[]> {
    return HttpClient.get<AiProvider[]>("/ai/providers");
  }

  async configureAiProvider(payload: ConfigureAiProviderPayload): Promise<AiProvider> {
    return HttpClient.put<AiProvider>(`/ai/providers/${payload.providerId}/config`, {
      endpoint: payload.endpoint,
      defaultModel: payload.defaultModel,
    });
  }

  async activateAiProvider(providerId: AiProvider["id"]): Promise<AiProvider> {
    return HttpClient.post<AiProvider>(`/ai/providers/${providerId}/activate`);
  }

  async testAiProvider(providerId: AiProvider["id"]): Promise<ProviderTestResult> {
    return HttpClient.post<ProviderTestResult>(`/ai/providers/${providerId}/test`);
  }
}

export const apiSettingsRepository = new ApiSettingsRepository();
