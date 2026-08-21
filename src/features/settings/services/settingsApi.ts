import { HttpClient } from "../../../infrastructure/http/HttpClient";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cefrLevel: string;
  dailyFocus: string;
  learningGoal: string;
  preferenceStyle: string;
  streakDays: number;
}

export interface UpdateSettingsPayload {
  cefrLevel?: string;
  dailyFocus?: string;
  learningGoal?: string;
  preferenceStyle?: string;
}

export const settingsApi = {
  getProfile: (): Promise<UserProfile> => {
    return HttpClient.get<UserProfile>("/user/profile");
  },

  updateSettings: (payload: UpdateSettingsPayload): Promise<UserProfile> => {
    return HttpClient.put<UserProfile>("/user/settings", payload);
  },
};
