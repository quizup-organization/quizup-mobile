import type { ChallengesSnapshot } from "@/features/challenges/domain/challenge";
import {
  acceptChallenge,
  challengesFor,
  db,
  declineChallenge,
  pendingChallengesCount,
  topicRef,
} from "@/mocks/db";
import { assertSuccess, isEmpty, mockDelay } from "@/mocks/scenario";

/** Défis et salons alimentés par la base de démonstration locale. */
export const challengesService = {
  async create(params: {
    topicId: string;
    opponentId: string;
    gameId?: string | null;
  }): Promise<{ id: string }> {
    await mockDelay(180);
    assertSuccess();
    const id = `challenge-${Date.now()}`;
    const profile = db.profiles.find(
      (item) => item.userId === params.opponentId,
    );
    if (profile) {
      db.challenges.push({
        challengeId: id,
        direction: "sent",
        topic: topicRef(params.topicId),
        opponent: {
          userId: profile.userId,
          pseudonym: profile.pseudonym,
          avatarOptions: profile.avatarOptions,
        },
        expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
        status: "PENDING",
      });
    }
    return { id };
  },

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

  async cancel(challengeId: string): Promise<void> {
    await mockDelay(180);
    assertSuccess();
    const challenge = challengesFor().sent.find(
      (item) => item.challengeId === challengeId,
    );
    if (challenge) challenge.status = "CANCELLED";
  },
};
