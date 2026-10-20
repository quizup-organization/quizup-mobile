import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  loginWithCode as loginWithCodeRequest,
  loginWithFacebook as loginWithFacebookRequest,
  loginWithGoogle as loginWithGoogleRequest,
  logout as logoutRequest,
  refreshSession,
  requestLoginCode as requestLoginCodeRequest,
} from "./identity";
import {
  signInWithFacebookNative,
  signInWithGoogleNative,
  signOutNativeProviders,
} from "./providers";
import { clearSession, loadSession, saveSession } from "./storage";
import type { Session } from "./types";

export type AuthStatus = "loading" | "signedOut" | "signedIn";

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  requestLoginCode: (email: string) => Promise<void>;
  loginWithCode: (email: string, code: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const stored = await loadSession();
        if (!active) return;

        if (!stored) {
          setStatus("signedOut");
          return;
        }

        if (stored.expiresAt > Date.now() + 60_000) {
          setSession(stored);
          setStatus("signedIn");
          return;
        }

        try {
          const refreshed = await refreshSession(stored);
          await saveSession(refreshed);
          if (!active) return;
          setSession(refreshed);
          setStatus("signedIn");
        } catch {
          await clearSession();
          if (!active) return;
          setSession(null);
          setStatus("signedOut");
        }
      } catch {
        if (!active) return;
        setSession(null);
        setStatus("signedOut");
      }
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, []);

  const establishSession = useCallback(async (next: Session) => {
    await saveSession(next);
    setSession(next);
    setStatus("signedIn");
  }, []);

  const requestLoginCode = useCallback(async (email: string) => {
    await requestLoginCodeRequest(email);
  }, []);

  const loginWithCode = useCallback(
    async (email: string, code: string) => {
      const next = await loginWithCodeRequest(email, code);
      await establishSession(next);
    },
    [establishSession],
  );

  const loginWithGoogle = useCallback(async () => {
    const idToken = await signInWithGoogleNative();
    const next = await loginWithGoogleRequest(idToken);
    await establishSession(next);
  }, [establishSession]);

  const loginWithFacebook = useCallback(async () => {
    const credentials = await signInWithFacebookNative();
    const next = await loginWithFacebookRequest(credentials);
    await establishSession(next);
  }, [establishSession]);

  const logout = useCallback(async () => {
    const refreshToken = session?.refreshToken;

    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch {
        // La session locale doit être purgée même si la révocation distante échoue.
      }
    }

    signOutNativeProviders();

    try {
      await clearSession();
    } finally {
      setSession(null);
      setStatus("signedOut");
    }
  }, [session?.refreshToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      requestLoginCode,
      loginWithCode,
      loginWithGoogle,
      loginWithFacebook,
      logout,
    }),
    [
      status,
      session,
      requestLoginCode,
      loginWithCode,
      loginWithGoogle,
      loginWithFacebook,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return value;
}
