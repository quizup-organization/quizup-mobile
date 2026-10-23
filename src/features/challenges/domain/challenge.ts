import type { UserRef } from "@/features/player/domain/profile";
import type { RoomStatus } from "@/features/rooms/domain/room";
import type { TopicRef } from "@/features/topics/domain/topic";

export type ChallengeDirection = "received" | "sent";

export type ChallengeStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "CANCELLED"
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

/** Résumé de salle (`RoomView` réduit à ce que l'onglet Défis affiche). */
export interface RoomSummary {
  roomId: string;
  topic: TopicRef;
  status: RoomStatus;
  opponent: UserRef | null;
  vsBot: boolean;
  expiresAt: string;
}

/** Défis en attente + salons ouverts du joueur courant. */
export interface ChallengesSnapshot {
  received: PendingChallenge[];
  sent: PendingChallenge[];
  rooms: RoomSummary[];
}
