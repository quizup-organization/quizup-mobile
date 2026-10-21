/** Type d'une notification d'inbox (contrat BFF `NotificationView`). */
export type NotificationType =
  | "FOLLOW"
  | "CHALLENGE_RECEIVED"
  | "CHALLENGE_DECLINED"
  | "ROOM_ACCEPTED"
  | "WIZZ"
  | "QUESTION_REPORTED"
  | "ACCOUNT_SUSPENDED";

/** Vue d'une notification personnelle (REST + push). */
export interface NotificationView {
  notificationId: string;
  type: NotificationType;
  actorId: string | null;
  sourceId: string | null;
  topicId: string | null;
  gameId: string | null;
  expiresAt: string | null;
  readAt: string | null;
  createdAt: string;
  actorSuspended?: boolean;
}

export type NotificationCategory = "FOLLOW" | "ROOM" | "QUESTION" | "ACCOUNT";

export interface NotificationPreferenceView {
  category: NotificationCategory;
  enabled: boolean;
}

export function isUnread(notification: NotificationView): boolean {
  return notification.readAt === null;
}

/** Libellé français de l'inbox (la version web passe par i18next). */
export function notificationLabel(
  type: NotificationType,
  actorName: string,
): string {
  switch (type) {
    case "FOLLOW":
      return `${actorName} t'a suivi`;
    case "CHALLENGE_RECEIVED":
      return `${actorName} t'a défié`;
    case "CHALLENGE_DECLINED":
      return `${actorName} a refusé ton défi`;
    case "ROOM_ACCEPTED":
      return `${actorName} a rejoint ta salle`;
    case "WIZZ":
      return `${actorName} te relance`;
    case "QUESTION_REPORTED":
      return "Une question a été signalée";
    case "ACCOUNT_SUSPENDED":
      return "Ton compte a été suspendu";
    default:
      return "Notification";
  }
}

export function relativeTime(iso: string): string {
  const elapsedMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(elapsedMs / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "hier" : `il y a ${days} j`;
  return new Date(iso).toLocaleDateString("fr-FR");
}
