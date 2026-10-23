import type { UserRef } from "@/features/player/domain/profile";
import type { TopicRef } from "@/features/topics/domain/topic";

/** Statut serveur d'une salle (enum backend `RoomStatus`). */
export type RoomStatus =
  | "WAITING_PLAYERS"
  | "FETCHING_PLAYERS"
  | "FETCHING_PLAYED_QUESTIONS"
  | "FETCHING_QUESTIONS"
  | "CREATING_GAME"
  | "GAME_CREATED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "FAILED";

/** Vue d'une salle (`RoomView`). */
export interface RoomView {
  roomId: string;
  topic: TopicRef;
  status: RoomStatus;
  vsBot: boolean;
  canCancel: boolean;
  opponent: UserRef | null;
  initiatorPresent: boolean;
  participantPresent: boolean;
  gameId: string | null;
  createdAt: string;
  expiresAt: string;
  updatedAt: string;
}

/** Étapes visibles pendant la préparation d'une salle. */
export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  WAITING_PLAYERS: "En attente du joueur",
  FETCHING_PLAYERS: "Chargement des joueurs",
  FETCHING_PLAYED_QUESTIONS: "Analyse des questions déjà jouées",
  FETCHING_QUESTIONS: "Sélection des questions",
  CREATING_GAME: "Création de la partie",
  GAME_CREATED: "Partie créée",
  COMPLETED: "Partie prête",
  CANCELLED: "Salle annulée",
  EXPIRED: "Salle expirée",
  FAILED: "La préparation a échoué",
};

const PREPARATION_STEPS: RoomStatus[] = [
  "WAITING_PLAYERS",
  "FETCHING_PLAYERS",
  "FETCHING_PLAYED_QUESTIONS",
  "FETCHING_QUESTIONS",
  "CREATING_GAME",
  "GAME_CREATED",
];

/** Progression (0–1) de la préparation d'une salle. */
export function roomStatusProgress(status: RoomStatus): number {
  if (status === "COMPLETED") return 1;
  const index = PREPARATION_STEPS.indexOf(status);
  if (index < 0) return 0;
  return (index + 1) / PREPARATION_STEPS.length;
}

/** Statut terminal côté écran de salle. */
export function isRoomFailure(status: RoomStatus): boolean {
  return status === "CANCELLED" || status === "EXPIRED" || status === "FAILED";
}
