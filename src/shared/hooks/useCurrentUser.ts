/**
 * Hook: useCurrentUser
 * Single source of truth — delegates to `useSettingsProfile` (React Query).
 * No raw fetch, no duplicate GET /user/profile. `staleTime` + `refetchOnMount:false`
 * guarantee 1 call on cold start, 0 on tab re-enter. HttpClient retry=0, Query retry=1.
 */

import { useMemo, useState, useEffect, useCallback } from "react";
import { SupabaseAuthAdapter } from "../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { AuthUser } from "../../application/ports/IAuthService";
import { useSettingsProfile } from "../../features/settings/hooks/useSettingsProfile";

export interface UserSettings {
  name: string;
  email: string;
  cefrLevel: string;
  dailyFocus: string;
  learningGoal: string;
  preferenceStyle: string;
  profession?: string;
  streakDays: number;
  onboardingCompleted?: boolean;
}

export const useCurrentUser = () => {
  const authAdapter = SupabaseAuthAdapter.getInstance();
  const [user, setUser] = useState<AuthUser | null>(() => authAdapter.getStoredUser());

  useEffect(() => {
    setUser(authAdapter.getStoredUser());
    const onAuthChange = () => setUser(authAdapter.getStoredUser());
    window.addEventListener("celaest:auth-changed", onAuthChange);
    window.addEventListener("storage", onAuthChange);
    return () => {
      window.removeEventListener("celaest:auth-changed", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, [authAdapter]);

  const { profile, isLoading, updateSettings, error } = useSettingsProfile(
    user?.name ?? undefined,
  );

  const settings: UserSettings = useMemo(() => {
    if (profile) {
      if (profile.profession && typeof window !== "undefined") {
        try {
          localStorage.setItem("celaest:active_profession", profile.profession);
        } catch {
          // ignore
        }
      }
      return {
        name: profile.name ?? "",
        email: profile.email ?? user?.email ?? "",
        cefrLevel: profile.cefrLevel ?? "",
        dailyFocus: profile.dailyFocus ?? "",
        learningGoal: profile.learningGoal ?? "",
        preferenceStyle: profile.preferenceStyle ?? "",
        profession: profile.profession ?? "",
        onboardingCompleted: profile.onboardingCompleted ?? false,
        streakDays: profile.streakDays ?? 0,
      };
    }
    // Offline / loading: recover persisted active profession so child components don't flash default
    const cachedProf =
      typeof window !== "undefined"
        ? localStorage.getItem("celaest:active_profession") || ""
        : "";
    return {
      name: user?.name ?? "",
      email: user?.email ?? "",
      cefrLevel: "",
      dailyFocus: "",
      learningGoal: "",
      preferenceStyle: "",
      profession: cachedProf,
      onboardingCompleted: false,
      streakDays: 0,
    };
  }, [profile, user]);

  const updateProfileSettings = useCallback(
    async (partial: Partial<UserSettings>) => {
      await updateSettings({
        ...(partial.name !== undefined ? { name: partial.name } : {}),
        ...(partial.cefrLevel !== undefined ? { cefrLevel: partial.cefrLevel } : {}),
        ...(partial.dailyFocus !== undefined ? { dailyFocus: partial.dailyFocus } : {}),
        ...(partial.learningGoal !== undefined ? { learningGoal: partial.learningGoal } : {}),
        ...(partial.preferenceStyle !== undefined
          ? { preferenceStyle: partial.preferenceStyle }
          : {}),
        ...(partial.profession !== undefined ? { profession: partial.profession } : {}),
        ...(partial.onboardingCompleted !== undefined
          ? { onboardingCompleted: partial.onboardingCompleted }
          : {}),
      });
    },
    [updateSettings],
  );

  return {
    user,
    settings,
    loading: isLoading,
    error,
    updateProfileSettings,
    refreshProfile: () => {},
  };
};
