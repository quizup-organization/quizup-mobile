import { isMockAuth } from "@/lib/config";
import type { AuthGateway } from "@/features/auth/domain/gateway";
import type { Session } from "@/features/auth/domain/session";

import * as identity from "./identity";
import { mockGateway } from "./mock-gateway";
import * as providers from "./providers";
import * as storage from "./storage";

/** Implémentation réelle : identity + SDK natifs + SecureStore. */
const identityGateway: AuthGateway = {
  requestLoginCode: identity.requestLoginCode,

  loginWithCode: identity.loginWithCode,

  async loginWithGoogle() {
    const idToken = await providers.signInWithGoogleNative();
    return identity.loginWithGoogle(idToken);
  },

  async loginWithFacebook() {
    const credentials = await providers.signInWithFacebookNative();
    return identity.loginWithFacebook(credentials);
  },

  refresh: identity.refreshSession,
  logout: identity.logout,
  loadSession: storage.loadSession,
  saveSession: storage.saveSession,

  async clearSession() {
    await storage.clearSession();
    providers.signOutNativeProviders();
  },
};

export const authGateway: AuthGateway = isMockAuth
  ? mockGateway
  : identityGateway;

export type { AuthGateway };
export type { Session };
