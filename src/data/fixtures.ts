import type { IconKey } from "@/components/fragments/icons";

/**
 * Données factices — aucune API, aucun branchement.
 * Tout est local et remplaçable par un vrai service plus tard.
 */

export interface Topic {
  id: string;
  name: string;
  category: string;
  players: number;
  mastery: number;
  background: string;
  foreground: string;
  icon: IconKey;
  blurb: string;
}

export const topics: Topic[] = [
  {
    id: "sciences",
    name: "Sciences",
    category: "Nature",
    players: 12_400,
    mastery: 0.72,
    background: "#E0E7FF",
    foreground: "#3730A3",
    icon: "bolt",
    blurb: "Physique, chimie, biologie : les fondamentaux en cinq questions.",
  },
  {
    id: "histoire",
    name: "Histoire",
    category: "Culture",
    players: 9_850,
    mastery: 0.48,
    background: "#FFE4E6",
    foreground: "#9F1239",
    icon: "clock",
    blurb: "Des grandes dates aux petits détails qui changent tout.",
  },
  {
    id: "geographie",
    name: "Géographie",
    category: "Nature",
    players: 8_120,
    mastery: 0.61,
    background: "#DCFCE7",
    foreground: "#166534",
    icon: "topics",
    blurb: "Capitales, fleuves, reliefs : retrouve le nord.",
  },
  {
    id: "sport",
    name: "Sport",
    category: "Loisirs",
    players: 7_640,
    mastery: 0.35,
    background: "#FEF3C7",
    foreground: "#92400E",
    icon: "trophy",
    blurb: "Records, équipes et moments légendaires.",
  },
  {
    id: "cinema",
    name: "Cinéma",
    category: "Culture",
    players: 6_310,
    mastery: 0.55,
    background: "#F3E8FF",
    foreground: "#6B21A8",
    icon: "play",
    blurb: "Répliques cultes et réalisateurs de légende.",
  },
  {
    id: "musique",
    name: "Musique",
    category: "Culture",
    players: 5_980,
    mastery: 0.42,
    background: "#FFE4EC",
    foreground: "#9D174D",
    icon: "star",
    blurb: "Des années 60 aux hits du moment.",
  },
  {
    id: "technologie",
    name: "Technologie",
    category: "Sciences",
    players: 4_870,
    mastery: 0.8,
    background: "#CFFAFE",
    foreground: "#155E75",
    icon: "game",
    blurb: "Code, internet et objets qui parlent.",
  },
  {
    id: "nature",
    name: "Nature",
    category: "Sciences",
    players: 3_450,
    mastery: 0.27,
    background: "#ECFCCB",
    foreground: "#3F6212",
    icon: "fire",
    blurb: "Animaux, plantes et écosystèmes.",
  },
];

export function findTopic(id: string | undefined): Topic | undefined {
  return topics.find((topic) => topic.id === id);
}

export const categories = [
  "Tous",
  "Culture",
  "Sciences",
  "Nature",
  "Loisirs",
];

export const dailyChallenge = {
  title: "Défi du jour",
  subtitle: "5 questions · Sciences",
  reward: "+120 XP",
};

export const streak = {
  days: 5,
  label: "Série de 5 jours",
};

export const leaderboard = [
  { rank: 1, name: "Camille", xp: 12_480, initials: "CA" },
  { rank: 2, name: "Yanis", xp: 11_920, initials: "YA" },
  { rank: 3, name: "Sofia", xp: 11_350, initials: "SO" },
  { rank: 4, name: "Nadjim", xp: 10_870, initials: "NA" },
];

export const friends = [
  { id: "f1", name: "Camille", level: 24, initials: "CA", status: "En duel" },
  { id: "f2", name: "Yanis", level: 21, initials: "YA", status: "Disponible" },
  { id: "f3", name: "Sofia", level: 19, initials: "SO", status: "Disponible" },
  { id: "f4", name: "Malik", level: 17, initials: "MA", status: "Hors ligne" },
];

export const notifications = [
  {
    id: "n1",
    title: "Camille t'a défié",
    subtitle: "Sciences · il y a 4 min",
    icon: "bolt" as IconKey,
    unread: true,
  },
  {
    id: "n2",
    title: "Nouveau badge débloqué",
    subtitle: "Série de 5 jours · il y a 1 h",
    icon: "medal" as IconKey,
    unread: true,
  },
  {
    id: "n3",
    title: "Yanis a battu ton record",
    subtitle: "Histoire · hier",
    icon: "trophy" as IconKey,
    unread: false,
  },
  {
    id: "n4",
    title: "Ton défi du jour t'attend",
    subtitle: "5 questions · 2 min",
    icon: "calendar" as IconKey,
    unread: false,
  },
];

export const profile = {
  name: "Nadjim",
  initials: "NA",
  level: 18,
  xp: 10_870,
  xpToNext: 12_500,
  title: "Explorateur",
  stats: [
    { label: "Parties", value: "248" },
    { label: "Victoires", value: "61 %" },
    { label: "Série", value: "5 j" },
  ],
  badges: [
    { id: "b1", label: "Marathonien", icon: "fire" as IconKey },
    { id: "b2", label: "Sans faute", icon: "star" as IconKey },
    { id: "b3", label: "Top 10", icon: "trophy" as IconKey },
  ],
};

export const activity = [
  { id: "a1", title: "Partie gagnée", subtitle: "Sciences · 8/10", xp: "+180 XP" },
  { id: "a2", title: "Partie perdue", subtitle: "Histoire · 6/10", xp: "+90 XP" },
  { id: "a3", title: "Série maintenue", subtitle: "5 jours d'affilée", xp: "+50 XP" },
];
