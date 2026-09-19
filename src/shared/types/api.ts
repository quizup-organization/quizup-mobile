/**
 * DTOs bruts renvoyés par les services backend (via gateway).
 * Les view-models consommés par l'UI vivent dans `domain.ts`.
 */

export interface TopicResponse {
  topicId: string;
  name: string;
  description: string;
  category: string;
  status: string;
  creatorId: string;
  updatedBy: string;
  followersCounter: number;
  questionsCounter: Record<string, number>;
  emoji: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  userId: string;
  email: string;
  displayName: string;
  bio?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgressionResponse {
  userId: string;
  xpTotal: number;
  level: number;
  title: string;
  xpForNextLevel: number;
  badges: { code: string; label: string }[];
  topics: { topicId: string; xp: number; level: number; title: string }[];
  duelStats: {
    played: number;
    wins: number;
    losses: number;
    winRate: number;
    bestScore: number;
    bestStreak: number;
  };
}

export interface TopicProgressResponse {
  topicId: string;
  xp: number;
  level: number;
  title: string;
}

export interface QuestionResponse {
  questionId: string;
  topicId: string;
  text: string;
  answers: Record<string, string>;
  correctAnswer: string;
  status: string;
}

export type BotDifficulty = "EASY" | "NORMAL" | "HARD";

export interface ServerTimeResponse {
  serverTime: string;
  epochMillis: number;
}
