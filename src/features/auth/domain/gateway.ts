import type { Session } from "./session";

/**
 * Frontière auth : l'app ne connaît que ce contrat. L'implémentation est
 * identity (réelle) ou mock (session démo) selon `EXPO_PUBLIC_AUTH_MODE`.
 */
export interface AuthGateway {
  requestLoginCode(email: string): Promise<void>;
  loginWithCode(email: string, code: string): Promise<Session>;
  loginWithGoogle(): Promise<Session>;
  loginWithFacebook(): Promise<Session>;
  refresh(session: Session): Promise<Session>;
  logout(refreshToken: string): Promise<void>;
  loadSession(): Promise<Session | null>;
  saveSession(session: Session): Promise<void>;
  clearSession(): Promise<void>;
}
