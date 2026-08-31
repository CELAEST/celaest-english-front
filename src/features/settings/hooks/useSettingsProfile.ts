import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile, UpdateSettingsPayload } from "../../../domain/entities/UserProfile";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { logger } from "../../../shared/utils/logger";

export const useSettingsProfile = (initialUserName?: string) => {
  const queryClient = useQueryClient();

  const authAdapter = SupabaseAuthAdapter.getInstance();
  const storedUser = authAdapter.getStoredUser();
  const token = authAdapter.getStoredToken();
  const isAuthenticated = Boolean(token && storedUser?.id);
  const fallbackName: string | undefined =
    initialUserName ?? storedUser?.name ?? undefined;

  const profileQueryKey = QUERY_KEYS.settings.profile;

  const {
    data: profile = null,
    isLoading,
    error,
  } = useQuery<UserProfile | null>({
    queryKey: profileQueryKey,
    queryFn: async () => {
      try {
        return await apiSettingsRepository.getProfile();
      } catch (err) {
        logger.warn("Backend API offline or unreachable, using fallback profile", err);
        return null;
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => apiSettingsRepository.updateSettings(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileQueryKey, updatedProfile);
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
