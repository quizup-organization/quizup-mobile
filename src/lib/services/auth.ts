import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

export interface AuthResponse {
  userId: string;
  email: string;
}

/**
 * API JSON d'authentification : crée la session interactive temporaire (cookie `AUTH_TX`).
 * Le pipeline OIDC (code d'autorisation + PKCE) est ensuite déclenché par `loginRedirect`.
 */
export const authService = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post<AuthResponse>(ENDPOINTS.auth.login, { email, password }, {
      absolute: true,
      credentials: "include",
    }),

  register: (email: string, password: string): Promise<AuthResponse> =>
    api.post<AuthResponse>(ENDPOINTS.auth.register, { email, password }, {
      absolute: true,
      credentials: "include",
    }),

  logout: (): Promise<void> =>
    api.post<void>(ENDPOINTS.auth.logout, undefined, {
      absolute: true,
      credentials: "include",
    }),
};
