import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from "react-native-fbsdk-next";

import {
  authConfig,
  isFacebookConfigured,
  isGoogleConfigured,
} from "./config";
import { AuthCancelledError, AuthError } from "./errors";
import type { FacebookCredentials } from "./types";

let googleConfigured = false;

function ensureGoogleConfigured(): void {
  if (!isGoogleConfigured) {
    throw new AuthError(
      0,
      "googleNotConfigured",
      "Google n'est pas configuré dans ce build.",
    );
  }

  if (googleConfigured) return;

  GoogleSignin.configure({
    webClientId: authConfig.googleWebClientId,
    iosClientId:
      Platform.OS === "ios" && authConfig.googleIosClientId
        ? authConfig.googleIosClientId
        : undefined,
    offlineAccess: false,
  });
  googleConfigured = true;
}

export async function signInWithGoogleNative(): Promise<string> {
  ensureGoogleConfigured();

  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) {
      throw new AuthCancelledError();
    }

    const idToken = response.data.idToken;
    if (!idToken) {
      throw new AuthError(
        0,
        "googleMissingIdToken",
        "Google n'a pas fourni de jeton. Réessaie.",
      );
    }

    return idToken;
  } catch (error) {
    if (error instanceof AuthCancelledError || error instanceof AuthError) {
      throw error;
    }
    if (__DEV__) {
      console.warn("Google sign-in failed", error);
    }
    throw new AuthError(
      0,
      "googleSignInFailed",
      "La connexion Google a échoué. Réessaie.",
    );
  }
}

export async function signInWithFacebookNative(): Promise<FacebookCredentials> {
  if (!isFacebookConfigured) {
    throw new AuthError(
      0,
      "facebookNotConfigured",
      "Facebook n'est pas configuré dans ce build.",
    );
  }

  try {
    const result = await LoginManager.logInWithPermissions(
      ["public_profile", "email"],
      Platform.OS === "ios" ? "limited" : undefined,
    );

    if (result.isCancelled) {
      throw new AuthCancelledError();
    }

    if (Platform.OS === "ios") {
      const authenticationToken =
        await AuthenticationToken.getAuthenticationTokenIOS();
      if (authenticationToken?.authenticationToken) {
        return {
          idToken: authenticationToken.authenticationToken,
          nonce: authenticationToken.nonce,
        };
      }
    }

    const accessToken = await AccessToken.getCurrentAccessToken();
    if (!accessToken?.accessToken) {
      throw new AuthError(
        0,
        "facebookMissingToken",
        "Facebook n'a pas fourni de jeton. Réessaie.",
      );
    }

    return { accessToken: accessToken.accessToken };
  } catch (error) {
    if (error instanceof AuthCancelledError || error instanceof AuthError) {
      throw error;
    }
    if (__DEV__) {
      console.warn("Facebook sign-in failed", error);
    }
    throw new AuthError(
      0,
      "facebookSignInFailed",
      "La connexion Facebook a échoué. Réessaie.",
    );
  }
}

export function signOutNativeProviders(): void {
  GoogleSignin.signOut().catch(() => {
    // Le SDK Google n'est peut-être pas configuré dans ce build.
  });
  LoginManager.logOut();
}
