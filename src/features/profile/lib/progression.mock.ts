import type {
  PlayerTitles,
  Reward,
  RewardsCatalog,
} from "@/features/profile/domain/progression";
import { db, topicRef } from "@/mocks/db";
import { assertSuccess, mockDelay } from "@/mocks/scenario";

const RANK_BY_GRADE: Record<string, string> = {
  APPRENTI: "FER",
  PRATIQUANT: "BRONZE",
  CONFIRME: "ARGENT",
  EXPERT: "OR",
  MAITRE: "PLATINE",
};

const REWARDS: Reward[] = [
  {
    code: "MICAH_AVATAR",
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    source: "BADGE",
    condition: {
      badgeCode: "ASSIDUITY_BRONZE",
      badgeLabel: "Régulier",
      target: 7,
    },
  },
  {
    code: "LORELEI_AVATAR",
    unlocked: false,
    unlockedAt: null,
    source: null,
    condition: {
      badgeCode: "MASTERY_OR",
      badgeLabel: "Maîtrise confirmée",
      target: 1,
    },
  },
  {
    code: "NOTIONISTS_AVATAR",
    unlocked: false,
    unlockedAt: null,
    source: null,
    condition: {
      badgeCode: "MASTERY_DIAMANT",
      badgeLabel: "Maîtrise légendaire",
      target: 1,
    },
  },
];

export const progressionService = {
  async titles(userId: string): Promise<PlayerTitles> {
    await mockDelay(220);
    assertSuccess();
    const titles = Object.entries(db.progress)
      .filter(([, progress]) => progress.games > 0)
      .flatMap(([topicId, progress]) => {
        const topic = topicRef(topicId);
        return [
          {
            key: `${topicId}:${progress.grade}`,
            topicId,
            grade: progress.grade,
            rank: RANK_BY_GRADE[progress.grade] ?? null,
            gradeProgressPercent: progress.gradeProgressPercent,
            gradeRemainingXp: progress.gradeRemainingXp,
            nextGrade: progress.nextGrade,
            topic,
          },
        ];
      });

    return {
      equippedKey:
        db.me.userId === userId ? (db.me.equippedTitle ?? null) : null,
      titles,
    };
  },

  async rewards(): Promise<RewardsCatalog> {
    await mockDelay(180);
    assertSuccess();
    const unlocked = new Set(db.me.rewards ?? []);
    return {
      rewards: REWARDS.map((reward) => ({
        ...reward,
        unlocked: unlocked.has(reward.code),
      })),
    };
  },
};
