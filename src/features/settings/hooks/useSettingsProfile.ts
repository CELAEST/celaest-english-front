import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile, UpdateSettingsPayload } from "../../../domain/entities/UserProfile";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { logger } from "../../../shared/utils/logger";
import { setUserCefrLevel } from "../../../shared/services/levelStore";

export const useSettingsProfile = (initialUserName?: string) => {
  const queryClient = useQueryClient();

  const authAdapter = SupabaseAuthAdapter.getInstance();
  const storedUser = authAdapter.getStoredUser();
  const token = authAdapter.getStoredToken();
  const isAuthenticated = Boolean(token && storedUser?.id);
  const fallbackName: string | undefined =
    initialUserName ?? storedUser?.name ?? undefined;

  const profileQueryKey = QUERY_KEYS.settings.profile(storedUser?.id);

  const {
    data: profile = null,
    isLoading,
    error,
  } = useQuery<UserProfile | null>({
    queryKey: profileQueryKey,
    queryFn: async () => {
      try {
        const data = await apiSettingsRepository.getProfile();
        if (data?.cefrLevel && storedUser?.id) {
          setUserCefrLevel(storedUser.id, data.cefrLevel);
        }
        return data;
      } catch (err) {
        logger.warn("[useSettingsProfile] Backend API error, retrying...", err);
        throw err;
      }
    },
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => apiSettingsRepository.updateSettings(payload),
    onMutate: async (newPayload: UpdateSettingsPayload) => {
      await queryClient.cancelQueries({ queryKey: profileQueryKey });
      const previousProfile = queryClient.getQueryData<UserProfile | null>(profileQueryKey);
      const baseProfile: UserProfile = previousProfile || {
        id: storedUser?.id || "local-user",
        name: storedUser?.name || fallbackName || "Learner",
        email: storedUser?.email || "",
        cefrLevel: newPayload.cefrLevel || "B1",
        dailyFocus: newPayload.dailyFocus || "Clarity & Vocabulary",
        learningGoal: newPayload.learningGoal || "Daily Conversation",
        preferenceStyle: newPayload.preferenceStyle || "Conversation First",
        streakDays: 1,
      };
      queryClient.setQueryData<UserProfile>(profileQueryKey, {
        ...baseProfile,
        ...(newPayload.cefrLevel ? { cefrLevel: newPayload.cefrLevel } : {}),
        ...(newPayload.dailyFocus ? { dailyFocus: newPayload.dailyFocus } : {}),
        ...(newPayload.learningGoal ? { learningGoal: newPayload.learningGoal } : {}),
        ...(newPayload.preferenceStyle ? { preferenceStyle: newPayload.preferenceStyle } : {}),
        ...(newPayload.profession ? { profession: newPayload.profession } : {}),
      });
      return { previousProfile };
    },
    onError: (_err, newPayload, context) => {
      logger.warn("[useSettingsProfile] Failed to update backend settings, retaining local state:", _err);
      if (context?.previousProfile && !newPayload.cefrLevel) {
        queryClient.setQueryData(profileQueryKey, context.previousProfile);
      }
    },
    onSuccess: (updatedProfile) => {
      if (updatedProfile) {
        queryClient.setQueryData(profileQueryKey, updatedProfile);
        if (updatedProfile.cefrLevel && storedUser?.id) {
          setUserCefrLevel(storedUser.id, updatedProfile.cefrLevel);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["reading"] });
    },
  });

  const updateSettings = async (payload: UpdateSettingsPayload) => {
    return updateMutation.mutateAsync(payload);
  };

  return {
    displayName: profile?.name ?? fallbackName ?? "",
    streakDays: profile?.streakDays ?? 0,
    currentFocus: profile?.dailyFocus ?? "",
    currentLevel: profile?.cefrLevel ?? "",
    profession: profile?.profession ?? "",
    profile,
    isLoading,
    error: error ? "Backend API offline" : null,
    updateSettings,
  };
};
