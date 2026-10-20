import { config } from "./config";

/**
 * Endpoints de la surface BFF (`/api/**`) et de la surface d'authentification native de
 * `quizup-identity`.
 *
 * <p>L'auth mobile est préfixée `/api/auth/mobile/**` et retourne directement les tokens.
 * Seul le refresh utilise le endpoint OIDC standard `/oauth2/token`.</p>
 */
export const ENDPOINTS = {
  auth: {
    requestLoginCode: `${config.identityUrl}/api/auth/mobile/request-login-code`,
    loginWithCode: `${config.identityUrl}/api/auth/mobile/login-with-code`,
    loginWithGoogle: `${config.identityUrl}/api/auth/mobile/login-with-google`,
    loginWithFacebook: `${config.identityUrl}/api/auth/mobile/login-with-facebook`,
    logout: `${config.identityUrl}/api/auth/mobile/logout`,
    token: `${config.identityUrl}/oauth2/token`,
  },
  me: "/api/me",
  home: "/api/home",
  topics: {
    list: "/api/topics",
    facets: "/api/topics/facets",
    overview: (topicId: string) => `/api/topics/${topicId}/overview`,
    leaderboard: (topicId: string) =>
      `/api/topics/${topicId}/leaderboard`,
    follow: (topicId: string) => `/api/topics/${topicId}/follow`,
  },
  profiles: {
    games: (userId: string) => `/api/profiles/${userId}/games`,
  },
  rooms: {
    create: "/api/rooms",
    bot: "/api/rooms/bot",
    mine: "/api/rooms/mine",
    detail: (roomId: string) => `/api/rooms/${roomId}`,
    join: (roomId: string) => `/api/rooms/${roomId}/join`,
    leave: (roomId: string) => `/api/rooms/${roomId}/leave`,
    cancel: (roomId: string) => `/api/rooms/${roomId}/cancel`,
    wizz: (roomId: string) => `/api/rooms/${roomId}/wizz`,
    notifications: (roomId: string) =>
      `/api/rooms/${roomId}/notifications`,
  },
  games: {
    active: "/api/games?active=true",
    answer: (gameId: string) => `/api/games/${gameId}/answer`,
    abandon: (gameId: string) => `/api/games/${gameId}/abandon`,
    cancel: (gameId: string) => `/api/games/${gameId}/cancel`,
    result: (gameId: string) => `/api/games/${gameId}/result`,
    notifications: (gameId: string) =>
      `/api/games/${gameId}/notifications`,
  },
  matchmaking: {
    tickets: "/api/matchmaking/tickets",
    ticket: (ticketId: string) =>
      `/api/matchmaking/tickets/${ticketId}`,
    cancel: (ticketId: string) =>
      `/api/matchmaking/tickets/${ticketId}/cancel`,
    notifications: (ticketId: string) =>
      `/api/matchmaking/tickets/${ticketId}/notifications`,
  },
  profileSettings: {
    pseudonym: (userId: string) => `/api/profiles/${userId}/pseudonym`,
    bio: (userId: string) => `/api/profiles/${userId}/bio`,
    country: (userId: string) => `/api/profiles/${userId}/country`,
    language: (userId: string) => `/api/profiles/${userId}/language`,
  },
} as const;
