import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile, UpdateSettingsPayload } from "../../../domain/entities/UserProfile";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { logger } from "../../../shared/utils/logger";

export const useSettingsProfile = (initialUserName: string = "Esteban") => {
  const queryClient = useQueryClient();

  const {
    data: profile = null,
    isLoading,
    error,
  } = useQuery<UserProfile | null>({
    queryKey: QUERY_KEYS.settings.profile,
    queryFn: async () => {
      try {
        return await apiSettingsRepository.getProfile();
      } catch (err) {
        logger.warn("Backend API offline or unreachable, using fallback profile", err);
        return null;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes deduplication
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => apiSettingsRepository.updateSettings(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(QUERY_KEYS.settings.profile, updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["reading"] });
    },
  });

  const updateSettings = async (payload: UpdateSettingsPayload) => {
    return updateMutation.mutateAsync(payload);
  };

  return {
    displayName: profile?.name || initialUserName,
    streakDays: profile?.streakDays ?? 12,
    currentFocus: profile?.dailyFocus || "Business Communication",
    currentLevel: profile?.cefrLevel || "B1 — Intermediate",
    profile,
    isLoading,
    error: error ? "Backend API offline" : null,
    updateSettings,
  };
};
