import { useMutation } from "@tanstack/react-query";

import { roomsService } from "@/features/rooms/lib/rooms";

/** Crée une salle partagée par lien et renvoie son identifiant. */
export function useCreateSharedRoom() {
  return useMutation({
    mutationFn: (topicId: string) => roomsService.create(topicId),
  });
}
