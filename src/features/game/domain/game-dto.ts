import type { UserRef } from "@/features/player/domain/profile";
import type { TopicRef } from "@/features/topics/domain/topic";

/** Choix de réponse à une question (enum backend `GameQuestionChoice`). */
export type GameChoice = "A" | "B" | "C" | "D";

export function isGameChoice(value: string): value is GameChoice {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

export type BotDifficulty = "EASY" | "NORMAL" | "HARD";

export type GamePlayerType = "HUMAN" | "BOT";

export type GameStatus = "IN_PROGRESS" | "FINISHED" | "CANCELED";

/** Partie active du joueur (`ActiveGameView`) — bannière de reprise. */
export interface ActiveGameView {
  gameId: string;
  topic: TopicRef;
  opponent: UserRef | null;
  opponentType: GamePlayerType;
  status: "IN_PROGRESS";
  createdAt: string;
}

/** Récompense d'un duel terminé (`GameResultView.reward`). */
export interface GameResultReward {
  xp: number;
  victoryBonus: number;
}

/** Bilan autoritaire d'une partie (`GET /api/games/{gameId}/result`). */
export interface GameResultView {
  myScore: number;
  opponentScore: number;
  winnerId: string | null;
  botGame: boolean;
  basePoints: number;
  speedBonus: number;
  correctAnswers: number;
  fastAnswers: number;
  answeredRounds: number;
  totalRounds: number;
  reward: GameResultReward | null;
  progression: {
    rating: number;
    peakRating: number;
    ratedGames: number;
    provisional: boolean;
  };
  topicMastery: {
    xp: number;
    xpGained: number;
    grade: string;
    nextGrade: string | null;
    gradeProgressPercent: number;
    gradeRemainingXp: number;
  };
  eloDelta?: number;
  rated?: boolean;
  opponentRating?: number;
  opponentEloDelta?: number;
  opponentRated?: boolean;
  topic: TopicRef;
  opponent: UserRef | null;
  opponentId: string | null;
  botDifficulty: BotDifficulty | null;
  opponentDeleted: boolean;
}
