/**
 * Modèles de l'application, alignés sur les DTOs des services backend.
 * `Topic` / `TopicStats` sont des view-models consommés par les composants du design system.
 */

export interface Topic {
  id: string;
  name: string;
  emoji: string;
  category: string;
  color: string;
  followers: number;
  description?: string;
}

export interface TopicStats {
  level: number;
  pct: number;
  played: number;
  points: number;
}

export interface TopicCategory {
  category: string;
  label: string;
}

export interface Profile {
  userId: string;
  email: string;
  displayName: string;
  bio?: string;
  country?: string;
}

export interface TopicProgress {
  topicId: string;
  xp: number;
  level: number;
  title: string;
}

export interface DuelStats {
  played: number;
  wins: number;
  losses: number;
  winRate: number;
  bestScore: number;
  bestStreak: number;
}

export interface Progression {
  userId: string;
  xpTotal: number;
  level: number;
  title: string;
  xpForNextLevel: number;
  badges: { code: string; label: string }[];
  topics: TopicProgress[];
  duelStats: DuelStats;
}

export interface TopicFollower {
  followId: string;
  topicId: string;
  userId: string;
  followedAt: string;
}

export interface UserFollower {
  followId: string;
  followerId: string;
  followedId: string;
  followedAt: string;
}

export interface TopicLeaderboardEntry {
  rank: number;
  topicId: string;
  userId: string;
  displayName: string;
  country: string;
  totalXp: number;
  monthlyXp: number;
  level: number;
}

export type ChallengeStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export interface Challenge {
  challengeId: string;
  challengerId: string;
  challengedId: string;
  topicId: string;
  gameId: string | null;
  status: ChallengeStatus;
  createdAt: string;
  acceptedAt: string | null;
  declinedAt: string | null;
  expiresAt: string;
}

export type MatchmakingStatus = "WAITING" | "MATCHED" | "CANCELLED";

export interface MatchmakingTicket {
  ticketId: string;
  topicId: string;
  initiatorId: string;
  challengerId: string | null;
  gameId: string | null;
  vsBot: boolean;
  status: MatchmakingStatus;
  createdAt: string;
  updatedAt: string;
}

export type GameStatus =
  | "CREATED"
  | "READY"
  | "IN_PROGRESS"
  | "FINISHED"
  | "CANCELED";

export type GameMode = "SYNC" | "ASYNC";
export type GamePlayerType = "HUMAN" | "BOT";
export type GameRoundStatus = "CREATED" | "STARTED" | "CLOSED";
export type GameRoundType =
  | "ROUND_1"
  | "ROUND_2"
  | "ROUND_3"
  | "ROUND_4"
  | "ROUND_5"
  | "ROUND_6"
  | "ROUND_7";
export type GameChoice = "A" | "B" | "C" | "D";

export interface GameRound {
  round: GameRoundType;
  questionId: string;
  questionText: string;
  status: GameRoundStatus;
  player1Choice: GameChoice | null;
  player1Points: number;
  player1TimeMs: number | null;
  player2Choice: GameChoice | null;
  player2Points: number;
  player2TimeMs: number | null;
  correctAnswer: GameChoice | null;
}

export interface Game {
  gameId: string;
  topicId: string;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  mode: GameMode;
  opponent: GamePlayerType;
  status: GameStatus;
  player1Score: number;
  player2Score: number;
  winnerId: string | null;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  rounds: GameRound[];
}
