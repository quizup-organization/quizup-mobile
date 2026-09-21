import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

export interface AuthResponse {
  userId: string;
  email: string;
}

/**
 * API JSON d'authentification passwordless (code OTP email).
 * `requestCode` déclenche l'envoi du code ; `verifyCode` établit la session interactive
 * temporaire (cookie `AUTH_TX`) avant le pipeline OIDC (PKCE via WebView).
 */
export const authService = {
  requestCode: (email: string): Promise<void> =>
    api.post<void>(ENDPOINTS.auth.requestCode, { email }, {
      absolute: true,
      credentials: "include",
    }),

  verifyCode: (email: string, code: string): Promise<AuthResponse> =>
    api.post<AuthResponse>(ENDPOINTS.auth.verifyCode, { email, code }, {
      absolute: true,
      credentials: "include",
    }),

  logout: (): Promise<void> =>
    api.post<void>(ENDPOINTS.auth.logout, undefined, {
      absolute: true,
      credentials: "include",
    }),
};
