import type { SearchRequest } from "@/shared/types/search";

/**
 * Fabrique de clés de requête hiérarchiques (cache React Query).
 */
export const queryKeys = {
  topics: {
    all: ["topics"] as const,
    search: (params: SearchRequest) => ["topics", "search", params] as const,
    detail: (topicId: string) => ["topics", "detail", topicId] as const,
    categories: () => ["topics", "categories"] as const,
  },
  topicFollows: {
    all: ["topic-follows"] as const,
    search: (params: SearchRequest) => ["topic-follows", "search", params] as const,
  },
  userFollows: {
    all: ["user-follows"] as const,
    following: (userId: string) => ["user-follows", "following", userId] as const,
    followers: (userId: string) => ["user-follows", "followers", userId] as const,
    counts: (userId: string) => ["user-follows", "counts", userId] as const,
  },
  challenges: {
    all: ["challenges"] as const,
    search: (params: SearchRequest) => ["challenges", "search", params] as const,
    detail: (challengeId: string) =>
      ["challenges", "detail", challengeId] as const,
  },
  profiles: {
    all: ["profiles"] as const,
    detail: (userId: string) => ["profiles", "detail", userId] as const,
    progress: (userId: string) => ["profiles", "progress", userId] as const,
    topicProgress: (userId: string, topicId: string) =>
      ["profiles", "progress", userId, topicId] as const,
    search: (params: SearchRequest) => ["profiles", "search", params] as const,
  },
  leaderboard: {
    all: ["leaderboard"] as const,
    topic: (topicId: string, period: string, scope: string) =>
      ["leaderboard", topicId, period, scope] as const,
  },
  games: {
    all: ["games"] as const,
    search: (params: SearchRequest) => ["games", "search", params] as const,
    detail: (gameId: string) => ["games", "detail", gameId] as const,
  },
  questions: {
    detail: (questionId: string) => ["questions", "detail", questionId] as const,
  },
  matchmaking: {
    ticket: (ticketId: string) => ["matchmaking", "ticket", ticketId] as const,
  },
} as const;
