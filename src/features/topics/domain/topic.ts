/** Noms localisés d'un sujet (clé = langue, FR de référence, EN optionnel). */
import type { Page } from "@/shared/types/api";

export type TopicNames = Partial<Record<"fr" | "en", string>>;

/** Résout le nom d'un sujet pour une langue : langue demandée → FR → EN → fallback. */
export function topicName(
  names: TopicNames | null | undefined,
  language: "fr" | "en",
  fallback = "",
): string {
  if (!names) return fallback;
  return names[language] ?? names.fr ?? names.en ?? fallback;
}

export type TopicSort = "POPULAR" | "MOST_PLAYED" | "ALPHA" | "RECENT";

export type TopicStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type LeaderboardPeriod = "ALL_TIME" | "MONTHLY";

export type LeaderboardScope = "WORLD" | "FOLLOWING" | "COUNTRY";

/** Carte de sujet (`TopicCardView`). */
export interface TopicCard {
  topicId: string;
  names: TopicNames;
  description: string | null;
  category: string | null;
  categoryLabel: string | null;
  emoji: string | null;
  color: string | null;
  imageUrl: string | null;
  bannerUrl: string | null;
  followersCount: number;
  questionsCount: number;
  followed: boolean;
  status: TopicStatus;
}

/** Référence minimale d'un sujet (`TopicRefView`). */
export interface TopicRef {
  topicId: string;
  names: TopicNames;
  category: string | null;
  emoji: string | null;
  color: string | null;
  imageUrl: string | null;
  titles: Record<string, Record<string, string>> | null;
}

/** Catégorie de sujet (`TopicCategoryView`). */
export interface TopicCategory {
  category: string;
  label: string;
}

/** Compteur d'une catégorie (`TopicFacetsView.CategoryFacetView`). */
export interface TopicCategoryFacet {
  category: string;
  label: string;
  count: number;
}

/** Facettes du catalogue (`TopicFacetsView`). */
export interface TopicFacets {
  total: number;
  categories: TopicCategoryFacet[];
}

/** Progression du joueur courant sur un sujet (`TopicOverviewView.MyProgressView`). */
export interface TopicProgress {
  xp: number;
  games: number;
  level: number;
  title: string;
  xpForNextLevel: number;
  levelProgressPercent: number;
  completedQuestions: number;
  totalQuestions: number;
  completionPercent: number;
  grade: string;
  gradeProgressPercent: number;
  gradeRemainingXp: number;
  nextGrade: string | null;
}

/** Vue agrégée de la fiche sujet (`TopicOverviewView`). */
export interface TopicOverview {
  topic: TopicCard;
  titles: Record<string, Record<string, string>> | null;
  myRank: number | null;
  myProgress: TopicProgress;
  canManage: boolean;
}

/** Entrée de classement (`TopicLeaderboardView.EntryView`). */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  pseudonym: string | null;
  avatarOptions: string | null;
  country: string | null;
  level: number;
  totalXp: number;
  monthlyXp: number;
  suspended?: boolean;
}

/** Classement d'un sujet (`TopicLeaderboardView`). */
export interface TopicLeaderboard {
  entries: Page<LeaderboardEntry>;
  me: LeaderboardEntry | null;
}

export interface TopicListParams {
  q?: string;
  category?: string;
  followed?: boolean;
  sort?: TopicSort;
  page?: number;
  size?: number;
}

export interface TopicFacetsParams {
  q?: string;
  followed?: boolean;
}

export interface TopicLeaderboardParams {
  period?: LeaderboardPeriod;
  scope?: LeaderboardScope;
  month?: string;
  page?: number;
  size?: number;
}
