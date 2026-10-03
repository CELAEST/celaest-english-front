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
import {
  getUserCefrLevel,
  setUserCefrLevel,
  normalizeCefrLevel,
} from "../services/levelStore";

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

  const cachedLevel = useMemo(() => {
    return getUserCefrLevel(user?.id ?? "");
  }, [user?.id]);

  const settings: UserSettings = useMemo(() => {
    const userScopedCompleted =
      typeof window !== "undefined" && (user?.id || user?.email)
        ? (user.id ? localStorage.getItem(`lingua_onboarding_completed_${user.id}`) === "true" : false) ||
          (user.email ? localStorage.getItem(`lingua_onboarding_completed_${user.email}`) === "true" : false)
        : false;
    const globalCompleted =
      typeof window !== "undefined" && !user?.id && !user?.email
        ? localStorage.getItem("lingua_onboarding_completed") === "true"
        : false;
    const fallbackCompleted = userScopedCompleted || globalCompleted;

    let cachedProf =
      typeof window !== "undefined"
        ? localStorage.getItem("celaest:active_profession") || ""
        : "";
    if (!cachedProf && typeof window !== "undefined") {
      try {
        const rawTask = localStorage.getItem("celaest:writing:activeTask");
        if (rawTask) {
          const parsedTask = JSON.parse(rawTask);
          if (parsedTask?.title && parsedTask.title.includes(":")) {
            const roleCandidate = parsedTask.title.split(":")[0].trim();
            if (roleCandidate && roleCandidate.toLowerCase() !== "professional") {
              cachedProf = roleCandidate;
              localStorage.setItem("celaest:active_profession", roleCandidate);
            }
          }
        }
      } catch {}
    }

    if (profile) {
      const isCompleted =
        profile.onboardingCompleted !== undefined
          ? profile.onboardingCompleted === true
          : fallbackCompleted;
      if (typeof window !== "undefined" && isCompleted) {
        try {
          localStorage.setItem("lingua_onboarding_completed", "true");
          if (user?.id) localStorage.setItem(`lingua_onboarding_completed_${user.id}`, "true");
          if (user?.email) localStorage.setItem(`lingua_onboarding_completed_${user.email}`, "true");
        } catch {
          // ignore
        }
      }
      if (profile.profession && typeof window !== "undefined") {
        try {
          localStorage.setItem("celaest:active_profession", profile.profession);
        } catch {
          // ignore
        }
      }
      const normBackend = profile.cefrLevel ? normalizeCefrLevel(profile.cefrLevel) : "";
      // Backend is authoritative; fallback to local cache only if backend gave empty
      const effectiveLevel = normBackend || cachedLevel || "B1";
      if (user?.id) {
        setUserCefrLevel(user.id, effectiveLevel);
      }
      return {
        name: profile.name ?? user?.name ?? "",
        email: profile.email ?? user?.email ?? "",
        cefrLevel: effectiveLevel,
        dailyFocus: profile.dailyFocus ?? "",
        learningGoal: profile.learningGoal ?? "",
        preferenceStyle: profile.preferenceStyle ?? "",
        profession: profile.profession ?? cachedProf,
        onboardingCompleted: isCompleted,
        streakDays: profile.streakDays ?? 0,
      };
    }

    const normOffline = cachedLevel || "B1";
    // Offline / loading: recover persisted active profession and onboarding status
    return {
      name: user?.name ?? "",
      email: user?.email ?? "",
      cefrLevel: normOffline,
      dailyFocus: "",
      learningGoal: "",
      preferenceStyle: "",
      profession: cachedProf,
      onboardingCompleted: fallbackCompleted,
      streakDays: 0,
    };
  }, [profile, user, cachedLevel]);

  const updateProfileSettings = useCallback(
    async (partial: Partial<UserSettings>) => {
      if (partial.cefrLevel && typeof window !== "undefined") {
        setUserCefrLevel(user?.id ?? "", partial.cefrLevel);
      }
      if (partial.profession && typeof window !== "undefined") {
        try {
          localStorage.setItem("celaest:active_profession", partial.profession);
          window.dispatchEvent(new CustomEvent("celaest:profession-changed", { detail: partial.profession }));
        } catch {
          // ignore
        }
      }
      if (partial.onboardingCompleted && typeof window !== "undefined") {
        try {
          localStorage.setItem("lingua_onboarding_completed", "true");
          if (user?.id) localStorage.setItem(`lingua_onboarding_completed_${user.id}`, "true");
          if (user?.email) localStorage.setItem(`lingua_onboarding_completed_${user.email}`, "true");
        } catch {
          // ignore
        }
      }
      await updateSettings({
        ...(partial.name !== undefined ? { name: partial.name } : {}),
        ...(partial.cefrLevel !== undefined ? { cefrLevel: normalizeCefrLevel(partial.cefrLevel) } : {}),
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
    [updateSettings, user],
  );

  return {
    user,
    settings,
    loading: isLoading,
    isLevelResolved: Boolean(profile || cachedLevel),
    error,
    updateProfileSettings,
    refreshProfile: () => {},
  };
};
