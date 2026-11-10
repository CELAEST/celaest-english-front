import { ISettingsRepository } from "../../domain/repositories/ISettingsRepository";
import { UserProfile, UpdateSettingsPayload } from "../../domain/entities/UserProfile";
import {
  AiProvider,
  ConfigureAiProviderPayload,
  ProviderTestResult,
} from "../../domain/entities/AiProvider";
import { HttpClient } from "../http/HttpClient";
import { SupabaseAuthAdapter } from "../adapters/auth/SupabaseAuthAdapter";

export class ApiSettingsRepository implements ISettingsRepository {
  async getProfile(): Promise<UserProfile> {
    if (import.meta.env.DEV) {
      const storedUser = SupabaseAuthAdapter.getInstance().getStoredUser();
      if (storedUser?.id === "dev-user-local") {
        return {
          id: "dev-user-local",
          name: storedUser.name || "Esteban",
          email: storedUser.email || "test@celaest.local",
          cefrLevel: "A1",
          dailyFocus: "conversation",
          learningGoal: "fluency",
          preferenceStyle: "interactive",
          profession: "Developer",
          streakDays: 5,
          onboardingCompleted: true,
        };
      }
    }
    return HttpClient.get<UserProfile>("/user/profile");
  }

  async updateSettings(payload: UpdateSettingsPayload): Promise<UserProfile> {
    if (import.meta.env.DEV) {
      const storedUser = SupabaseAuthAdapter.getInstance().getStoredUser();
      if (storedUser?.id === "dev-user-local") {
        return {
          id: "dev-user-local",
          name: payload.name || storedUser.name || "Esteban",
          email: storedUser.email || "test@celaest.local",
          cefrLevel: payload.cefrLevel || "A1",
          dailyFocus: payload.dailyFocus || "conversation",
          learningGoal: payload.learningGoal || "fluency",
          preferenceStyle: payload.preferenceStyle || "interactive",
          profession: payload.profession || "Developer",
          streakDays: 5,
          onboardingCompleted: true,
        };
      }
    }
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
