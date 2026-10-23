import type { RoundQuestionTranslation } from "./game-notification";
import { ROUND_SECONDS } from "./game-constants";

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

/** Read model d'une partie, reconstruit par fold des notifications. */
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
  firstRoundAt: string | null;
  status: "IN_PROGRESS" | "FINISHED" | "CANCELED";
  rounds: Record<string, GameRoundState>;
  player1Score: number;
  player2Score: number;
  winnerId: string | null;
  forfeiterId: string | null;
  canceledReason: string | null;
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

/** Dernière manche connue (ordre d'insertion du fold). */
export function currentRound(state: GameState): GameRoundState | null {
  const rounds = Object.values(state.rounds);
  return rounds.length > 0 ? rounds[rounds.length - 1] : null;
}

/** Deadline de réponse (ms epoch), avec repli `revealAt + ROUND_SECONDS`. */
export function answerDeadlineMs(
  round: GameRoundState | null | undefined,
): number | null {
  if (!round) return null;
  if (round.answerDeadlineAt) {
    const parsed = Date.parse(round.answerDeadlineAt);
    if (Number.isFinite(parsed)) return parsed;
  }
  if (round.revealAt) {
    const revealAt = Date.parse(round.revealAt);
    if (Number.isFinite(revealAt)) return revealAt + ROUND_SECONDS * 1000;
  }
  return null;
}

/** Temps restant (0–10 s) sur une manche close, figé à l'instant serveur. */
export function frozenTimeLeft(round: GameRoundState | null): number {
  if (!round?.answerDeadlineAt || !round.closedAt) return 0;
  const deadline = Date.parse(round.answerDeadlineAt);
  const closed = Date.parse(round.closedAt);
  if (!Number.isFinite(deadline) || !Number.isFinite(closed)) return 0;
  return Math.min(ROUND_SECONDS, Math.max(0, (deadline - closed) / 1000));
}
