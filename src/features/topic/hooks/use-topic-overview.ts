import { useQuery } from "@tanstack/react-query";

import { topicsService } from "@/features/topics/lib/topics";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 2 * 60 * 1000;

export function useTopicOverview(topicId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.topics.overview(topicId ?? ""),
    queryFn: () => topicsService.overview(topicId ?? ""),
    enabled: Boolean(topicId),
    staleTime: STALE_MS,
  });
}
