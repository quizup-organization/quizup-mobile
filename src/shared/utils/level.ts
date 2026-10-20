/**
 * Titres honorifiques par niveau (repris de la maquette, appliqués côté profil).
 */
const TITLES: { min: number; title: string }[] = [
  { min: 50, title: "Légende QuizUp" },
  { min: 40, title: "Maître confirmé" },
  { min: 30, title: "Expert" },
  { min: 20, title: "Historien confirmé" },
  { min: 10, title: "Vétéran" },
  { min: 5, title: "Apprenti" },
  { min: 1, title: "Débutant" },
];

export function titleForLevel(level: number): string {
  return TITLES.find((t) => level >= t.min)?.title ?? "Débutant";
}

export function xpProgress(xp: number, xpForNextLevel: number): number {
  if (!xpForNextLevel) return 0;
  const inLevel = xp % Math.max(1, xpForNextLevel);
  return Math.min(100, Math.round((inLevel / xpForNextLevel) * 100));
}
