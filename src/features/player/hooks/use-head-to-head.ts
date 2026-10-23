import { useQuery } from "@tanstack/react-query";

import { profilesService } from "@/features/player/lib/profiles";
import { queryKeys } from "@/lib/query-keys";

export function useHeadToHead(
  userId: string | undefined,
  against: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.profiles.headToHead(userId ?? "", against ?? ""),
    queryFn: () => profilesService.headToHead(userId ?? "", against ?? ""),
    enabled: Boolean(userId && against),
    staleTime: 60_000,
  });
}
