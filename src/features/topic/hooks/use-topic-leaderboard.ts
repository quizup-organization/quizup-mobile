import { useQuery } from "@tanstack/react-query";

import type { TopicLeaderboardParams } from "@/features/topics/domain/topic";
import { topicsService } from "@/features/topics/lib/topics";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 60 * 1000;

export function useTopicLeaderboard(
  topicId: string | undefined,
  params: TopicLeaderboardParams = {},
) {
  return useQuery({
    queryKey: queryKeys.topics.leaderboard(topicId ?? "", params),
    queryFn: () => topicsService.leaderboard(topicId ?? "", params),
    enabled: Boolean(topicId),
    staleTime: STALE_MS,
  });
}
