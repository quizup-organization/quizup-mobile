import type {
  PendingChallenge,
  RoomSummary,
} from "@/features/challenges/domain/challenge";
import {
  acceptChallenge,
  challengesFor,
  declineChallenge,
  pendingChallengesCount,
} from "@/mocks/db";
import { assertSuccess, isEmpty, mockDelay } from "@/mocks/scenario";

export interface ChallengesSnapshot {
  received: PendingChallenge[];
  sent: PendingChallenge[];
  rooms: RoomSummary[];
}

/** Implémentation mock du service Défis — remplacée par le BFF en phase API. */
export const challengesService = {
  async list(): Promise<ChallengesSnapshot> {
    await mockDelay(280);
    assertSuccess();
    if (isEmpty()) return { received: [], sent: [], rooms: [] };
    return challengesFor();
  },

  async pendingCount(): Promise<number> {
    await mockDelay(180);
    assertSuccess();
    return isEmpty() ? 0 : pendingChallengesCount();
  },

  async accept(challengeId: string): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    acceptChallenge(challengeId);
  },

  async decline(challengeId: string): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    declineChallenge(challengeId);
  },
};
