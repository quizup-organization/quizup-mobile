import { useQuery } from "@tanstack/react-query";
import { getUserId } from "@/lib/auth";
import { profilesService } from "@/lib/services/profiles";
import { queryKeys } from "@/lib/query-keys";

/** Profil + progression du joueur connecté. */
export function useCurrentPlayer() {
  const userId = getUserId();

  const profileQuery = useQuery({
    queryKey: queryKeys.profiles.detail(userId ?? ""),
    queryFn: () => profilesService.getById(userId as string),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });

  const progressQuery = useQuery({
    queryKey: queryKeys.profiles.progress(userId ?? ""),
    queryFn: () => profilesService.getProgress(userId as string),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });

  return {
    userId,
    profile: profileQuery.data,
    progression: progressQuery.data,
    isLoading: profileQuery.isLoading || progressQuery.isLoading,
  };
}
