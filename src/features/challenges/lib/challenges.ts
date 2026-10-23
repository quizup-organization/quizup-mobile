import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { isMockData } from "@/lib/config";
import { meService } from "@/features/profile/lib/me";
import type { UserRef } from "@/features/player/domain/profile";
import type { RoomView } from "@/features/rooms/domain/room";
import type { TopicRef } from "@/features/topics/domain/topic";
import type {
  ChallengeStatus,
  ChallengesSnapshot,
  PendingChallenge,
  RoomSummary,
} from "../domain/challenge";
import { challengesService as mockChallengesService } from "./challenges.mock";

interface ChallengeView {
  challengeId: string;
  topic: TopicRef;
  challenger: UserRef | null;
  opponent: UserRef | null;
  status: ChallengeStatus;
  roomId: string | null;
  gameId: string | null;
  createdAt: string;
  expiresAt: string;
}

const UNKNOWN_PLAYER: UserRef = {
  userId: "unknown",
  pseudonym: null,
  avatarOptions: null,
};

function toPendingChallenge(
  challenge: ChallengeView,
  meId: string,
): PendingChallenge {
  const sent = challenge.challenger?.userId === meId;
  return {
    challengeId: challenge.challengeId,
    direction: sent ? "sent" : "received",
    topic: challenge.topic,
    opponent:
      (sent ? challenge.opponent : challenge.challenger) ?? UNKNOWN_PLAYER,
    expiresAt: challenge.expiresAt,
    status: challenge.status,
  };
}

function toRoomSummary(room: RoomView): RoomSummary {
  return {
    roomId: room.roomId,
    topic: room.topic,
    status: room.status,
    opponent: room.opponent,
    vsBot: room.vsBot,
    expiresAt: room.expiresAt,
  };
}

async function listChallenges(): Promise<ChallengesSnapshot> {
  const [me, challenges, rooms] = await Promise.all([
    meService.get(),
    api.get<ChallengeView[]>(ENDPOINTS.challenges.mine),
    api.get<RoomView[]>(ENDPOINTS.rooms.mine),
  ]);

  const pending = challenges
    .filter((challenge) => challenge.status === "PENDING")
    .map((challenge) => toPendingChallenge(challenge, me.userId));

  return {
    received: pending.filter(
      (challenge) => challenge.direction === "received",
    ),
    sent: pending.filter((challenge) => challenge.direction === "sent"),
    rooms: rooms.map(toRoomSummary),
  };
}

const apiChallengesService = {
  list: listChallenges,

  async pendingCount(): Promise<number> {
    const snapshot = await listChallenges();
    return snapshot.received.length + snapshot.rooms.length;
  },

  accept: (challengeId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.challenges.accept(challengeId)),

  decline: (challengeId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.challenges.decline(challengeId)),

  cancel: (challengeId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.challenges.cancel(challengeId)),
};

/** Défis et salons via le BFF, ou base de démonstration locale. */
export const challengesService = isMockData
  ? mockChallengesService
  : apiChallengesService;
