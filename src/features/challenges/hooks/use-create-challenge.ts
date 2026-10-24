import { useMutation, useQueryClient } from "@tanstack/react-query";

import { challengesService } from "@/features/challenges/lib/challenges";
import { queryKeys } from "@/lib/query-keys";

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      topicId: string;
      opponentId: string;
      gameId?: string | null;
    }) => challengesService.create(params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all }),
  });
}
