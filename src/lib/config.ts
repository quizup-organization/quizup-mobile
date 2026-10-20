/**
 * Configuration runtime de l'app mobile (variables `EXPO_PUBLIC_*`).
 *
 * <p>`identityUrl` est la base de `quizup-identity` (endpoints d'auth natifs + OIDC
 * standard). `EXPO_PUBLIC_IDENTITY_URL` est un override explicite ; sinon on retombe
 * sur `EXPO_PUBLIC_OIDC_AUTHORITY`, injecté par la CI en release. Ne jamais mettre une
 * URL localhost dans le `.env` principal : elle serait embarquée dans l'APK.</p>
 */
const identityUrl = (
  process.env.EXPO_PUBLIC_IDENTITY_URL ??
  process.env.EXPO_PUBLIC_OIDC_AUTHORITY ??
  "http://localhost:8085"
).replace(/\/$/, "");

export const config = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8092").replace(
    /\/$/,
    "",
  ),
  identityUrl,
  clientId: process.env.EXPO_PUBLIC_OIDC_CLIENT_ID ?? "mobile",
  /**
   * Client OAuth2 **Web** Google (audience des ID tokens). Aucun fallback en dur :
   * la valeur vient de `.env` en local et de la CI en release. Vide = Google masqué.
   */
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "",
  /** Interrupteur explicite pour masquer Google sans retirer l'ID client. */
  googleSignInEnabled:
    process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_ENABLED !== "false",
  /**
   * Facebook Login natif (public). L'App Secret n'est jamais embarqué :
   * il reste côté identity. Le Client Token est requis par le SDK natif.
   */
  facebookAppId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ?? "",
  facebookClientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN ?? "",
  /** Interrupteur explicite pour masquer Facebook sans retirer la configuration. */
  facebookSignInEnabled:
    process.env.EXPO_PUBLIC_FACEBOOK_SIGN_IN_ENABLED !== "false",
} as const;
