import { create } from "zustand";

interface SessionState {
  ready: boolean;
  authenticated: boolean;
  /** Verifier PKCE conservé entre l'écran de login et la WebView d'autorisation. */
  pkceVerifier: string | null;
  /** URL `/oauth2/authorize` à charger dans la WebView. */
  authorizeUrl: string | null;
  setSession: (authenticated: boolean) => void;
  setPkce: (verifier: string, authorizeUrl: string) => void;
  clearPkce: () => void;
  setReady: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  ready: false,
  authenticated: false,
  pkceVerifier: null,
  authorizeUrl: null,
  setSession: (authenticated) => set({ authenticated }),
  setPkce: (pkceVerifier, authorizeUrl) => set({ pkceVerifier, authorizeUrl }),
  clearPkce: () => set({ pkceVerifier: null, authorizeUrl: null }),
  setReady: () => set({ ready: true }),
}));
