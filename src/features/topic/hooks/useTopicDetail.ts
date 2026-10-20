import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { profileGamesService } from "@/lib/services/profile-games";
import { topicsService } from "@/lib/services/topics";
import type {
  ProfileGamesParams,
  TopicLeaderboardParams,
  TopicOverviewView,
} from "@/shared/types/bff";

const OVERVIEW_STALE_MS = 30 * 1000;
const LEADERBOARD_STALE_MS = 5 * 60 * 1000;
const HISTORY_STALE_MS = 2 * 60 * 1000;

export const TOPIC_LEADERBOARD_PAGE_SIZE = 25;
export const TOPIC_HISTORY_PAGE_SIZE = 20;

/** Fiche agrégée d'un sujet : carte (suivi inclus), rang réel et progression du joueur. */
export function useTopicOverview(topicId: string) {
  return useQuery({
    queryKey: queryKeys.topics.overview(topicId),
    queryFn: () => topicsService.overview(topicId),
    enabled: !!topicId,
    staleTime: OVERVIEW_STALE_MS,
    refetchOnWindowFocus: true,
  });
}

/**
 * Suivi/ne plus suivre un sujet, **optimiste** : la fiche est simulée au clic, restaurée en
 * erreur, puis réconciliée avec la projection serveur (elle peut être en lecture différée).
 */
export function useToggleTopicFollow(topicId: string) {
  const queryClient = useQueryClient();
  const overviewKey = queryKeys.topics.overview(topicId);

  function patchOverview(next: boolean) {
    queryClient.setQueryData<TopicOverviewView>(overviewKey, (previous) =>
      previous
        ? {
            ...previous,
            topic: {
              ...previous.topic,
              followed: next,
              followersCount: Math.max(
                0,
                previous.topic.followersCount + (next ? 1 : -1),
              ),
            },
          }
        : previous,
    );
  }

  /** Relit la fiche jusqu'à ce que la projection reflète l'écriture (max ~2,5 s). */
  async function reconcile(expected: boolean) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        const overview = await topicsService.overview(topicId);
        queryClient.setQueryData(overviewKey, overview);
        if (overview.topic.followed === expected) return;
      } catch {
        return;
      }
    }
    void queryClient.invalidateQueries({ queryKey: overviewKey });
  }

  return useMutation({
    mutationFn: (next: boolean) =>
      next ? topicsService.follow(topicId) : topicsService.unfollow(topicId),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: overviewKey });
      const previous = queryClient.getQueryData<TopicOverviewView>(overviewKey);
      patchOverview(next);
      return { previous };
    },
    onError: (_error, _next, context) => {
      if (context?.previous) {
        queryClient.setQueryData(overviewKey, context.previous);
      }
    },
    onSuccess: (_data, next) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.home() });
      void reconcile(next);
    },
  });
}

/**
 * Classement d'un sujet en **scroll infini** (25 entrées par page) + rang du joueur courant
 * dans la même portée. Les filtres changent la clé : un filtre repart de la première page.
 */
export function useTopicLeaderboard(
  topicId: string,
  params: Omit<TopicLeaderboardParams, "page" | "size">,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.topics.leaderboard(topicId, params),
    queryFn: ({ pageParam }) =>
      topicsService.leaderboard(topicId, {
        ...params,
        page: pageParam,
        size: TOPIC_LEADERBOARD_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.entries.last ? undefined : lastPage.entries.page + 1,
    enabled: !!topicId,
    staleTime: LEADERBOARD_STALE_MS,
    placeholderData: keepPreviousData,
  });
}

/** Historique paginé des duels du joueur courant sur un sujet. */
export function useTopicGames(
  userId: string | null | undefined,
  params: Omit<ProfileGamesParams, "page" | "size">,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.profiles.games(userId ?? "", params),
    queryFn: ({ pageParam }) =>
      profileGamesService.list(userId as string, {
        ...params,
        page: pageParam,
        size: TOPIC_HISTORY_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    enabled: !!userId,
    staleTime: HISTORY_STALE_MS,
    placeholderData: keepPreviousData,
  });
}
