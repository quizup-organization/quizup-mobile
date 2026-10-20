import Constants from "expo-constants";
import { Platform } from "react-native";
import { config } from "@/lib/config";

type GoogleSigninModule = typeof import("@react-native-google-signin/google-signin");

let configured = false;

const DEVELOPER_ERROR_CODE = "10";
const NETWORK_ERROR_CODE = "7";
const DEVELOPER_ERROR_MESSAGE =
  "La connexion Google n'est pas configurée pour cette version (client OAuth Android / SHA-1). Utilise le code par e-mail.";
const NETWORK_ERROR_MESSAGE =
  "Connexion Google impossible : vérifie ta connexion réseau.";
const UNKNOWN_MESSAGE =
  "Connexion Google impossible. Utilise le code par e-mail.";

/** Erreur Google lisible par l'écran de connexion. */
export class GoogleSignInError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleSignInError";
  }
}

/**
 * Google Sign-In natif n'existe pas sur le web ni dans Expo Go (module natif absent).
 * iOS n'est exposé que lorsqu'un client iOS est configuré. L'OTP reste disponible partout.
 */
export function isGoogleSignInAvailable(): boolean {
  const isExpoGo = Constants.expoGoConfig != null;
  const platformConfigured =
    Platform.OS === "android" ||
    (Platform.OS === "ios" && Boolean(config.googleIosClientId));

  return (
    platformConfigured &&
    !isExpoGo &&
    config.googleSignInEnabled &&
    Boolean(config.googleWebClientId)
  );
}

async function loadGoogleSignin(): Promise<GoogleSigninModule> {
  let module: GoogleSigninModule;
  try {
    module = await import("@react-native-google-signin/google-signin");
  } catch {
    throw new GoogleSignInError(
      "Google n'est pas disponible dans cette version. Utilise l'APK de dev.",
    );
  }

  if (!configured) {
    module.GoogleSignin.configure({
      webClientId: config.googleWebClientId,
      iosClientId: config.googleIosClientId || undefined,
      scopes: ["profile", "email"],
      offlineAccess: false,
    });
    configured = true;
  }
  return module;
}

function isDeveloperError(code: string, message: string): boolean {
  return (
    code === DEVELOPER_ERROR_CODE ||
    code === "DEVELOPER_ERROR" ||
    /DEVELOPER_ERROR/i.test(message)
  );
}

function isNetworkError(code: string, message: string): boolean {
  return code === NETWORK_ERROR_CODE || /NETWORK_ERROR/i.test(message);
}

/**
 * Ouvre le sélecteur de compte Google natif et retourne l'ID token.
 * Retourne `null` si l'utilisateur annule.
 */
export async function signInWithGoogle(): Promise<string | null> {
  if (!isGoogleSignInAvailable()) {
    throw new GoogleSignInError(
      "Google Sign-In n'est pas disponible sur cette plateforme.",
    );
  }

  const {
    GoogleSignin,
    isSuccessResponse,
    isErrorWithCode,
    statusCodes,
  } = await loadGoogleSignin();

  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      return null;
    }

    const idToken =
      response.data.idToken ?? (await GoogleSignin.getTokens()).idToken;
    if (!idToken) {
      throw new GoogleSignInError(
        "Google n'a pas fourni de jeton d'identité. Réessaie.",
      );
    }
    return idToken;
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return null;
      }
      if (error.code === statusCodes.IN_PROGRESS) {
        throw new GoogleSignInError("Une connexion Google est déjà en cours.");
      }
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new GoogleSignInError(
          "Google Play Services est requis pour la connexion Google.",
        );
      }
      if (isDeveloperError(error.code, error.message)) {
        // Toujours journalisé (sans secret) : visible via `adb logcat` sur l'APK de test.
        console.warn("[GoogleSignIn] DEVELOPER_ERROR:", error.message);
        throw new GoogleSignInError(DEVELOPER_ERROR_MESSAGE);
      }
      if (isNetworkError(error.code, error.message)) {
        throw new GoogleSignInError(NETWORK_ERROR_MESSAGE);
      }
      if (__DEV__) {
        console.warn("[GoogleSignIn]", error.code, error.message);
      }
    } else if (__DEV__) {
      console.warn("[GoogleSignIn]", error);
    }

    if (error instanceof GoogleSignInError) {
      throw error;
    }
    throw new GoogleSignInError(UNKNOWN_MESSAGE);
  }
}

/** Efface la session Google native (best-effort, ne bloque jamais le logout). */
export async function signOutGoogle(): Promise<void> {
  if (!isGoogleSignInAvailable()) return;
  try {
    const { GoogleSignin } = await loadGoogleSignin();
    await GoogleSignin.signOut();
  } catch {
    // no-op : la session QuizUp est déjà purgée
  }
}
