import { useQuery } from "@tanstack/react-query";

import { topicsService } from "@/features/topics/lib/topics";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 10 * 60 * 1000;

export function useTopicCategories() {
  return useQuery({
    queryKey: queryKeys.topics.categories(),
    queryFn: () => topicsService.categories(),
    staleTime: STALE_MS,
  });
}
