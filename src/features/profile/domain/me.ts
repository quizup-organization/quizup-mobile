import type {
  DuelStats,
  Language,
  Progression,
} from "@/features/player/domain/profile";

/** Joueur courant (`MeView`). */
export interface Me {
  userId: string;
  email: string | null;
  pseudonym: string | null;
  bio: string | null;
  country: string | null;
  avatarOptions: string | null;
  bannerUrl: string | null;
  language: Language;
  equippedTitle?: string | null;
  progression: Progression;
  stats: DuelStats;
  followingCount: number;
  followersCount: number;
}
