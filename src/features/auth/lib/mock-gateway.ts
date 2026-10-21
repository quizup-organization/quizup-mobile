import type { AuthGateway } from "@/features/auth/domain/gateway";
import type { Session } from "@/features/auth/domain/session";

const MOCK_ACCESS_TOKEN = "mock-access-token";
const MOCK_REFRESH_TOKEN = "mock-refresh-token";

function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createMockSession(email = "demo@quizup.local"): Session {
  return {
    userId: "demo-user",
    email,
    accessToken: MOCK_ACCESS_TOKEN,
    refreshToken: MOCK_REFRESH_TOKEN,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
}

/** Auth de démonstration : aucun appel identity, aucun SDK natif. */
export const mockGateway: AuthGateway = {
  async requestLoginCode() {
    await delay();
  },

  async loginWithCode(email) {
    await delay();
    return createMockSession(email);
  },

  async loginWithGoogle() {
    await delay();
    return createMockSession();
  },

  async loginWithFacebook() {
    await delay();
    return createMockSession();
  },

  async refresh(session) {
    await delay(150);
    return { ...session, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
  },

  async logout() {
    await delay(100);
  },

  async loadSession() {
    return null;
  },

  async saveSession() {
    // Le mock n'a pas besoin de persister : SessionBootstrap recrée la session.
  },

  async clearSession() {
    // Idem.
  },
};
