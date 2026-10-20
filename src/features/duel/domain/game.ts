import type {
  EventEnvelope,
  GameNotification,
  RoundQuestionTranslation,
} from "@/shared/types/notifications";

export type GameRoundPhase = "QUESTION_SHOWN" | "ANSWERABLE" | "CLOSED";

export interface PlayerAnswer {
  choice: string;
  correct: boolean;
  points: number;
  timeMs: number;
}

export interface GameRoundState {
  round: string;
  questionId: string | null;
  questionText: string;
  imageUrl: string | null;
  difficulty: string | null;
  answers: Record<string, string>;
  translations: Record<string, RoundQuestionTranslation>;
  bonus: boolean;
  phase: GameRoundPhase;
  shownAt: string | null;
  revealAt: string | null;
  revealedAt: string | null;
  answerDeadlineAt: string | null;
  closedAt: string | null;
  nextRoundAt: string | null;
  correctAnswer: string | null;
  playerAnswers: Record<string, PlayerAnswer>;
}

/** Read model client d'une partie, reconstruit par fold des notifications REST (puis STOMP). */
export interface GameState {
  gameId: string;
  topicId: string | null;
  player1Id: string | null;
  player1Name: string | null;
  player2Id: string | null;
  player2Name: string | null;
  player2Type: string | null;
  botDifficulty: string | null;
  questionImageUrls: string[];
  status: "IN_PROGRESS" | "FINISHED" | "CANCELED";
  /** Round courant (dernier `ROUND_STARTED`), y compris pendant son reveal. */
  currentRound: string | null;
  rounds: Record<string, GameRoundState>;
  player1Score: number;
  player2Score: number;
  winnerId: string | null;
  forfeiterId: string | null;
  canceledReason: string | null;
}

export function emptyGame(gameId: string): GameState {
  return {
    gameId,
    topicId: null,
    player1Id: null,
    player1Name: null,
    player2Id: null,
    player2Name: null,
    player2Type: null,
    botDifficulty: null,
    questionImageUrls: [],
    status: "IN_PROGRESS",
    currentRound: null,
    rounds: {},
    player1Score: 0,
    player2Score: 0,
    winnerId: null,
    forfeiterId: null,
    canceledReason: null,
  };
}

function emptyRound(round: string): GameRoundState {
  return {
    round,
    questionId: null,
    questionText: "",
    imageUrl: null,
    difficulty: null,
    answers: {},
    translations: {},
    bonus: false,
    phase: "QUESTION_SHOWN",
    shownAt: null,
    revealAt: null,
    revealedAt: null,
    answerDeadlineAt: null,
    closedAt: null,
    nextRoundAt: null,
    correctAnswer: null,
    playerAnswers: {},
  };
}

function withRound(
  state: GameState,
  round: string,
  update: (current: GameRoundState) => GameRoundState,
): GameState {
  const current = state.rounds[round] ?? emptyRound(round);
  return {
    ...state,
    rounds: { ...state.rounds, [round]: update(current) },
  };
}

/** Fold idempotent : la déduplication par séquence est faite en amont par le poller. */
export function applyGameNotification(
  state: GameState,
  notification: GameNotification,
): GameState {
  switch (notification.type) {
    case "GAME_CREATED":
      return {
        ...state,
        topicId: notification.topicId,
        player1Id: notification.player1Id,
        player1Name: notification.player1Name,
        player2Id: notification.player2Id,
        player2Name: notification.player2Name,
        player2Type: notification.player2Type,
        botDifficulty: notification.botDifficulty,
        questionImageUrls: notification.questionImageUrls ?? [],
        status: "IN_PROGRESS",
      };
    case "GAME_STARTED":
      return { ...state, status: "IN_PROGRESS" };
    case "ROUND_STARTED":
      return {
        ...withRound(state, notification.round, (round) => ({
          ...round,
          questionId: notification.questionId,
          questionText: notification.questionText,
          imageUrl: notification.imageUrl ?? null,
          difficulty: notification.difficulty ?? null,
          answers: notification.answers,
          translations: notification.translations ?? {},
          bonus: notification.bonus,
          phase: "QUESTION_SHOWN",
          shownAt: notification.shownAt,
          revealAt: notification.revealAt,
        })),
        currentRound: notification.round,
      };
    case "QUESTION_REVEALED":
      return withRound(state, notification.round, (round) => ({
        ...round,
        phase: "ANSWERABLE",
        revealedAt: notification.revealedAt,
        answerDeadlineAt: notification.answerDeadlineAt,
      }));
    case "PLAYER_ANSWERED": {
      const isPlayer1 = notification.playerId === state.player1Id;
      return {
        ...withRound(state, notification.round, (round) => ({
          ...round,
          playerAnswers: {
            ...round.playerAnswers,
            [notification.playerId]: {
              choice: notification.choice,
              correct: notification.correct,
              points: notification.pointsEarned,
              timeMs: notification.timeMs,
            },
          },
        })),
        player1Score: isPlayer1
          ? state.player1Score + notification.pointsEarned
          : state.player1Score,
        player2Score: isPlayer1
          ? state.player2Score
          : state.player2Score + notification.pointsEarned,
      };
    }
    case "ROUND_CLOSED":
      return withRound(state, notification.closedRound, (round) => ({
        ...round,
        phase: "CLOSED",
        correctAnswer: notification.correctAnswer,
        closedAt: notification.closedAt,
        nextRoundAt: notification.nextRoundAt,
      }));
    case "GAME_FORFEITED":
      return { ...state, forfeiterId: notification.forfeiterId };
    case "GAME_ENDED":
      return {
        ...state,
        status: "FINISHED",
        winnerId: notification.winnerId,
        player1Score: notification.player1FinalScore,
        player2Score: notification.player2FinalScore,
      };
    case "GAME_CANCELLED":
      return {
        ...state,
        status: "CANCELED",
        canceledReason: notification.reason,
      };
    default: {
      const unreachable: never = notification;
      void unreachable;
      return state;
    }
  }
}

/** Filtre l'historique REST, le trie et le fold ; la déduplication est par `sequenceNumber`. */
export function foldGameEnvelopes(
  gameId: string,
  envelopes: EventEnvelope<GameNotification>[],
): GameState {
  const seen = new Set<number>();
  return [...envelopes]
    .filter((envelope) => {
      if (seen.has(envelope.sequenceNumber)) return false;
      seen.add(envelope.sequenceNumber);
      return true;
    })
    .sort((left, right) => left.sequenceNumber - right.sequenceNumber)
    .reduce(
      (state, envelope) => applyGameNotification(state, envelope.payload),
      emptyGame(gameId),
    );
}

/** Résout le texte et les réponses dans la langue du joueur, avec repli source. */
export function localizedQuestion(
  round: GameRoundState | null | undefined,
  language: string,
): { questionText: string; answers: Record<string, string> } {
  if (!round) return { questionText: "", answers: {} };
  const translation = round.translations[language];
  return {
    questionText: translation?.text ?? round.questionText,
    answers: translation?.answers ?? round.answers,
  };
}
