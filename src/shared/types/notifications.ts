/**
 * Contrats temps réel de la surface BFF (REST d'historique et futur WebSocket).
 *
 * <p>Les mêmes enveloppes sont renvoyées par `GET .../notifications` et poussées sur STOMP.
 * `sequenceNumber` garantit l'ordre et la déduplication côté client.</p>
 */

export interface EventEnvelope<T> {
  aggregateId: string;
  sequenceNumber: number;
  timestamp: string;
  eventType: string;
  payload: T;
}

/* ─────────────────────────────── Salles ───────────────────────────────── */

export type RoomNotificationType =
  | "ROOM_CREATED"
  | "ROOM_COMPLETED"
  | "ROOM_CANCELLED"
  | "ROOM_EXPIRED"
  | "ROOM_FAILED"
  | "ROOM_ENTERED"
  | "ROOM_LEFT"
  | "ROOM_ALL_PRESENT"
  | "ROOM_PLAYERS_LOADED"
  | "ROOM_PLAYED_QUESTIONS_LOADED"
  | "ROOM_QUESTIONS_LOADED"
  | "ROOM_GAME_CREATED"
  | "ROOM_WIZZED";

export interface RoomCreatedNotification {
  type: "ROOM_CREATED";
  roomId: string;
  topicId: string;
  initiatorId: string;
  opponentId: string | null;
  vsBot: boolean;
  expiresAt: string | null;
}

export interface RoomCompletedNotification {
  type: "ROOM_COMPLETED";
  roomId: string;
  gameId: string;
}

export interface RoomCancelledNotification {
  type: "ROOM_CANCELLED";
  roomId: string;
  reason: string;
}

export interface RoomExpiredNotification {
  type: "ROOM_EXPIRED";
  roomId: string;
}

export interface RoomFailedNotification {
  type: "ROOM_FAILED";
  roomId: string;
  reason: string;
}

export interface RoomEnteredNotification {
  type: "ROOM_ENTERED";
  roomId: string;
  playerId: string;
}

export interface RoomLeftNotification {
  type: "ROOM_LEFT";
  roomId: string;
  playerId: string;
}

export interface RoomWizzedNotification {
  type: "ROOM_WIZZED";
  roomId: string;
  playerId: string;
  targetId: string;
  wizzedAt: string;
}

export interface RoomAllPlayersPresentNotification {
  type: "ROOM_ALL_PRESENT";
  roomId: string;
}

export interface RoomPlayersLoadedNotification {
  type: "ROOM_PLAYERS_LOADED";
  roomId: string;
}

export interface RoomPlayedQuestionsLoadedNotification {
  type: "ROOM_PLAYED_QUESTIONS_LOADED";
  roomId: string;
}

export interface RoomQuestionsLoadedNotification {
  type: "ROOM_QUESTIONS_LOADED";
  roomId: string;
}

export interface RoomGameCreatedNotification {
  type: "ROOM_GAME_CREATED";
  roomId: string;
  gameId: string;
}

export type RoomNotification =
  | RoomCreatedNotification
  | RoomCompletedNotification
  | RoomCancelledNotification
  | RoomExpiredNotification
  | RoomFailedNotification
  | RoomEnteredNotification
  | RoomLeftNotification
  | RoomWizzedNotification
  | RoomAllPlayersPresentNotification
  | RoomPlayersLoadedNotification
  | RoomPlayedQuestionsLoadedNotification
  | RoomQuestionsLoadedNotification
  | RoomGameCreatedNotification;

/* ─────────────────────────────── Partie ───────────────────────────────── */

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

/* ──────────────────────────── Appariement ─────────────────────────────── */

export type MatchmakingNotificationType =
  | "SEARCHING"
  | "MATCHED"
  | "CANCELLED"
  | "EXPIRED"
  | "FAILED";

export interface MatchmakingSearchingNotification {
  type: "SEARCHING";
  ticketId: string;
  topicId: string;
  deadlineAt: string;
}

export interface MatchmakingMatchedNotification {
  type: "MATCHED";
  ticketId: string;
  roomId: string;
  opponentId: string | null;
  vsBot: boolean;
}

export interface MatchmakingCancelledNotification {
  type: "CANCELLED";
  ticketId: string;
}

export interface MatchmakingExpiredNotification {
  type: "EXPIRED";
  ticketId: string;
}

export interface MatchmakingFailedNotification {
  type: "FAILED";
  ticketId: string;
  reason: string;
}

export type MatchmakingNotification =
  | MatchmakingSearchingNotification
  | MatchmakingMatchedNotification
  | MatchmakingCancelledNotification
  | MatchmakingExpiredNotification
  | MatchmakingFailedNotification;
