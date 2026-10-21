import { create } from "zustand";

import type { Session } from "@/features/auth/domain/session";

export type AuthStatus = "loading" | "signedOut" | "signedIn";

interface SessionState {
  status: AuthStatus;
  session: Session | null;
  setSession: (session: Session) => void;
  setStatus: (status: AuthStatus) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: "loading",
  session: null,
  setSession: (session) => set({ session, status: "signedIn" }),
  setStatus: (status) => set({ status }),
  clear: () => set({ session: null, status: "signedOut" }),
}));

export const useSession = () => useSessionStore((state) => state.session);
export const useAuthStatus = () => useSessionStore((state) => state.status);
