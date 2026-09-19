/**
 * Configuration runtime de l'app mobile (variables `EXPO_PUBLIC_*`).
 */
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080",
  oidcAuthority:
    process.env.EXPO_PUBLIC_OIDC_AUTHORITY ?? "http://localhost:8085",
  oidcClientId: process.env.EXPO_PUBLIC_OIDC_CLIENT_ID ?? "mobile",
  redirectUri: "quizup://callback",
} as const;
