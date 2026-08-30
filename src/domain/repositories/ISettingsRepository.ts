import { UserProfile, UpdateSettingsPayload } from "../entities/UserProfile";
import { AiProvider, ConfigureAiProviderPayload, ProviderTestResult } from "../entities/AiProvider";

export interface ISettingsRepository {
  getProfile(): Promise<UserProfile>;
  updateSettings(payload: UpdateSettingsPayload): Promise<UserProfile>;
  getAiProviders(): Promise<AiProvider[]>;
  configureAiProvider(payload: ConfigureAiProviderPayload): Promise<AiProvider>;
  activateAiProvider(providerId: AiProvider["id"]): Promise<AiProvider>;
  testAiProvider(providerId: AiProvider["id"]): Promise<ProviderTestResult>;
}
