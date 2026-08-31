/**
 * User Profile Domain Entity
 * Pure business model representing user preferences, level, and streak info
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cefrLevel: string;
  dailyFocus: string;
  learningGoal: string;
  preferenceStyle: string;
  notificationPref?: string;
  profession?: string;
  onboardingCompleted?: boolean;
  streakDays: number;
  lastActiveAt?: string;
  createdAt?: string;
}

export interface UpdateSettingsPayload {
  name?: string;
  email?: string;
  cefrLevel?: string;
  dailyFocus?: string;
  learningGoal?: string;
  preferenceStyle?: string;
  notificationPref?: string;
  profession?: string;
  onboardingCompleted?: boolean;
}
