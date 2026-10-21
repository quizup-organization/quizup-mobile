import { Platform } from "react-native";

/**
 * Configuration publique de l'application.
 *
 * Les valeurs `EXPO_PUBLIC_*` sont embarquées dans le binaire : identifiants
 * publics uniquement. Les secrets restent côté identity.
 *
 * Tant que le BFF n'est pas branché, l'app tourne en mode démo :
 * - `EXPO_PUBLIC_AUTH_MODE` : `mock` (défaut) ou `identity`
 * - `EXPO_PUBLIC_DATA_SOURCE` : `mock` (défaut) ou `api`
 * - `EXPO_PUBLIC_MOCK_SCENARIO` : `success` (défaut), `empty` ou `error`
 */
function withoutTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export type AuthMode = "mock" | "identity";
export type DataSource = "mock" | "api";
export type MockScenario = "success" | "empty" | "error";

export const config = {
  identityUrl: withoutTrailingSlash(
    process.env.EXPO_PUBLIC_IDENTITY_URL ??
      process.env.EXPO_PUBLIC_OIDC_AUTHORITY ??
      "https://identity.quizup.cnadjim.fr",
  ),
  apiUrl: withoutTrailingSlash(
    process.env.EXPO_PUBLIC_API_URL ?? "https://api.quizup.cnadjim.fr",
  ),
  mobileClientId:
    process.env.EXPO_PUBLIC_OIDC_CLIENT_ID?.trim() || "mobile",
  googleWebClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? "",
  googleIosClientId:
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() ?? "",
  facebookAppId:
    process.env.EXPO_PUBLIC_FACEBOOK_APP_ID?.trim() ?? "",
  facebookClientToken:
    process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN?.trim() ?? "",
} as const;

export const authMode: AuthMode =
  process.env.EXPO_PUBLIC_AUTH_MODE === "identity" ? "identity" : "mock";

export const dataSource: DataSource =
  process.env.EXPO_PUBLIC_DATA_SOURCE === "api" ? "api" : "mock";

export const mockScenario: MockScenario =
  process.env.EXPO_PUBLIC_MOCK_SCENARIO === "empty"
    ? "empty"
    : process.env.EXPO_PUBLIC_MOCK_SCENARIO === "error"
      ? "error"
      : "success";

export const isMockAuth = authMode === "mock";
export const isMockData = dataSource === "mock";

/** En mode démo, les boutons sociaux sont toujours proposés. */
export const isGoogleConfigured =
  isMockAuth ||
  (Platform.OS === "ios"
    ? Boolean(config.googleWebClientId && config.googleIosClientId)
    : Boolean(config.googleWebClientId));

export const isFacebookConfigured =
  isMockAuth ||
  Boolean(config.facebookAppId && config.facebookClientToken);
