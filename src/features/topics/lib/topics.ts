import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { isMockData } from "@/lib/config";
import type { Page } from "@/shared/types/api";
import type {
  TopicCard,
  TopicCategory,
  TopicFacets,
  TopicFacetsParams,
  TopicLeaderboard,
  TopicLeaderboardParams,
  TopicListParams,
  TopicOverview,
} from "../domain/topic";
import { topicsService as mockTopicsService } from "./topics.mock";

const MAX_PAGE_SIZE = 100;

const apiTopicsService = {
  list: (params: TopicListParams = {}): Promise<Page<TopicCard>> =>
    api.get<Page<TopicCard>>(ENDPOINTS.topics.list, {
      params: {
        q: params.q?.trim() || undefined,
        category: params.category,
        followed: params.followed ? true : undefined,
        mine: params.mine ? true : undefined,
        sort: params.sort,
        page: params.page ?? 0,
        size: Math.min(params.size ?? 24, MAX_PAGE_SIZE),
      },
    }),

  facets: (params: TopicFacetsParams = {}): Promise<TopicFacets> =>
    api.get<TopicFacets>(ENDPOINTS.topics.facets, {
      params: {
        q: params.q?.trim() || undefined,
        followed: params.followed ? true : undefined,
      },
    }),

  categories: (): Promise<TopicCategory[]> =>
    api.get<TopicCategory[]>(ENDPOINTS.topics.categories),

  overview: (topicId: string): Promise<TopicOverview> =>
    api.get<TopicOverview>(ENDPOINTS.topics.overview(topicId)),

  leaderboard: (
    topicId: string,
    params: TopicLeaderboardParams = {},
  ): Promise<TopicLeaderboard> =>
    api.get<TopicLeaderboard>(ENDPOINTS.topics.leaderboard(topicId), {
      params: {
        period: params.period,
        scope: params.scope,
        month: params.month,
        page: params.page ?? 0,
        size: Math.min(params.size ?? 20, MAX_PAGE_SIZE),
      },
    }),

  follow: (topicId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.topics.follow(topicId)),

  unfollow: (topicId: string): Promise<void> =>
    api.delete<void>(ENDPOINTS.topics.follow(topicId)),
};

/** Catalogue et fiche sujet via le BFF, ou base de démonstration locale. */
export const topicsService = isMockData
  ? mockTopicsService
  : apiTopicsService;
