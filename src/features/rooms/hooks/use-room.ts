import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { RoomStatus } from "@/features/rooms/domain/room";
import { roomsService } from "@/features/rooms/lib/rooms";
import { queryKeys } from "@/lib/query-keys";
import { useStompSubscription } from "@/shared/hooks/use-stomp-subscription";

const POLL_MS = 1_000;

const TERMINAL: RoomStatus[] = [
  "GAME_CREATED",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
  "FAILED",
];

/** Suit l'état d'une salle (REST + push STOMP). */
export function useRoom(roomId: string | undefined) {
  const queryClient = useQueryClient();
  const key = queryKeys.rooms.detail(roomId ?? "");

  const query = useQuery({
    queryKey: key,
    queryFn: () => roomsService.get(roomId ?? ""),
    enabled: Boolean(roomId),
    staleTime: 0,
    retry: 5,
    retryDelay: 500,
    refetchInterval: (current) => {
      const status = current.state.data?.status;
      return status && TERMINAL.includes(status) ? false : POLL_MS;
    },
  });

  useStompSubscription(
    "matchmaking",
    roomId ? `/topic/rooms/${roomId}` : null,
    () => {
      void queryClient.invalidateQueries({ queryKey: key });
      void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.challenges.all,
      });
    },
    () => {
      void queryClient.invalidateQueries({ queryKey: key });
    },
  );

  return query;
}
