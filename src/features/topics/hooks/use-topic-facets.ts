import { useQuery } from "@tanstack/react-query";

import type { TopicFacetsParams } from "@/features/topics/domain/topic";
import { topicsService } from "@/features/topics/lib/topics";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 5 * 60 * 1000;

export function useTopicFacets(params: TopicFacetsParams = {}) {
  return useQuery({
    queryKey: queryKeys.topics.facets(params),
    queryFn: () => topicsService.facets(params),
    staleTime: STALE_MS,
  });
}
