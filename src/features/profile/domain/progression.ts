import type { TopicRef } from "@/features/topics/domain/topic";

/** Titre débloqué (`TitlesView.TitleView`). */
export interface ProgressionTitle {
  key: string;
  topicId: string;
  grade: string;
  rank: string | null;
  gradeProgressPercent: number;
  gradeRemainingXp: number;
  nextGrade: string | null;
  topic: TopicRef;
}

/** Titres d'un joueur (`TitlesView`). */
export interface PlayerTitles {
  equippedKey: string | null;
  titles: ProgressionTitle[];
}

export interface RewardCondition {
  badgeCode: string;
  badgeLabel: string;
  target: number;
}

/** Récompense du catalogue (`RewardsView.RewardView`). */
export interface Reward {
  code: string;
  unlocked: boolean;
  unlockedAt: string | null;
  source: string | null;
  condition: RewardCondition;
}

export interface RewardsCatalog {
  rewards: Reward[];
}
