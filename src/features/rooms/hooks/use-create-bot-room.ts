import { useMutation } from "@tanstack/react-query";

import { roomsService } from "@/features/rooms/lib/rooms";

export interface CreateBotRoomInput {
  topicId: string;
  difficulty?: "EASY" | "NORMAL" | "HARD";
}

/** Crée une salle contre le bot et renvoie son identifiant. */
export function useCreateBotRoom() {
  return useMutation({
    mutationFn: ({ topicId, difficulty }: CreateBotRoomInput) =>
      roomsService.createBot(topicId, difficulty),
  });
}
