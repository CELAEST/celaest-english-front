/**
 * Hook: useCurrentUser
 *
 * Provides reactive access to the authenticated user and their active CEFR learning profile.
 */

import { useState, useEffect, useCallback } from "react";
import { SupabaseAuthAdapter } from "../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { AuthUser } from "../../application/ports/IAuthService";
import { ENV } from "../constants/env";
import { logger } from "../utils/logger";

export interface UserSettings {
  name: string;
  email: string;
  cefrLevel: string;
  dailyFocus: string;
  learningGoal: string;
  preferenceStyle: string;
  profession?: string;
  streakDays: number;
}

const DEFAULT_SETTINGS: UserSettings = {
  name: "Esteban",
  email: "esteban@celaest.com",
  cefrLevel: "B1 — Intermediate",
  dailyFocus: "20 minutes",
  learningGoal: "Career Growth & AI",
  preferenceStyle: "Conversation First",
  profession: "Software Developer",
  streakDays: 1,
};

export const useCurrentUser = () => {
  const authAdapter = SupabaseAuthAdapter.getInstance();
  const [user, setUser] = useState<AuthUser | null>(() => authAdapter.getStoredUser());
  const [settings, setSettings] = useState<UserSettings>(() => {
    const cached = localStorage.getItem("lingua_user_settings");
    return cached ? JSON.parse(cached) : DEFAULT_SETTINGS;
  });
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    const token = authAdapter.getStoredToken();
    const storedUser = authAdapter.getStoredUser();
    if (storedUser) setUser(storedUser);
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${ENV.apiUrl}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const profileData: UserSettings = {
            name: json.data.name || user?.name || DEFAULT_SETTINGS.name,
            email: json.data.email || user?.email || DEFAULT_SETTINGS.email,
            cefrLevel: json.data.cefrLevel || DEFAULT_SETTINGS.cefrLevel,
            dailyFocus: json.data.dailyFocus || DEFAULT_SETTINGS.dailyFocus,
            learningGoal: json.data.learningGoal || DEFAULT_SETTINGS.learningGoal,
            preferenceStyle: json.data.preferenceStyle || DEFAULT_SETTINGS.preferenceStyle,
            profession: json.data.profession || DEFAULT_SETTINGS.profession,
            streakDays: json.data.streakDays || 1,
          };
          setSettings(profileData);
          localStorage.setItem("lingua_user_settings", JSON.stringify(profileData));
        }
      }
    } catch (e) {
      logger.warn("[useCurrentUser] Could not sync settings with backend, using cached profile", e);
    } finally {
      setLoading(false);
    }
  }, [authAdapter, user?.name, user?.email]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfileSettings = useCallback(
    async (partial: Partial<UserSettings>) => {
      const token = authAdapter.getStoredToken();
      const updated = { ...settings, ...partial };
      setSettings(updated);
      localStorage.setItem("lingua_user_settings", JSON.stringify(updated));

      if (token) {
        try {
          await fetch(`${ENV.apiUrl}/user/settings`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: updated.name,
              cefrLevel: updated.cefrLevel,
              dailyFocus: updated.dailyFocus,
              learningGoal: updated.learningGoal,
              preferenceStyle: updated.preferenceStyle,
            }),
          });
        } catch (e) {
          logger.warn("[useCurrentUser] Failed to persist settings remotely", e);
        }
      }
    },
    [authAdapter, settings]
  );

  return {
    user,
    settings,
    loading,
    updateProfileSettings,
    refreshProfile: fetchProfile,
  };
};
