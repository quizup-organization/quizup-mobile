import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { getUserId } from "@/lib/auth";
import { queryKeys } from "@/lib/query-keys";
import { gamesService, questionsService } from "@/lib/services/games";
import type { BotDifficulty } from "@/shared/types/api";
import type { GameChoice } from "@/shared/types/domain";

export const GAME_CHOICES: GameChoice[] = ["A", "B", "C", "D"];
export const ROUND_DURATION_SECONDS = 10;

/**
 * État d'un duel : polling de la partie (le déroulé est piloté par la saga serveur).
 * Mobile : pas de WebSocket pour l'instant (repli identique au web).
 */
export function useDuel(gameId: string) {
  const userId = getUserId();
  const queryClient = useQueryClient();

  const gameQuery = useQuery({
    queryKey: queryKeys.games.detail(gameId),
    queryFn: () => gamesService.getById(gameId),
    enabled: !!gameId,
    retry: (failureCount, error) => {
      const status = (error as { statusCode?: number }).statusCode;
      return status === 404 ? failureCount < 12 : failureCount < 2;
    },
    retryDelay: 400,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "FINISHED" || status === "CANCELED" ? false : 1500;
    },
  });

  const game = gameQuery.data;
  const currentRound =
    game?.rounds?.find((round) => round.status === "STARTED") ?? null;
  const questionId = currentRound?.questionId;

  const questionQuery = useQuery({
    queryKey: queryKeys.questions.detail(questionId ?? ""),
    queryFn: () => questionsService.getById(questionId as string),
    enabled: !!questionId,
    staleTime: 30 * 60 * 1000,
  });

  const isPlayer1 = game?.player1Id === userId;
  const myScore = (isPlayer1 ? game?.player1Score : game?.player2Score) ?? 0;
  const theirScore = (isPlayer1 ? game?.player2Score : game?.player1Score) ?? 0;
  const myChoice = isPlayer1
    ? (currentRound?.player1Choice ?? null)
    : (currentRound?.player2Choice ?? null);

  const answer = useMutation({
    mutationFn: (choice: GameChoice) =>
      gamesService.answer(gameId, userId as string, choice),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.games.detail(gameId) }),
  });

  return {
    game,
    isLoading: gameQuery.isLoading,
    isError: gameQuery.isError,
    currentRound,
    question: questionQuery.data,
    myChoice,
    myScore,
    theirScore,
    isPlayer1,
    answer,
  };
}

/** Crée une partie contre un bot et ouvre l'arène. */
export function useStartDuel() {
  const router = useRouter();
  const userId = getUserId();
  return useMutation({
    mutationFn: (input: {
      topicId: string;
      playerName: string;
      difficulty: BotDifficulty;
    }) =>
      gamesService.createBotGame({
        topicId: input.topicId,
        playerId: userId as string,
        playerName: input.playerName,
        difficulty: input.difficulty,
      }),
    onSuccess: (response) => router.replace(`/(app)/duel/${response.id}`),
  });
}
