/**
 * DTOs de la surface BFF consommés par le mobile (mêmes contrats que le web).
 * Voir `services/quizup-bff/AGENTS.md` § 3.
 */

export type Language = "fr" | "en";

/** Pagination BFF (`PageResponse<T>`). */
export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/* ───────────────────────────── Progression / moi ──────────────────────────── */

export interface BadgeView {
  code: string;
  label: string;
  family: string;
  tier: string;
}

export interface ProgressionView {
  xpTotal: number;
  level: number;
  title: string;
  xpForNextLevel: number;
  levelProgressPercent: number;
  badges: BadgeView[];
}

export interface DuelStatsView {
  played: number;
  wins: number;
  losses: number;
  draws: number;
  winPercent: number;
  bestScore: number;
  currentWinStreak: number;
  bestWinStreak: number;
}

export interface MeView {
  userId: string;
  email: string;
  pseudonym: string;
  bio: string | null;
  country: string | null;
  avatarOptions: string | null;
  bannerUrl: string | null;
  equippedTitle: string | null;
  language: Language;
  progression: ProgressionView;
  stats: DuelStatsView;
  followingCount: number;
  followersCount: number;
}

/* ───────────────────────────────── Sujets ───────────────────────────────── */

export type TopicStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/** Tris exposés par `GET /api/topics` (enum backend `TopicSort`). */
export type TopicSort = "POPULAR" | "MOST_PLAYED" | "ALPHA" | "RECENT";

export type LeaderboardPeriod = "ALL_TIME" | "MONTHLY";
export type LeaderboardScope = "WORLD" | "FOLLOWING" | "COUNTRY";

/** Noms localisés d'un sujet (clé = code ISO 639-1). */
export type TopicNames = Record<string, string>;

/** Carte de sujet (`TopicCardView`) — catalogue, accueil et sujets suivis. */
export interface TopicCardView {
  topicId: string;
  names: TopicNames;
  description: string | null;
  category: string | null;
  categoryLabel: string | null;
  emoji: string | null;
  color: string | null;
  imageUrl: string | null;
  /** Bannière de la fiche sujet (panoramique, distincte de la couverture). */
  bannerUrl: string | null;
  followersCount: number;
  questionsCount: number;
  followed: boolean;
  status: TopicStatus;
}

/** Référence minimale d'un sujet (`TopicRefView`) — historique, défi. */
export interface TopicRefView {
  topicId: string;
  names: TopicNames;
  category: string | null;
  emoji: string | null;
  color: string | null;
  imageUrl: string | null;
  titles: Record<string, Record<string, string>> | null;
}

/** Compteur d'une catégorie (`TopicFacetsView.CategoryFacetView`). */
export interface TopicFacetView {
  category: string;
  label: string;
  count: number;
}

/** Facettes du catalogue (`TopicFacetsView`). */
export interface TopicFacetsView {
  total: number;
  categories: TopicFacetView[];
}

/** Progression du joueur courant sur un sujet (`TopicOverviewView.MyProgressView`). */
export interface TopicProgressView {
  xp: number;
  /** Parties humaines terminées dans le sujet (abandon inclus) — condition du titre Fer. */
  games: number;
  level: number;
  title: string;
  xpForNextLevel: number;
  levelProgressPercent: number;
  /** Maîtrise du sujet : grade atteint (`MasteryGrade`). */
  grade: string;
  gradeProgressPercent: number;
  gradeRemainingXp: number;
  nextGrade: string | null;
  completedQuestions: number;
  totalQuestions: number;
  completionPercent: number;
}

/** Vue agrégée de la fiche sujet (`TopicOverviewView`). */
export interface TopicOverviewView {
  topic: TopicCardView;
  titles: Record<string, Record<string, string>> | null;
  myRank: number | null;
  myProgress: TopicProgressView;
  canManage: boolean;
}

/** Entrée de classement (`TopicLeaderboardView.EntryView`). */
export interface LeaderboardEntryView {
  rank: number;
  userId: string;
  pseudonym: string | null;
  avatarOptions: string | null;
  country: string | null;
  level: number;
  totalXp: number;
  monthlyXp: number;
  suspended: boolean;
}

/** Classement d'un sujet (`TopicLeaderboardView`). */
export interface TopicLeaderboardView {
  entries: Page<LeaderboardEntryView>;
  me: LeaderboardEntryView | null;
}

export interface TopicListParams {
  q?: string;
  category?: string;
  followed?: boolean;
  sort?: TopicSort;
  page?: number;
  size?: number;
}

export interface TopicFacetsParams {
  q?: string;
  followed?: boolean;
}

export interface TopicLeaderboardParams {
  period?: LeaderboardPeriod;
  /** Mois `YYYY-MM` du classement mensuel ; absent = mois courant. */
  month?: string;
  scope?: LeaderboardScope;
  page?: number;
  size?: number;
}

/* ─────────────────────────────── Accueil ────────────────────────────────── */

/** Accueil composé par le BFF (`GET /api/home`). */
export interface HomeView {
  followedTopics: TopicCardView[];
  trendingTopics: TopicCardView[];
  newTopics: TopicCardView[];
}

/* ─────────────────────────────── Joueurs ────────────────────────────────── */

/** Référence minimale d'un joueur (`UserRefView`). */
export interface UserRefView {
  userId: string;
  pseudonym: string;
  avatarOptions: string | null;
  suspended: boolean;
}

export type GameHistoryOutcome =
  | "WIN"
  | "LOSS"
  | "DRAW"
  | "WAITING"
  | "IN_PROGRESS"
  | "CANCELLED";

/** Ligne d'historique d'un duel, relative au joueur consulté. */
export interface GameHistoryItemView {
  gameId: string;
  topic: TopicRefView;
  opponent: UserRefView | null;
  opponentType: "HUMAN" | "BOT";
  outcome: GameHistoryOutcome;
  myScore: number;
  opponentScore: number;
  xp: number | null;
  playedAt: string;
}

export interface ProfileGamesParams {
  topicId?: string;
  opponentId?: string;
  opponentType?: "HUMAN" | "BOT";
  outcome?: GameHistoryOutcome;
  sort?: "RECENT" | "OLDEST" | "SCORE";
  page?: number;
  size?: number;
}

/* ─────────────────────────── Salles et duels ──────────────────────────── */

export type BotDifficulty = "EASY" | "NORMAL" | "HARD";
export type GameChoice = "A" | "B" | "C" | "D";
export type GameStatus = "IN_PROGRESS" | "FINISHED" | "CANCELED";
export type GamePlayerType = "HUMAN" | "BOT";

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

/** Salle temps réel (`RoomView`). */
export interface RoomView {
  roomId: string;
  topic: TopicRefView;
  status: RoomStatus;
  vsBot: boolean;
  canCancel: boolean;
  opponent: UserRefView | null;
  initiatorPresent: boolean;
  participantPresent: boolean;
  gameId: string | null;
  createdAt: string;
  expiresAt: string;
  updatedAt: string;
}

export type MatchmakingStatus =
  | "SEARCHING"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "FAILED";

/** Ticket d'appariement public (`MatchmakingTicketView`). */
export interface MatchmakingTicketView {
  ticketId: string;
  topicId: string;
  status: MatchmakingStatus;
  roomId: string | null;
  opponentId: string | null;
  vsBot: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Partie en cours du joueur (`ActiveGameView`). */
export interface ActiveGameView {
  gameId: string;
  topic: TopicRefView;
  opponent: UserRefView | null;
  opponentType: GamePlayerType;
  status: GameStatus;
  createdAt: string;
}

/** Résultat d'un duel terminé (`GameResultView`). */
export interface GameResultView {
  myScore: number;
  opponentScore: number;
  winnerId: string | null;
  botGame: boolean;
  basePoints: number;
  speedBonus: number;
  correctAnswers: number;
  fastAnswers: number;
  answeredRounds: number;
  totalRounds: number;
  reward: { xp: number; victoryBonus: number } | null;
  progression: {
    xpTotal: number;
    level: number;
    title: string;
    xpForNextLevel: number;
    levelProgressPercent: number;
  };
  opponentLevel: number;
  opponentTitle: string | null;
  topic: TopicRefView;
  opponent: UserRefView | null;
  opponentId: string | null;
  botDifficulty: BotDifficulty | null;
}
