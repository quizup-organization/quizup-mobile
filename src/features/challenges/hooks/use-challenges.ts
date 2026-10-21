import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { challengesService } from "@/features/challenges/lib/challenges";
import { queryKeys } from "@/lib/query-keys";

const STALE_MS = 60 * 1000;

export function useChallenges() {
  return useQuery({
    queryKey: queryKeys.challenges.list(),
    queryFn: () => challengesService.list(),
    staleTime: STALE_MS,
  });
}

export function usePendingChallengesCount() {
  return useQuery({
    queryKey: queryKeys.challenges.pendingCount(),
    queryFn: () => challengesService.pendingCount(),
    staleTime: STALE_MS,
    refetchInterval: 30_000,
  });
}

export function useRespondChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      challengeId,
      accept,
    }: {
      challengeId: string;
      accept: boolean;
    }) =>
      accept
        ? challengesService.accept(challengeId)
        : challengesService.decline(challengeId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all }),
  });
}
