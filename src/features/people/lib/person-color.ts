import { hashString } from "@/lib/helpers";

const AVATAR_COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#22c55e",
  "#ec4899",
  "#14b8a6",
  "#eab308",
];

/** Couleur d'avatar stable dérivée de l'identifiant joueur. */
export function personColor(userId: string): string {
  return AVATAR_COLORS[hashString(userId) % AVATAR_COLORS.length];
}
