import type { NotificationPreferenceView, NotificationView } from "@/features/notifications/domain/notification";
import type {
  PeopleDirection,
  PlayerCard,
  PlayerProfile,
  UserRef,
} from "@/features/player/domain/profile";
import type { Me } from "@/features/profile/domain/me";
import type {
  PendingChallenge,
  RoomSummary,
} from "@/features/challenges/domain/challenge";
import type {
  LeaderboardEntry,
  TopicCard,
  TopicProgress,
  TopicRef,
} from "@/features/topics/domain/topic";

export const DEMO_USER_ID = "demo-user";

const iso = (minutesAgo: number): string =>
  new Date(Date.now() - minutesAgo * 60_000).toISOString();

export const db: {
  me: Me;
  topics: TopicCard[];
  progress: Record<string, TopicProgress>;
  profiles: PlayerProfile[];
  following: Set<string>;
  followers: Set<string>;
  notifications: NotificationView[];
  preferences: NotificationPreferenceView[];
  challenges: PendingChallenge[];
  rooms: RoomSummary[];
} = {
  me: {
    userId: DEMO_USER_ID,
    email: "demo@quizup.local",
    pseudonym: "Nadjim",
    bio: "Curieux de sciences et de cinéma.",
    country: "FR",
    avatarOptions: null,
    bannerUrl: null,
    language: "fr",
    equippedTitle: "sciences:CONFIRME",
    progression: {
      rating: 1050,
      peakRating: 1125,
      ratedGames: 54,
      provisional: false,

      badges: [
        { code: "STREAK_5", label: "Série de 5 jours" },
        { code: "PERFECT_DUEL", label: "Sans faute" },
        { code: "TOP_10", label: "Top 10" },
      ],
    },
    stats: {
      played: 248,
      wins: 151,
      losses: 82,
      draws: 15,
      winPercent: 61,
      bestScore: 9_800,
      currentWinStreak: 5,
      bestWinStreak: 12,
    },
    followingCount: 3,
    followersCount: 4,
    onboardingCompleted: false,
    rewards: ["MICAH_AVATAR"],
    premium: false,
  },

  topics: [
    {
      topicId: "sciences",
      names: { fr: "Sciences", en: "Science" },
      description: "Physique, chimie, biologie : les fondamentaux en cinq questions.",
      category: "sciences",
      categoryLabel: "Sciences",
      emoji: "🔬",
      color: "#E0E7FF",
      imageUrl: null,
      bannerUrl: null,
      followersCount: 12_400,
      questionsCount: 48,
      followed: true,
      status: "PUBLISHED",
    },
    {
      topicId: "histoire",
      names: { fr: "Histoire", en: "History" },
      description: "Des grandes dates aux petits détails qui changent tout.",
      category: "culture",
      categoryLabel: "Culture",
      emoji: "🏛️",
      color: "#FFE4E6",
      imageUrl: null,
      bannerUrl: null,
      followersCount: 9_850,
      questionsCount: 36,
      followed: true,
      status: "PUBLISHED",
    },
    {
      topicId: "geographie",
      names: { fr: "Géographie", en: "Geography" },
      description: "Capitales, fleuves, reliefs : retrouve le nord.",
      category: "nature",
      categoryLabel: "Nature",
      emoji: "🗺️",
      color: "#DCFCE7",
      imageUrl: null,
      bannerUrl: null,
      followersCount: 8_120,
      questionsCount: 42,
      followed: true,
      status: "PUBLISHED",
    },
    {
      topicId: "sport",
      names: { fr: "Sport", en: "Sport" },
      description: "Records, équipes et moments légendaires.",
      category: "loisirs",
      categoryLabel: "Loisirs",
      emoji: "🏆",
      color: "#FEF3C7",
      imageUrl: null,
      bannerUrl: null,
      followersCount: 7_640,
      questionsCount: 31,
      followed: false,
      status: "PUBLISHED",
    },
    {
      topicId: "cinema",
      names: { fr: "Cinéma", en: "Cinema" },
      description: "Répliques cultes et réalisateurs de légende.",
      category: "culture",
      categoryLabel: "Culture",
      emoji: "🎬",
      color: "#F3E8FF",
      imageUrl: null,
      bannerUrl: null,
      followersCount: 6_310,
      questionsCount: 28,
      followed: false,
      status: "PUBLISHED",
    },
    {
      topicId: "musique",
      names: { fr: "Musique", en: "Music" },
      description: "Des années 60 aux hits du moment.",
      category: "culture",
      categoryLabel: "Culture",
      emoji: "🎵",
      color: "#FFE4EC",
      imageUrl: null,
      bannerUrl: null,
      followersCount: 5_980,
      questionsCount: 24,
      followed: false,
      status: "PUBLISHED",
    },
    {
      topicId: "technologie",
      names: { fr: "Technologie", en: "Technology" },
      description: "Code, internet et objets qui parlent.",
      category: "sciences",
      categoryLabel: "Sciences",
      emoji: "💻",
      color: "#CFFAFE",
      imageUrl: null,
      bannerUrl: null,
      followersCount: 4_870,
      questionsCount: 33,
      followed: false,
      status: "PUBLISHED",
    },
    {
      topicId: "nature",
      names: { fr: "Nature", en: "Nature" },
      description: "Animaux, plantes et écosystèmes.",
      category: "nature",
      categoryLabel: "Nature",
      emoji: "🌿",
      color: "#ECFCCB",
      imageUrl: null,
      bannerUrl: null,
      followersCount: 3_450,
      questionsCount: 26,
      followed: false,
      status: "PUBLISHED",
    },
  ],

  progress: {
    sciences: {
      xp: 2_450,
      games: 34,
      completedQuestions: 34,
      totalQuestions: 48,
      completionPercent: 71,
      grade: "CONFIRME",
      gradeProgressPercent: 64,
      gradeRemainingXp: 550,
      nextGrade: "EXPERT",
    },
    histoire: {
      xp: 1_120,
      games: 18,
      completedQuestions: 17,
      totalQuestions: 36,
      completionPercent: 47,
      grade: "PRATIQUANT",
      gradeProgressPercent: 41,
      gradeRemainingXp: 380,
      nextGrade: "CONFIRME",
    },
    geographie: {
      xp: 1_680,
      games: 22,
      completedQuestions: 26,
      totalQuestions: 42,
      completionPercent: 62,
      grade: "CONFIRME",
      gradeProgressPercent: 58,
      gradeRemainingXp: 420,
      nextGrade: "EXPERT",
    },
    sport: {
      xp: 540,
      games: 8,
      completedQuestions: 9,
      totalQuestions: 31,
      completionPercent: 29,
      grade: "APPRENTI",
      gradeProgressPercent: 33,
      gradeRemainingXp: 260,
      nextGrade: "PRATIQUANT",
    },
    cinema: {
      xp: 980,
      games: 14,
      completedQuestions: 15,
      totalQuestions: 28,
      completionPercent: 54,
      grade: "PRATIQUANT",
      gradeProgressPercent: 48,
      gradeRemainingXp: 320,
      nextGrade: "CONFIRME",
    },
    musique: {
      xp: 760,
      games: 11,
      completedQuestions: 12,
      totalQuestions: 24,
      completionPercent: 50,
      grade: "PRATIQUANT",
      gradeProgressPercent: 44,
      gradeRemainingXp: 240,
      nextGrade: "CONFIRME",
    },
    technologie: {
      xp: 2_100,
      games: 29,
      completedQuestions: 28,
      totalQuestions: 33,
      completionPercent: 85,
      grade: "EXPERT",
      gradeProgressPercent: 52,
      gradeRemainingXp: 900,
      nextGrade: "MAITRE",
    },
    nature: {
      xp: 430,
      games: 7,
      completedQuestions: 7,
      totalQuestions: 26,
      completionPercent: 27,
      grade: "APPRENTI",
      gradeProgressPercent: 29,
      gradeRemainingXp: 270,
      nextGrade: "PRATIQUANT",
    },
  },

  profiles: [
    {
      userId: "camille",
      pseudonym: "Camille",
      bio: "Chasseuse de records.",
      country: "FR",
      avatarOptions: null,
      bannerUrl: null,
      isMe: false,
      following: true,
      presence: { userId: "camille", status: "ONLINE", lastSeenAt: iso(1) },
      progression: {
        rating: 1200,
        peakRating: 1275,
        ratedGames: 72,
        provisional: false,

        badges: [
          { code: "STREAK_5", label: "Série de 5 jours" },
          { code: "PERFECT_DUEL", label: "Sans faute" },
        ],
      },
      stats: {
        played: 312,
        wins: 201,
        losses: 94,
        draws: 17,
        winPercent: 64,
        bestScore: 10_200,
        currentWinStreak: 7,
        bestWinStreak: 18,
      },
      followersCount: 240,
      followingCount: 38,
    },
    {
      userId: "yanis",
      pseudonym: "Yanis",
      bio: "Toujours partant pour un duel.",
      country: "FR",
      avatarOptions: null,
      bannerUrl: null,
      isMe: false,
      following: false,
      presence: { userId: "yanis", status: "ONLINE", lastSeenAt: iso(2) },
      progression: {
        rating: 1125,
        peakRating: 1200,
        ratedGames: 63,
        provisional: false,

        badges: [
          { code: "STREAK_5", label: "Série de 5 jours" },
          { code: "PERFECT_DUEL", label: "Sans faute" },
        ],
      },
      stats: {
        played: 280,
        wins: 170,
        losses: 95,
        draws: 15,
        winPercent: 61,
        bestScore: 9_900,
        currentWinStreak: 3,
        bestWinStreak: 14,
      },
      followersCount: 180,
      followingCount: 44,
    },
    {
      userId: "sofia",
      pseudonym: "Sofia",
      bio: "Culture générale et bonne humeur.",
      country: "ES",
      avatarOptions: null,
      bannerUrl: null,
      isMe: false,
      following: true,
      presence: { userId: "sofia", status: "OFFLINE", lastSeenAt: iso(35) },
      progression: {
        rating: 1075,
        peakRating: 1150,
        ratedGames: 57,
        provisional: false,

        badges: [
          { code: "STREAK_5", label: "Série de 5 jours" },
          { code: "PERFECT_DUEL", label: "Sans faute" },
        ],
      },
      stats: {
        played: 244,
        wins: 140,
        losses: 90,
        draws: 14,
        winPercent: 57,
        bestScore: 9_400,
        currentWinStreak: 2,
        bestWinStreak: 11,
      },
      followersCount: 150,
      followingCount: 52,
    },
    {
      userId: "malik",
      pseudonym: "Malik",
      bio: "Sport, cinéma, musique.",
      country: "FR",
      avatarOptions: null,
      bannerUrl: null,
      isMe: false,
      following: false,
      presence: { userId: "malik", status: "OFFLINE", lastSeenAt: iso(180) },
      progression: {
        rating: 1025,
        peakRating: 1100,
        ratedGames: 51,
        provisional: false,

        badges: [
          { code: "STREAK_5", label: "Série de 5 jours" },
          { code: "PERFECT_DUEL", label: "Sans faute" },
        ],
      },
      stats: {
        played: 201,
        wins: 108,
        losses: 80,
        draws: 13,
        winPercent: 54,
        bestScore: 8_800,
        currentWinStreak: 1,
        bestWinStreak: 9,
      },
      followersCount: 96,
      followingCount: 37,
    },
    {
      userId: "ines",
      pseudonym: "Inès",
      bio: "Les détails font la différence.",
      country: "FR",
      avatarOptions: null,
      bannerUrl: null,
      isMe: false,
      following: true,
      presence: { userId: "ines", status: "ONLINE", lastSeenAt: iso(1) },
      progression: {
        rating: 975,
        peakRating: 1050,
        ratedGames: 45,
        provisional: false,

        badges: [
          { code: "STREAK_5", label: "Série de 5 jours" },
          { code: "PERFECT_DUEL", label: "Sans faute" },
        ],
      },
      stats: {
        played: 188,
        wins: 99,
        losses: 76,
        draws: 13,
        winPercent: 53,
        bestScore: 8_100,
        currentWinStreak: 2,
        bestWinStreak: 8,
      },
      followersCount: 110,
      followingCount: 29,
    },
    {
      userId: "tom",
      pseudonym: "Tom",
      bio: "Le calme avant la tempête.",
      country: "BE",
      avatarOptions: null,
      bannerUrl: null,
      isMe: false,
      following: false,
      presence: { userId: "tom", status: "OFFLINE", lastSeenAt: iso(720) },
      progression: {
        rating: 925,
        peakRating: 1000,
        ratedGames: 39,
        provisional: false,

        badges: [
          { code: "STREAK_5", label: "Série de 5 jours" },
          { code: "PERFECT_DUEL", label: "Sans faute" },
        ],
      },
      stats: {
        played: 160,
        wins: 82,
        losses: 65,
        draws: 13,
        winPercent: 51,
        bestScore: 7_900,
        currentWinStreak: 1,
        bestWinStreak: 7,
      },
      followersCount: 74,
      followingCount: 31,
    },
  ],

  following: new Set(["camille", "sofia", "ines"]),
  followers: new Set(["yanis", "malik", "ines", "tom"]),

  notifications: [
    {
      notificationId: "n1",
      type: "FOLLOW",
      actorId: "ines",
      sourceId: null,
      topicId: null,
      gameId: null,
      expiresAt: null,
      readAt: null,
      createdAt: iso(4),
    },
    {
      notificationId: "n2",
      type: "CHALLENGE_RECEIVED",
      actorId: "yanis",
      sourceId: "challenge-42",
      topicId: "sciences",
      gameId: null,
      expiresAt: iso(-120),
      readAt: null,
      createdAt: iso(18),
    },
    {
      notificationId: "n3",
      type: "ROOM_ACCEPTED",
      actorId: "sofia",
      sourceId: "room-7",
      topicId: "histoire",
      gameId: "game-7",
      expiresAt: null,
      readAt: iso(20),
      createdAt: iso(72),
    },
    {
      notificationId: "n4",
      type: "WIZZ",
      actorId: "malik",
      sourceId: "room-7",
      topicId: "histoire",
      gameId: null,
      expiresAt: iso(-30),
      readAt: iso(100),
      createdAt: iso(125),
    },
    {
      notificationId: "n5",
      type: "CHALLENGE_DECLINED",
      actorId: "tom",
      sourceId: "challenge-39",
      topicId: "cinema",
      gameId: null,
      expiresAt: null,
      readAt: iso(500),
      createdAt: iso(600),
    },
    {
      notificationId: "n6",
      type: "QUESTION_REPORTED",
      actorId: "camille",
      sourceId: "question-12",
      topicId: "sciences",
      gameId: null,
      expiresAt: null,
      readAt: iso(900),
      createdAt: iso(1_000),
    },
    {
      notificationId: "n7",
      type: "ACCOUNT_SUSPENDED",
      actorId: null,
      sourceId: null,
      topicId: null,
      gameId: null,
      expiresAt: null,
      readAt: iso(1_500),
      createdAt: iso(1_600),
    },
    {
      notificationId: "n8",
      type: "FOLLOW",
      actorId: "camille",
      sourceId: null,
      topicId: null,
      gameId: null,
      expiresAt: null,
      readAt: iso(2_000),
      createdAt: iso(2_100),
    },
  ],

  preferences: [
    { category: "FOLLOW", enabled: true },
    { category: "ROOM", enabled: true },
    { category: "QUESTION", enabled: true },
    { category: "ACCOUNT", enabled: true },
  ],

  challenges: [],
  rooms: [],
};

export function getTopic(topicId: string): TopicCard | undefined {
  return db.topics.find((topic) => topic.topicId === topicId);
}

export function getProfile(userId: string): PlayerProfile | undefined {
  return db.profiles.find((profile) => profile.userId === userId);
}

export function playerCard(profile: PlayerProfile): PlayerCard {
  return {
    userId: profile.userId,
    pseudonym: profile.pseudonym,
    avatarOptions: profile.avatarOptions,
    rating: profile.progression.rating,
    provisional: profile.progression.provisional,
    following: db.following.has(profile.userId),
    presence: profile.presence,
    suspended: profile.suspended,
  };
}

export function peopleFor(direction: PeopleDirection): PlayerCard[] {
  const ids = direction === "following" ? db.following : db.followers;
  return db.profiles
    .filter((profile) => ids.has(profile.userId))
    .map(playerCard);
}

export function setFollowTopic(topicId: string, followed: boolean): void {
  const topic = getTopic(topicId);
  if (!topic || topic.followed === followed) return;
  topic.followed = followed;
  topic.followersCount += followed ? 1 : -1;
}

export function setFollowPlayer(userId: string, followed: boolean): void {
  const profile = getProfile(userId);
  if (!profile || db.following.has(userId) === followed) return;

  if (followed) {
    db.following.add(userId);
  } else {
    db.following.delete(userId);
  }
  profile.following = followed;
  db.me.followingCount += followed ? 1 : -1;
}

export function leaderboardFor(_topicId: string): LeaderboardEntry[] {
  const me = db.me;
  const entries: LeaderboardEntry[] = db.profiles
    .slice(0, 5)
    .map((profile, index) => ({
      rank: index + 1,
      userId: profile.userId,
      pseudonym: profile.pseudonym,
      avatarOptions: profile.avatarOptions,
      country: profile.country,
      rating: profile.progression.rating,
      provisional: profile.progression.provisional,
      totalXp: profile.progression.rating * 10,
      monthlyXp: Math.round(profile.progression.rating * 1.8),
      suspended: profile.suspended,
    }))
    .sort((left, right) => right.totalXp - left.totalXp)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const myEntry: LeaderboardEntry = {
    rank: 6,
    userId: me.userId,
    pseudonym: me.pseudonym,
    avatarOptions: me.avatarOptions,
    country: me.country,
    rating: me.progression.rating,
    provisional: me.progression.provisional,
    totalXp: me.progression.rating * 10,
    monthlyXp: 1_950,
  };

  return [...entries, myEntry].sort(
    (left, right) => right.totalXp - left.totalXp,
  ).map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function markNotificationRead(notificationId: string): void {
  const notification = db.notifications.find(
    (item) => item.notificationId === notificationId,
  );
  if (notification) notification.readAt = new Date().toISOString();
}

export function markNotificationUnread(notificationId: string): void {
  const notification = db.notifications.find(
    (item) => item.notificationId === notificationId,
  );
  if (notification) notification.readAt = null;
}

export function removeNotification(notificationId: string): void {
  db.notifications = db.notifications.filter(
    (item) => item.notificationId !== notificationId,
  );
}

export function markAllNotificationsRead(): void {
  const now = new Date().toISOString();
  db.notifications = db.notifications.map((item) =>
    item.readAt === null ? { ...item, readAt: now } : item,
  );
}

export function topicRef(topicId: string): TopicRef {
  const topic = getTopic(topicId);
  if (!topic) throw new Error(`Sujet mock introuvable : ${topicId}`);
  return {
    topicId: topic.topicId,
    names: topic.names,
    category: topic.category,
    emoji: topic.emoji,
    color: topic.color,
    imageUrl: topic.imageUrl,
    titles: null,
  };
}

export function userRef(userId: string): UserRef {
  const profile = getProfile(userId);
  if (!profile) throw new Error(`Joueur mock introuvable : ${userId}`);
  return {
    userId: profile.userId,
    pseudonym: profile.pseudonym,
    avatarOptions: profile.avatarOptions,
    suspended: profile.suspended,
  };
}

export function challengesFor(): {
  received: PendingChallenge[];
  sent: PendingChallenge[];
  rooms: RoomSummary[];
} {
  return {
    received: db.challenges.filter(
      (challenge) =>
        challenge.direction === "received" && challenge.status === "PENDING",
    ),
    sent: db.challenges.filter(
      (challenge) =>
        challenge.direction === "sent" && challenge.status === "PENDING",
    ),
    rooms: db.rooms.filter((room) => room.status !== "EXPIRED"),
  };
}

export function pendingChallengesCount(): number {
  return (
    db.challenges.filter(
      (challenge) =>
        challenge.direction === "received" && challenge.status === "PENDING",
    ).length +
    db.rooms.filter(
      (room) =>
        room.status === "WAITING_PLAYERS" ||
        room.status === "FETCHING_PLAYERS",
    ).length
  );
}

export function acceptChallenge(challengeId: string): void {
  const challenge = db.challenges.find(
    (item) => item.challengeId === challengeId,
  );
  if (!challenge || challenge.status !== "PENDING") return;

  challenge.status = "ACCEPTED";
  db.rooms.push({
    roomId: `room-${challengeId}`,
    topic: challenge.topic,
    status: "WAITING_PLAYERS",
    opponent: challenge.opponent,
    vsBot: false,
    expiresAt: challenge.expiresAt,
  });
}

export function declineChallenge(challengeId: string): void {
  const challenge = db.challenges.find(
    (item) => item.challengeId === challengeId,
  );
  if (challenge) challenge.status = "DECLINED";
}

db.challenges.push(
  {
    challengeId: "challenge-camille",
    direction: "received",
    topic: topicRef("sciences"),
    opponent: userRef("camille"),
    expiresAt: iso(-90),
    status: "PENDING",
  },
  {
    challengeId: "challenge-yanis",
    direction: "received",
    topic: topicRef("histoire"),
    opponent: userRef("yanis"),
    expiresAt: iso(-45),
    status: "PENDING",
  },
  {
    challengeId: "challenge-sofia",
    direction: "sent",
    topic: topicRef("cinema"),
    opponent: userRef("sofia"),
    expiresAt: iso(-120),
    status: "PENDING",
  },
);

db.rooms.push({
  roomId: "room-malik",
  topic: topicRef("sport"),
  status: "WAITING_PLAYERS",
  opponent: userRef("malik"),
  vsBot: false,
  expiresAt: iso(-60),
});
