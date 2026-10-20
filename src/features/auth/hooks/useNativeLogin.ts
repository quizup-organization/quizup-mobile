import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { persistSession } from "@/lib/auth";
import {
  loginWithCode as loginWithCodeRequest,
  loginWithFacebook as loginWithFacebookRequest,
  loginWithGoogle as loginWithGoogleRequest,
  requestLoginCode,
  type MobileLoginResponse,
} from "../lib/auth-service";
import { signInWithFacebook } from "../lib/facebook";
import { signInWithGoogle } from "../lib/google";
import { useSessionStore } from "../session-store";

interface LoginWithCodeInput {
  email: string;
  code: string;
}

/**
 * Chaîne d'authentification native : demandes de code, connexion OTP et Google.
 *
 * <p>La session est persistée dans SecureStore avant de marquer l'utilisateur connecté.
 * La redirection vers `/(app)` est portée par la garde du groupe `(auth)` : un joueur
 * authentifié ne peut pas rester sur l'écran de connexion.</p>
 */
export function useNativeLogin() {
  const setSession = useSessionStore((state) => state.setSession);
  const queryClient = useQueryClient();

  const complete = useCallback(
    async (session: MobileLoginResponse) => {
      await persistSession({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresIn: session.expiresIn,
        userId: session.userId,
      });
      queryClient.clear();
      setSession(true);
    },
    [queryClient, setSession],
  );

  const requestCode = useMutation({
    mutationFn: (email: string) => requestLoginCode(email),
  });

  const loginWithCode = useMutation({
    mutationFn: (input: LoginWithCodeInput) =>
      loginWithCodeRequest(input.email, input.code),
    onSuccess: complete,
  });

  const loginWithGoogle = useMutation({
    mutationFn: async () => {
      const idToken = await signInWithGoogle();
      if (!idToken) return null;
      return loginWithGoogleRequest(idToken);
    },
    onSuccess: async (session) => {
      if (session) {
        await complete(session);
      }
    },
  });

  const loginWithFacebook = useMutation({
    mutationFn: async () => {
      const credential = await signInWithFacebook();
      if (!credential) return null;
      return loginWithFacebookRequest(credential);
    },
    onSuccess: async (session) => {
      if (session) {
        await complete(session);
      }
    },
  });

  return {
    requestCode,
    loginWithCode,
    loginWithGoogle,
    loginWithFacebook,
  };
}
