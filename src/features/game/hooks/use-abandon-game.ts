import { useMutation } from "@tanstack/react-query";

import { gamesService } from "@/features/game/lib/games";

/** Abandonne la partie en cours (forfait). */
export function useAbandonGame(gameId: string) {
  return useMutation({
    mutationFn: () => gamesService.abandon(gameId),
  });
}
