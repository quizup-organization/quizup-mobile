import { useMutation } from "@tanstack/react-query";

import type { GameChoice } from "@/features/game/domain/game-dto";
import { gamesService } from "@/features/game/lib/games";

/** Envoie la réponse courante ; l'écho serveur reste la source de vérité. */
export function useAnswerQuestion(gameId: string) {
  return useMutation({
    mutationFn: (choice: GameChoice) => gamesService.answer(gameId, choice),
  });
}
