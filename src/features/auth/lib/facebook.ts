import Constants from "expo-constants";
import { Platform } from "react-native";
import { config } from "@/lib/config";

type FacebookSdkModule = typeof import("react-native-fbsdk-next");

/** Identité native Facebook : ID token OIDC (iOS) ou access token Graph (Android). */
export type FacebookCredential =
  | { idToken: string; nonce: string }
  | { accessToken: string };

/** Erreur Facebook lisible par l'écran de connexion. */
export class FacebookSignInError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FacebookSignInError";
  }
}

/**
 * Facebook Login natif n'existe pas sur le web ni dans Expo Go (module natif absent).
 * Le bouton est masqué si l'App ID ou le Client Token public manque.
 */
export function isFacebookSignInAvailable(): boolean {
  const isExpoGo = Constants.expoGoConfig != null;
  return (
    (Platform.OS === "ios" || Platform.OS === "android") &&
    !isExpoGo &&
    config.facebookSignInEnabled &&
    Boolean(config.facebookAppId) &&
    Boolean(config.facebookClientToken)
  );
}

async function loadFacebookSdk(): Promise<FacebookSdkModule> {
  try {
    return await import("react-native-fbsdk-next");
  } catch {
    throw new FacebookSignInError(
      "Facebook n'est pas disponible dans cette version. Utilise la connexion par email.",
    );
  }
}

/**
 * Nonce de cohérence transmis au SDK et vérifié côté serveur dans le token.
 * Une protection anti-replay complète nécessiterait un nonce émis par identity ;
 * le token Facebook reste par ailleurs courte durée et lié à l'App ID.
 */
function createNonce(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Ouvre le login Facebook natif.
 * - iOS : Limited Login, retourne un ID token OIDC + nonce.
 * - Android : login classique, retourne un access token à vérifier côté serveur.
 * Retourne `null` si l'utilisateur annule.
 */
export async function signInWithFacebook(): Promise<FacebookCredential | null> {
  if (!isFacebookSignInAvailable()) {
    throw new FacebookSignInError(
      "Facebook Sign-In n'est pas disponible sur cette plateforme.",
    );
  }

  const { LoginManager, AuthenticationToken, AccessToken } =
    await loadFacebookSdk();

  try {
    if (Platform.OS === "ios") {
      const nonce = createNonce();
      const result = await LoginManager.logInWithPermissions(
        ["public_profile", "email"],
        "limited",
        nonce,
      );
      if (result.isCancelled) {
        return null;
      }

      const authenticationToken =
        await AuthenticationToken.getAuthenticationTokenIOS();
      if (!authenticationToken?.authenticationToken) {
        throw new FacebookSignInError(
          "Facebook n'a pas fourni de jeton d'identité. Réessaie.",
        );
      }
      return {
        idToken: authenticationToken.authenticationToken,
        // Le SDK peut normaliser le nonce : on renvoie celui réellement présent
        // dans le token, sinon identity le rejette (nonce mismatch).
        nonce: authenticationToken.nonce || nonce,
      };
    }

    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (result.isCancelled) {
      return null;
    }

    const accessToken = await AccessToken.getCurrentAccessToken();
    if (!accessToken?.accessToken) {
      throw new FacebookSignInError(
        "Facebook n'a pas fourni de jeton d'accès. Réessaie.",
      );
    }
    return { accessToken: accessToken.accessToken };
  } catch (error) {
    if (error instanceof FacebookSignInError) {
      throw error;
    }
    if (__DEV__) {
      console.warn("[FacebookSignIn]", error);
    }
    throw new FacebookSignInError(
      "Connexion Facebook impossible. Utilise la connexion par email.",
    );
  }
}

/** Efface la session Facebook native (best-effort, ne bloque jamais le logout). */
export async function signOutFacebook(): Promise<void> {
  if (!isFacebookSignInAvailable()) return;
  try {
    const { LoginManager } = await loadFacebookSdk();
    LoginManager.logOut();
  } catch {
    // no-op : la session QuizUp est déjà purgée
  }
}
