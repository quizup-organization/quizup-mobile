import type { NotificationPreferenceView, NotificationView } from "@/features/notifications/domain/notification";
import type {
  PeopleDirection,
  PlayerCard,
  PlayerProfile,
} from "@/features/player/domain/profile";
import type { Me } from "@/features/profile/domain/me";
import type {
  LeaderboardEntry,
  TopicCard,
  TopicProgress,
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
      xpTotal: 10_870,
      level: 18,
      title: "Explorateur",
      xpForNextLevel: 12_500,
      levelProgressPercent: 87,
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
      level: 9,
      title: "Apprenti scientifique",
      xpForNextLevel: 3_000,
      levelProgressPercent: 82,
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
      level: 6,
      title: "Conteur",
      xpForNextLevel: 1_500,
      levelProgressPercent: 74,
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
      level: 7,
      title: "Explorateur",
      xpForNextLevel: 2_000,
      levelProgressPercent: 84,
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
      level: 4,
      title: "Supporter",
      xpForNextLevel: 800,
      levelProgressPercent: 67,
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
      level: 5,
      title: "Cinéphile",
      xpForNextLevel: 1_300,
      levelProgressPercent: 75,
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
      level: 5,
      title: "Mélomane",
      xpForNextLevel: 1_000,
      levelProgressPercent: 76,
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
      level: 8,
      title: "Bidouilleur",
      xpForNextLevel: 2_600,
      levelProgressPercent: 81,
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
      level: 3,
      title: "Promeneur",
      xpForNextLevel: 700,
      levelProgressPercent: 61,
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
        xpTotal: 12_480,
        level: 24,
        title: "Légende",
        xpForNextLevel: 14_000,
        levelProgressPercent: 89,
        badges: [],
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
        xpTotal: 11_920,
        level: 21,
        title: "Stratège",
        xpForNextLevel: 13_000,
        levelProgressPercent: 92,
        badges: [],
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
        xpTotal: 11_350,
        level: 19,
        title: "Curieuse",
        xpForNextLevel: 12_800,
        levelProgressPercent: 88,
        badges: [],
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
        xpTotal: 9_870,
        level: 17,
        title: "Touche-à-tout",
        xpForNextLevel: 11_000,
        levelProgressPercent: 90,
        badges: [],
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
        xpTotal: 8_940,
        level: 15,
        title: "Observatrice",
        xpForNextLevel: 10_500,
        levelProgressPercent: 85,
        badges: [],
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
        xpTotal: 7_620,
        level: 13,
        title: "Régulier",
        xpForNextLevel: 9_000,
        levelProgressPercent: 85,
        badges: [],
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
    level: profile.progression.level,
    title: profile.progression.title,
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

export function leaderboardFor(topicId: string): LeaderboardEntry[] {
  const me = db.me;
  const entries: LeaderboardEntry[] = db.profiles
    .slice(0, 5)
    .map((profile, index) => ({
      rank: index + 1,
      userId: profile.userId,
      pseudonym: profile.pseudonym,
      avatarOptions: profile.avatarOptions,
      country: profile.country,
      level: profile.progression.level,
      totalXp: profile.progression.xpTotal,
      monthlyXp: Math.round(profile.progression.xpTotal * 0.18),
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
    level: me.progression.level,
    totalXp: me.progression.xpTotal,
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
