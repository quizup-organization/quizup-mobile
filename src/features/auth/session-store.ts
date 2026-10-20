import { create } from "zustand";
import type { SessionEndReason } from "@/shared/types/session";

interface SessionState {
  ready: boolean;
  authenticated: boolean;
  endReason: SessionEndReason | null;
  /** Salle à rejoindre après authentification (deep link `quizup://join/{id}`). */
  pendingRoomId: string | null;
  setSession: (authenticated: boolean) => void;
  endSession: (reason: SessionEndReason) => void;
  setReady: () => void;
  setPendingRoomId: (roomId: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  ready: false,
  authenticated: false,
  endReason: null,
  pendingRoomId: null,
  setSession: (authenticated) => set({ authenticated, endReason: null }),
  endSession: (endReason) => set({ authenticated: false, endReason }),
  setReady: () => set({ ready: true }),
  setPendingRoomId: (pendingRoomId) => set({ pendingRoomId }),
}));
