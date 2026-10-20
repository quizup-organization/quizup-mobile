/**
 * Raisons de fin de session, affichées sur l'écran de connexion.
 *
 * <p>Elles restent volontairement fermées : le mobile ne doit jamais afficher un message
 * technique brut au joueur.</p>
 */
export type SessionEndReason = "expired" | "suspended" | "unknownUser";
