import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "@/lib/auth";
import { queryKeys } from "@/lib/query-keys";
import { gamesService } from "@/lib/services/games";
import { leaderboardService, type LeaderboardPeriod, type LeaderboardScope } from "@/lib/services/leaderboard";
import { profilesService } from "@/lib/services/profiles";
import { topicFollowsService } from "@/lib/services/topic-follows";
import { topicsService } from "@/lib/services/topics";
import { emptyPage, pageOf } from "@/shared/utils/page";
import type { Game } from "@/shared/types/domain";
import type { SearchRequest } from "@/shared/types/search";

/** Détail d'un sujet (DTO brut : on lit `questionsCounter`, `emoji`, `color`). */
export function useTopic(topicId: string) {
  return useQuery({
    queryKey: queryKeys.topics.detail(topicId),
    queryFn: () => topicsService.getById(topicId),
    staleTime: 10 * 60 * 1000,
  });
}

/** Suivi du sujet par l'utilisateur courant (record de suivi + followId). */
export function useTopicFollow(topicId: string) {
  const userId = getUserId();
  return useQuery({
    queryKey: ["topic-follow", topicId, userId],
    queryFn: () =>
      topicFollowsService.search({
        filters: [
          { property: "topicId", operator: "EQUALS", value: topicId },
          ...(userId
            ? [{ property: "userId", operator: "EQUALS", value: userId } as const]
            : []),
        ],
        page: { number: 0, size: 1 },
      }),
    enabled: !!userId,
    select: (page) => page.content[0] ?? null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useToggleTopicFollow(topicId: string) {
  const queryClient = useQueryClient();
  const userId = getUserId();
  const followKey = ["topic-follow", topicId, userId];

  const follow = useMutation({
    mutationFn: () => topicFollowsService.follow(topicId),
    onSuccess: (data) => {
      // Mise à jour optimiste : la projection topic-follows est en lecture différée.
      queryClient.setQueryData(
        followKey,
        pageOf({
          followId: data.id,
          topicId,
          userId,
          followedAt: new Date().toISOString(),
        }),
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
    },
  });

  const unfollow = useMutation({
    mutationFn: (followId: string) => topicFollowsService.unfollow(followId),
    onSuccess: () => {
      queryClient.setQueryData(followKey, emptyPage());
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
    },
  });

  return { follow, unfollow };
}

export function useTopicLeaderboard(
  topicId: string,
  period: LeaderboardPeriod,
  scope: LeaderboardScope,
) {
  return useQuery({
    queryKey: queryKeys.leaderboard.topic(topicId, period, scope),
    queryFn: () => leaderboardService.topByTopic(topicId, period, scope, 50),
    staleTime: 5 * 60 * 1000,
  });
}

/** Rang du joueur courant dans le sujet (undefined si non classé — endpoint 204). */
export function useMyRank(
  topicId: string,
  period: LeaderboardPeriod = "all-time",
  scope: LeaderboardScope = "world",
) {
  const userId = getUserId();
  return useQuery({
    queryKey: [...queryKeys.leaderboard.topic(topicId, period, scope), "me", userId],
    queryFn: () => leaderboardService.myRank(topicId, period, scope),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    select: (entry) => entry ?? null,
  });
}

export function useTopicProgress(topicId: string) {
  const userId = getUserId();
  return useQuery({
    queryKey: queryKeys.profiles.topicProgress(userId ?? "", topicId),
    queryFn: () => profilesService.getTopicProgress(userId as string, topicId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Parties d'un joueur (comme joueur 1 ou joueur 2), via deux `POST /games/search`
 * (le backend ne propose pas d'endpoint « parties d'un joueur »).
 */
export function useUserGames(): { data: Game[] | undefined; isLoading: boolean } {
  const userId = getUserId();

  const asPlayer1Request: SearchRequest = {
    filters: [{ property: "player1Id", operator: "EQUALS", value: userId }],
    sorts: [{ property: "createdAt", direction: "DESC" }],
    page: { number: 0, size: 200 },
  };
  const asPlayer2Request: SearchRequest = {
    filters: [{ property: "player2Id", operator: "EQUALS", value: userId }],
    sorts: [{ property: "createdAt", direction: "DESC" }],
    page: { number: 0, size: 200 },
  };

  const asPlayer1 = useQuery({
    queryKey: queryKeys.games.search(asPlayer1Request),
    queryFn: () => gamesService.search(asPlayer1Request),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    select: (page) => page.content,
  });
  const asPlayer2 = useQuery({
    queryKey: queryKeys.games.search(asPlayer2Request),
    queryFn: () => gamesService.search(asPlayer2Request),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    select: (page) => page.content,
  });

  const games = useMemo(() => {
    if (!asPlayer1.data && !asPlayer2.data) return undefined;
    const byId = new Map<string, Game>();
    [...(asPlayer1.data ?? []), ...(asPlayer2.data ?? [])].forEach((game) =>
      byId.set(game.gameId, game),
    );
    return [...byId.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [asPlayer1.data, asPlayer2.data]);

  return {
    data: games,
    isLoading: asPlayer1.isLoading || asPlayer2.isLoading,
  };
}
