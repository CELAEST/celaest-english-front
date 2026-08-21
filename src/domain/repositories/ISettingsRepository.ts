import { UserProfile, UpdateSettingsPayload } from "../entities/UserProfile";

export interface ISettingsRepository {
  getProfile(): Promise<UserProfile>;
  updateSettings(payload: UpdateSettingsPayload): Promise<UserProfile>;
}
