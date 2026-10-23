import type { TopicRef } from "@/features/topics/domain/topic";
import type { UserRef } from "./profile";

export type GameOutcome =
  | "WIN"
  | "LOSS"
  | "DRAW"
  | "WAITING"
  | "IN_PROGRESS"
  | "CANCELLED";

export type GameOutcomeFilter = "ALL" | GameOutcome;
export type GameOpponentType = "HUMAN" | "BOT";
export type GameOpponentTypeFilter = "ALL" | GameOpponentType;
export type GameHistorySort = "RECENT" | "OLDEST" | "SCORE";

export interface HeadToHead {
  played: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface GameHistoryItem {
  gameId: string;
  topic: TopicRef;
  opponent: UserRef | null;
  opponentType: string | null;
  outcome: GameOutcome;
  myScore: number;
  opponentScore: number;
  xp: number | null;
  playedAt: string;
}

export interface ProfileGamesParams {
  topicId?: string;
  opponentId?: string;
  opponentType?: GameOpponentType;
  outcome?: GameOutcomeFilter;
  sort?: GameHistorySort;
  page?: number;
  size?: number;
}
