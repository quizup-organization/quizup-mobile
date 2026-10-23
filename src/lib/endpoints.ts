/** Endpoints BFF consommés directement par l'app mobile. */
export const ENDPOINTS = {
  me: "/api/me",
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
  },
  challenges: {
    mine: "/api/challenges/mine",
    accept: (challengeId: string) =>
      `/api/challenges/${challengeId}/accept`,
    decline: (challengeId: string) =>
      `/api/challenges/${challengeId}/decline`,
    cancel: (challengeId: string) => `/api/challenges/${challengeId}/cancel`,
  },
  rooms: {
    mine: "/api/rooms/mine",
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
