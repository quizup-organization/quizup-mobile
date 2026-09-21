import { config } from "./config";

/**
 * Tous les endpoints passent par la gateway (sauf l'échange OIDC, adressé directement
 * à l'issuer `quizup-identity`).
 */
export const ENDPOINTS = {
  auth: {
    requestCode: `${config.oidcAuthority}/api/auth/request-code`,
    verifyCode: `${config.oidcAuthority}/api/auth/verify-code`,
    logout: `${config.oidcAuthority}/api/auth/logout`,
  },
  topics: {
    search: "/theme-service/api/topics/search",
    categories: "/theme-service/api/topics/categories",
    detail: (topicId: string) => `/theme-service/api/topics/${topicId}`,
  },
  questions: {
    search: "/theme-service/api/questions/search",
    detail: (questionId: string) =>
      `/theme-service/api/questions/${questionId}`,
  },
  topicFollows: {
    search: "/social-service/api/topic-follows/search",
    create: "/social-service/api/topic-follows",
    delete: (followId: string) => `/social-service/api/topic-follows/${followId}`,
  },
  userFollows: {
    search: "/social-service/api/user-follows/search",
    create: "/social-service/api/user-follows",
    delete: (followId: string) => `/social-service/api/user-follows/${followId}`,
  },
  challenges: {
    search: "/social-service/api/challenges/search",
    create: "/social-service/api/challenges",
    detail: (challengeId: string) =>
      `/social-service/api/challenges/${challengeId}`,
    accept: (challengeId: string) =>
      `/social-service/api/challenges/${challengeId}/accept`,
    decline: (challengeId: string) =>
      `/social-service/api/challenges/${challengeId}/decline`,
  },
  profiles: {
    detail: (userId: string) => `/profile-service/api/profiles/${userId}`,
    update: (userId: string) => `/profile-service/api/profiles/${userId}`,
    search: "/profile-service/api/profiles/search",
    progress: (userId: string) =>
      `/profile-service/api/profiles/${userId}/progress`,
    topicProgress: (userId: string, topicId: string) =>
      `/profile-service/api/profiles/${userId}/progress/${topicId}`,
  },
  leaderboard: {
    topic: (topicId: string, period: string, scope: string, limit = 50) =>
      `/leaderboard-service/api/leaderboard/topics/${topicId}?period=${period}&scope=${scope}&limit=${limit}`,
    me: (topicId: string, period: string, scope: string) =>
      `/leaderboard-service/api/leaderboard/topics/${topicId}/me?period=${period}&scope=${scope}`,
  },
  games: {
    create: "/game-service/api/games",
    search: "/game-service/api/games/search",
    time: "/game-service/api/games/time",
    detail: (gameId: string) => `/game-service/api/games/${gameId}`,
    answer: (gameId: string) => `/game-service/api/games/${gameId}/answer`,
    cancel: (gameId: string) => `/game-service/api/games/${gameId}/cancel`,
  },
  matchmaking: {
    queue: "/matchmaking-service/api/matchmaking/queue",
    ticket: (ticketId: string) =>
      `/matchmaking-service/api/matchmaking/queue/${ticketId}`,
  },
} as const;
