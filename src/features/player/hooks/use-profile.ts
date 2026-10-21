import { useQuery } from "@tanstack/react-query";

import { profilesService } from "@/features/player/lib/profiles";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 2 * 60 * 1000;

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profiles.detail(userId ?? ""),
    queryFn: () => profilesService.detail(userId ?? ""),
    enabled: Boolean(userId),
    staleTime: STALE_MS,
  });
}
