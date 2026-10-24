import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { matchmakingService } from "@/features/matchmaking/lib/matchmaking";
import { useStompSubscription } from "@/shared/hooks/use-stomp-subscription";

const POLL_MS = 800;

/** Suit un ticket d'appariement (REST + push STOMP). */
export function useMatchmakingTicket(ticketId: string | undefined) {
  const queryClient = useQueryClient();
  const key = ["matchmaking", ticketId ?? ""] as const;

  const query = useQuery({
    queryKey: key,
    queryFn: () => matchmakingService.get(ticketId ?? ""),
    enabled: Boolean(ticketId),
    staleTime: 0,
    retry: 5,
    retryDelay: 500,
    refetchInterval: (current) => {
      const status = current.state.data?.status;
      return status && status !== "SEARCHING" ? false : POLL_MS;
    },
  });

  useStompSubscription(
    "matchmaking",
    ticketId ? `/topic/matchmaking/tickets/${ticketId}` : null,
    () => {
      void queryClient.invalidateQueries({ queryKey: key });
    },
    () => {
      void queryClient.invalidateQueries({ queryKey: key });
    },
  );

  return query;
}

export function useStartMatchmaking() {
  return useMutation({
    mutationFn: (topicId: string) => matchmakingService.enqueue(topicId),
  });
}

export function useCancelMatchmaking(ticketId: string) {
  return useMutation({
    mutationFn: () => matchmakingService.cancel(ticketId),
  });
}
