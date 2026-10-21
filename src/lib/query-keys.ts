import type {
  PeopleDirection,
  PeopleParams,
} from "@/features/player/domain/profile";
import type {
  TopicFacetsParams,
  TopicLeaderboardParams,
  TopicListParams,
} from "@/features/topics/domain/topic";

/** Fabrique de clés hiérarchiques (cache React Query) — mêmes formes que quizup-web. */
export const queryKeys = {
  me: () => ["me"] as const,
  home: () => ["home"] as const,
  topics: {
    all: ["topics"] as const,
    list: (params: TopicListParams) => ["topics", "list", params] as const,
    facets: (params: TopicFacetsParams) =>
      ["topics", "facets", params] as const,
    categories: () => ["topics", "categories"] as const,
    overview: (topicId: string) => ["topics", "overview", topicId] as const,
    leaderboard: (topicId: string, params: TopicLeaderboardParams) =>
      ["topics", "leaderboard", topicId, params] as const,
  },
  profiles: {
    all: ["profiles"] as const,
    detail: (userId: string) => ["profiles", "detail", userId] as const,
    people: (
      userId: string,
      direction: PeopleDirection,
      params: PeopleParams,
    ) => ["profiles", "people", userId, direction, params] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params: { unreadOnly: boolean; page: number; size: number }) =>
      ["notifications", "list", params] as const,
    unreadCount: () => ["notifications", "unread-count"] as const,
    preferences: () => ["notification-preferences"] as const,
  },
  challenges: {
    all: ["challenges"] as const,
    list: () => ["challenges", "list"] as const,
    pendingCount: () => ["challenges", "pending-count"] as const,
  },
  search: {
    players: (query: string) => ["search", "players", query] as const,
  },
} as const;
