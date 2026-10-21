import { useQuery } from "@tanstack/react-query";

import { topicsService } from "@/features/topics/lib/topics";
import type { TopicListParams } from "@/features/topics/domain/topic";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 2 * 60 * 1000;
const DEFAULT_PARAMS: TopicListParams = { page: 0, size: 50 };

export function useTopics(params: TopicListParams = DEFAULT_PARAMS) {
  return useQuery({
    queryKey: queryKeys.topics.list(params),
    queryFn: () => topicsService.list(params),
    staleTime: STALE_MS,
    placeholderData: (previous) => previous,
  });
}
