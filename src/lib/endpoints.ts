/** Endpoints BFF consommés directement par l'app mobile. */
export const ENDPOINTS = {
  me: "/api/me",
  meOnboarding: "/api/me/onboarding/complete",
  meRewards: "/api/me/rewards",
  home: "/api/home",
  suggestions: "/api/suggestions",
  topics: {
    list: "/api/topics",
    facets: "/api/topics/facets",
    categories: "/api/topic-categories",
    overview: (topicId: string) => `/api/topics/${topicId}/overview`,
    leaderboard: (topicId: string) => `/api/topics/${topicId}/leaderboard`,
    follow: (topicId: string) => `/api/topics/${topicId}/follow`,
  },
  profiles: {
    detail: (userId: string) => `/api/profiles/${userId}`,
    following: (userId: string) => `/api/profiles/${userId}/following`,
    followers: (userId: string) => `/api/profiles/${userId}/followers`,
    follow: (userId: string) => `/api/profiles/${userId}/follow`,
    titles: (userId: string) => `/api/profiles/${userId}/titles`,
    pseudonym: (userId: string) => `/api/profiles/${userId}/pseudonym`,
    bio: (userId: string) => `/api/profiles/${userId}/bio`,
    country: (userId: string) => `/api/profiles/${userId}/country`,
    language: (userId: string) => `/api/profiles/${userId}/language`,
    avatarOptions: (userId: string) => `/api/profiles/${userId}/avatar-options`,
    banner: (userId: string) => `/api/profiles/${userId}/banner`,
    games: (userId: string) => `/api/profiles/${userId}/games`,
    headToHead: (userId: string) => `/api/profiles/${userId}/head-to-head`,
    topics: (userId: string) => `/api/profiles/${userId}/topics`,
    activity: (userId: string) => `/api/profiles/${userId}/activity`,
  },
  challenges: {
    create: "/api/challenges",
    mine: "/api/challenges/mine",
    accept: (challengeId: string) =>
      `/api/challenges/${challengeId}/accept`,
    decline: (challengeId: string) =>
      `/api/challenges/${challengeId}/decline`,
    cancel: (challengeId: string) => `/api/challenges/${challengeId}/cancel`,
  },
  rooms: {
    create: "/api/rooms",
    mine: "/api/rooms/mine",
    bot: "/api/rooms/bot",
    detail: (roomId: string) => `/api/rooms/${roomId}`,
    join: (roomId: string) => `/api/rooms/${roomId}/join`,
    leave: (roomId: string) => `/api/rooms/${roomId}/leave`,
    cancel: (roomId: string) => `/api/rooms/${roomId}/cancel`,
    wizz: (roomId: string) => `/api/rooms/${roomId}/wizz`,
  },
  matchmaking: {
    tickets: "/api/matchmaking/tickets",
    ticket: (ticketId: string) => `/api/matchmaking/tickets/${ticketId}`,
    cancel: (ticketId: string) =>
      `/api/matchmaking/tickets/${ticketId}/cancel`,
  },
  games: {
    active: "/api/games",
    answer: (gameId: string) => `/api/games/${gameId}/answer`,
    abandon: (gameId: string) => `/api/games/${gameId}/abandon`,
    result: (gameId: string) => `/api/games/${gameId}/result`,
    notifications: (gameId: string) =>
      `/api/games/${gameId}/notifications`,
  },
  notifications: {
    list: "/api/notifications",
    unreadCount: "/api/notifications/unread-count",
    read: (notificationId: string) =>
      `/api/notifications/${notificationId}/read`,
    unread: (notificationId: string) =>
      `/api/notifications/${notificationId}/unread`,
    remove: (notificationId: string) =>
      `/api/notifications/${notificationId}`,
    removeAll: "/api/notifications",
    readAll: "/api/notifications/read-all",
    preferences: "/api/notification-preferences",
    preference: (category: string) =>
      `/api/notification-preferences/${category}`,
  },
} as const;
