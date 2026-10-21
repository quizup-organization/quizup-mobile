/**
 * Contrat sémantique du thème natif.
 *
 * Aucun rôle ne porte de valeur : chaque plateforme résout ces noms vers ses
 * propres couleurs dynamiques (iOS `PlatformColor`, Android Material 3, web
 * couleurs système CSS).
 */
export type NativeColors = {
  background: string;
  surface: string;
  fill: string;
  text: string;
  textSecondary: string;
  accent: string;
  onAccent: string;
  danger: string;
};
