import { useMutation } from "@tanstack/react-query";

import { roomsService } from "@/features/rooms/lib/rooms";

/** Crée une salle contre le bot et renvoie son identifiant. */
export function useCreateBotRoom() {
  return useMutation({
    mutationFn: (topicId: string) => roomsService.createBot(topicId),
  });
}
