/** Langue supportée par le BFF (code ISO 639-1). */
export type Language = "fr" | "en";

export type PresenceStatus = "ONLINE" | "OFFLINE";

/** Présence d'un joueur (`PresenceView`, REST et push WS). */
export interface Presence {
  userId: string;
  status: PresenceStatus;
  lastSeenAt: string | null;
}

export function isOnline(presence: Presence | null | undefined): boolean {
  return presence?.status === "ONLINE";
}

export interface Badge {
  code: string;
  label: string;
}

/** Progression d'un joueur (`ProgressionView`). */
export interface Progression {
  xpTotal: number;
  level: number;
  title: string;
  xpForNextLevel: number;
  levelProgressPercent: number;
  badges: Badge[];
}

/** Statistiques de duels d'un joueur (`DuelStatsView`). */
export interface DuelStats {
  played: number;
  wins: number;
  losses: number;
  draws: number;
  winPercent: number;
  bestScore: number;
  currentWinStreak: number;
  bestWinStreak: number;
}

/** Référence minimale d'un joueur (`UserRefView`). */
export interface UserRef {
  userId: string;
  pseudonym: string | null;
  avatarOptions: string | null;
  suspended?: boolean;
}

/** Carte joueur (`PlayerCardView`) — listes Abonnements / Abonnés. */
export interface PlayerCard {
  userId: string;
  pseudonym: string | null;
  avatarOptions: string | null;
  level: number;
  title: string | null;
  following: boolean;
  presence: Presence | null;
  suspended?: boolean;
}

/** Fiche joueur complète (`PlayerProfileView`). */
export interface PlayerProfile {
  userId: string;
  pseudonym: string | null;
  bio: string | null;
  country: string | null;
  avatarOptions: string | null;
  bannerUrl: string | null;
  isMe: boolean;
  following: boolean;
  presence: Presence | null;
  progression: Progression;
  stats: DuelStats;
  followersCount: number;
  equippedTitle?: string | null;
  followingCount: number;
  suspended?: boolean;
  bot?: boolean;
}

export type PeopleDirection = "following" | "followers";

export type PeopleSort = "RECENT" | "LEVEL" | "ALPHA";

export interface PeopleParams {
  q?: string;
  sort?: PeopleSort;
  page?: number;
  size?: number;
}
