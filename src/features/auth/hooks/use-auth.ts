import { useCallback } from "react";

import { authGateway } from "@/features/auth/lib/gateway";
import { useSessionStore } from "@/features/auth/stores/use-session-store";

/** Actions d'auth ; l'état de session vit dans le store Zustand. */
export function useAuth() {
  const status = useSessionStore((state) => state.status);
  const session = useSessionStore((state) => state.session);
  const setSession = useSessionStore((state) => state.setSession);
  const clear = useSessionStore((state) => state.clear);

  const requestLoginCode = useCallback(async (email: string) => {
    await authGateway.requestLoginCode(email);
  }, []);

  const loginWithCode = useCallback(
    async (email: string, code: string) => {
      const next = await authGateway.loginWithCode(email, code);
      await authGateway.saveSession(next);
      setSession(next);
    },
    [setSession],
  );

  const loginWithGoogle = useCallback(async () => {
    const next = await authGateway.loginWithGoogle();
    await authGateway.saveSession(next);
    setSession(next);
  }, [setSession]);

  const loginWithFacebook = useCallback(async () => {
    const next = await authGateway.loginWithFacebook();
    await authGateway.saveSession(next);
    setSession(next);
  }, [setSession]);

  const logout = useCallback(async () => {
    const refreshToken = session?.refreshToken;
    if (refreshToken) {
      try {
        await authGateway.logout(refreshToken);
      } catch {
        // La session locale doit être purgée même si la révocation échoue.
      }
    }
    await authGateway.clearSession();
    clear();
  }, [clear, session?.refreshToken]);

  return {
    status,
    session,
    requestLoginCode,
    loginWithCode,
    loginWithGoogle,
    loginWithFacebook,
    logout,
  };
}
