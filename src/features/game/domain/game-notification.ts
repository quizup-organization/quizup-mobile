/** Contrat temps réel d'une partie, miroir du `GameNotification` du BFF. */

export type GameNotificationType =
  | "GAME_CREATED"
  | "GAME_STARTED"
  | "ROUND_STARTED"
  | "QUESTION_REVEALED"
  | "PLAYER_ANSWERED"
  | "ROUND_CLOSED"
  | "GAME_FORFEITED"
  | "GAME_ENDED"
  | "GAME_CANCELLED";

export interface GameCreatedNotification {
  type: "GAME_CREATED";
  gameId: string;
  topicId: string;
  player1Id: string;
  player1Name: string | null;
  player2Id: string | null;
  player2Name: string | null;
  player2Type: string | null;
  botDifficulty: string | null;
  questionImageUrls: string[];
}

export interface GameStartedNotification {
  type: "GAME_STARTED";
  gameId: string;
  firstRoundAt: string;
}

export interface RoundQuestionTranslation {
  text: string;
  answers: Record<string, string>;
}

export interface RoundStartedNotification {
  type: "ROUND_STARTED";
  gameId: string;
  round: string;
  questionId: string;
  questionText: string;
  imageUrl: string | null;
  difficulty: string | null;
  answers: Record<string, string>;
  translations?: Record<string, RoundQuestionTranslation>;
  bonus: boolean;
  shownAt: string;
  revealAt: string;
}

export interface QuestionRevealedNotification {
  type: "QUESTION_REVEALED";
  gameId: string;
  round: string;
  revealedAt: string;
  answerDeadlineAt: string;
}

export interface PlayerAnsweredNotification {
  type: "PLAYER_ANSWERED";
  gameId: string;
  round: string;
  playerId: string;
  choice: string;
  correct: boolean;
  pointsEarned: number;
  answeredAt: string;
  timeMs: number;
}

export interface RoundClosedNotification {
  type: "ROUND_CLOSED";
  gameId: string;
  closedRound: string;
  nextRound: string | null;
  correctAnswer: string | null;
  closedAt: string;
  nextRoundAt: string | null;
}

export interface GameForfeitedNotification {
  type: "GAME_FORFEITED";
  gameId: string;
  forfeiterId: string;
}

export interface GameEndedNotification {
  type: "GAME_ENDED";
  gameId: string;
  winnerId: string | null;
  player1FinalScore: number;
  player2FinalScore: number;
}

export interface GameCancelledNotification {
  type: "GAME_CANCELLED";
  gameId: string;
  reason: string;
}

export type GameNotification =
  | GameCreatedNotification
  | GameStartedNotification
  | RoundStartedNotification
  | QuestionRevealedNotification
  | PlayerAnsweredNotification
  | RoundClosedNotification
  | GameForfeitedNotification
  | GameEndedNotification
  | GameCancelledNotification;
