import { Platform } from "react-native";

/**
 * Configuration publique de l'authentification mobile.
 *
 * Toutes les valeurs `EXPO_PUBLIC_*` sont embarquées dans le binaire : elles ne
 * doivent contenir que des identifiants publics (client IDs, App ID, Client
 * Token Facebook). Les secrets restent côté identity.
 */
function withoutTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export const authConfig = {
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

export const isGoogleConfigured =
  Platform.OS === "ios"
    ? Boolean(authConfig.googleWebClientId && authConfig.googleIosClientId)
    : Boolean(authConfig.googleWebClientId);

export const isFacebookConfigured = Boolean(
  authConfig.facebookAppId && authConfig.facebookClientToken,
);
