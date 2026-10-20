import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { queryKeys } from "@/lib/query-keys";
import { matchmakingService } from "@/lib/services/matchmaking";

/** Entre en recherche d'appariement public et ouvre l'écran de recherche. */
export function useStartMatchmaking() {
  const router = useRouter();
  return useMutation({
    mutationFn: (topicId: string) => matchmakingService.enqueue(topicId),
    onSuccess: (ticket) =>
      router.push(`/(app)/duel/search/${ticket.ticketId}`),
  });
}

export function useMatchmakingTicket(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.matchmaking.ticket(ticketId),
    queryFn: () => matchmakingService.get(ticketId),
    enabled: !!ticketId,
    staleTime: 0,
    refetchInterval: (query) =>
      query.state.data?.status === "SEARCHING" ? 1000 : false,
    retry: (failureCount, error) => {
      const status = (error as { statusCode?: number }).statusCode;
      return status === 404 ? failureCount < 12 : failureCount < 2;
    },
    retryDelay: 400,
  });
}

export function useCancelMatchmaking(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => matchmakingService.cancel(ticketId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.matchmaking.ticket(ticketId),
      });
    },
  });
}
