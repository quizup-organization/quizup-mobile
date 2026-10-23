import { useMutation } from "@tanstack/react-query";

import { roomsService } from "@/features/rooms/lib/rooms";

/** Fait apparaître le joueur dans la salle (idempotent côté BFF). */
export function useJoinRoom(roomId: string) {
  return useMutation({
    mutationFn: () => roomsService.join(roomId),
  });
}
