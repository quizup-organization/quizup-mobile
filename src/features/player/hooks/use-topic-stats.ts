import { useQuery } from "@tanstack/react-query";

import { profilesService } from "@/features/player/lib/profiles";
import { queryKeys } from "@/lib/query-keys";

export function useTopicStats(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profiles.topics(userId ?? ""),
    queryFn: () => profilesService.topicStats(userId ?? ""),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}
