import type { UserRef } from "@/features/player/domain/profile";
import type { TopicRef } from "@/features/topics/domain/topic";

export type ChallengeDirection = "received" | "sent";

export type ChallengeStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED";

/** Défi nominatif en attente (`PendingChallengeView`). */
export interface PendingChallenge {
  challengeId: string;
  direction: ChallengeDirection;
  topic: TopicRef;
  opponent: UserRef;
  expiresAt: string;
  status: ChallengeStatus;
}

export type RoomStatus =
  | "WAITING_PLAYERS"
  | "FETCHING_PLAYERS"
  | "CREATING_GAME"
  | "GAME_CREATED"
  | "EXPIRED";

/** Résumé de salle (`RoomView` réduit à ce que l'onglet Défis affiche). */
export interface RoomSummary {
  roomId: string;
  topic: TopicRef;
  status: RoomStatus;
  opponent: UserRef | null;
  vsBot: boolean;
  expiresAt: string;
}
