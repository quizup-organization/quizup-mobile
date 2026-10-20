import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  Page,
  TopicCardView,
  TopicFacetsParams,
  TopicFacetsView,
  TopicLeaderboardParams,
  TopicLeaderboardView,
  TopicListParams,
  TopicOverviewView,
} from "@/shared/types/bff";

const MAX_PAGE_SIZE = 100;

/** Catalogue, facettes, fiche agrégée, suivi et classement d'un sujet (`/api/**`). */
export const topicsService = {
  list: (params: TopicListParams = {}): Promise<Page<TopicCardView>> =>
    api.get<Page<TopicCardView>>(ENDPOINTS.topics.list, {
      params: {
        q: params.q?.trim() || undefined,
        category: params.category,
        followed: params.followed ? true : undefined,
        sort: params.sort,
        page: params.page ?? 0,
        size: Math.min(params.size ?? 24, MAX_PAGE_SIZE),
      },
    }),

  facets: (params: TopicFacetsParams = {}): Promise<TopicFacetsView> =>
    api.get<TopicFacetsView>(ENDPOINTS.topics.facets, {
      params: {
        q: params.q?.trim() || undefined,
        followed: params.followed ? true : undefined,
      },
    }),

  overview: (topicId: string): Promise<TopicOverviewView> =>
    api.get<TopicOverviewView>(ENDPOINTS.topics.overview(topicId)),

  follow: (topicId: string): Promise<void> =>
    api.put<void>(ENDPOINTS.topics.follow(topicId)),

  unfollow: (topicId: string): Promise<void> =>
    api.delete<void>(ENDPOINTS.topics.follow(topicId)),

  leaderboard: (
    topicId: string,
    params: TopicLeaderboardParams = {},
  ): Promise<TopicLeaderboardView> =>
    api.get<TopicLeaderboardView>(ENDPOINTS.topics.leaderboard(topicId), {
      params: {
        period: params.period ?? "ALL_TIME",
        month: params.month,
        scope: params.scope ?? "WORLD",
        page: params.page ?? 0,
        size: Math.min(params.size ?? 25, MAX_PAGE_SIZE),
      },
    }),
};
