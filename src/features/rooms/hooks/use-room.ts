import { useQuery } from "@tanstack/react-query";

import type { RoomStatus } from "@/features/rooms/domain/room";
import { roomsService } from "@/features/rooms/lib/rooms";
import { queryKeys } from "@/lib/query-keys";

const POLL_MS = 700;

const TERMINAL: RoomStatus[] = [
  "GAME_CREATED",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
  "FAILED",
];

/** Suit l'état d'une salle pendant la préparation de la partie. */
export function useRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(roomId ?? ""),
    queryFn: () => roomsService.get(roomId ?? ""),
    enabled: Boolean(roomId),
    staleTime: 0,
    retry: 5,
    retryDelay: 500,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && TERMINAL.includes(status) ? false : POLL_MS;
    },
  });
}
