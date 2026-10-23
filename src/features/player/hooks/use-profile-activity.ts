import { useQuery } from "@tanstack/react-query";

import { profilesService } from "@/features/player/lib/profiles";
import { queryKeys } from "@/lib/query-keys";

export function useProfileActivity(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profiles.activity(userId ?? ""),
    queryFn: () => profilesService.activity(userId ?? ""),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}
