import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { queryKeys } from "@/lib/query-keys";
import { matchmakingService } from "@/lib/services/matchmaking";

/** Met le joueur en file d'attente et ouvre l'écran de recherche. */
export function useStartMatchmaking() {
  const router = useRouter();
  return useMutation({
    mutationFn: (topicId: string) => matchmakingService.enqueue(topicId),
    onSuccess: (response) => router.push(`/(app)/duel/search/${response.id}`),
  });
}

export function useMatchmakingTicket(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.matchmaking.ticket(ticketId),
    queryFn: () => matchmakingService.getTicket(ticketId),
    enabled: !!ticketId,
    retry: (failureCount, error) => {
      const status = (error as { statusCode?: number }).statusCode;
      return status === 404 ? failureCount < 12 : failureCount < 2;
    },
    retryDelay: 400,
    refetchInterval: (query) =>
      query.state.data?.status === "WAITING" ? 1000 : false,
  });
}

export function useCancelMatchmaking(ticketId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => matchmakingService.cancel(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matchmaking.ticket(ticketId),
      });
      router.replace("/(app)/topics");
    },
  });
}
