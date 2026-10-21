import { useMutation, useQueryClient } from "@tanstack/react-query";

import { topicsService } from "@/features/topics/lib/topics";
import { queryKeys } from "@/lib/query-keys";

/** Suit / ne suit plus un sujet, puis rafraîchit les vues qui portent l'état. */
export function useSetTopicFollow(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followed: boolean) =>
      followed
        ? topicsService.follow(topicId)
        : topicsService.unfollow(topicId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.topics.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.home() }),
      ]),
  });
}
