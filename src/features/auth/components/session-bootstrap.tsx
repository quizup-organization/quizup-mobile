import { useEffect, type ReactNode } from "react";

import { isMockAuth } from "@/lib/config";
import { registerSessionGateway } from "@/lib/session";

import { authGateway } from "@/features/auth/lib/gateway";
import { createMockSession } from "@/features/auth/lib/mock-gateway";
import { useSessionStore } from "@/features/auth/stores/use-session-store";

const REFRESH_MARGIN_MS = 60_000;

/**
 * Hydrate la session au démarrage et enregistre le `SessionGateway` pour les
 * couches infra (HTTP/WS). En mode mock, une session démo est créée d'office.
 */
export function SessionBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    let active = true;
    let refreshing: Promise<string | null> | null = null;

    const store = useSessionStore.getState;

    async function refreshSession(): Promise<string | null> {
      const current = store().session;
      if (!current) return null;

      try {
        const next = await authGateway.refresh(current);
        await authGateway.saveSession(next);
        if (active) store().setSession(next);
        return next.accessToken;
      } catch {
        await authGateway.clearSession();
        if (active) store().clear();
        return null;
      }
    }

    registerSessionGateway({
      getAccessToken: () => store().session?.accessToken ?? null,
      refresh: () => {
        if (!refreshing) {
          refreshing = refreshSession().finally(() => {
            refreshing = null;
          });
        }
        return refreshing;
      },
      clear: async () => {
        await authGateway.clearSession();
        if (active) store().clear();
      },
      subscribe: (listener) => useSessionStore.subscribe(() => listener()),
    });

    async function hydrate() {
      if (isMockAuth) {
        store().setSession(createMockSession());
        return;
      }

      try {
        const stored = await authGateway.loadSession();
        if (!active) return;

        if (!stored) {
          store().setStatus("signedOut");
          return;
        }

        if (stored.expiresAt > Date.now() + REFRESH_MARGIN_MS) {
          store().setSession(stored);
          return;
        }

        try {
          const refreshed = await authGateway.refresh(stored);
          await authGateway.saveSession(refreshed);
          if (active) store().setSession(refreshed);
        } catch {
          await authGateway.clearSession();
          if (active) store().clear();
        }
      } catch {
        if (active) store().clear();
      }
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, []);

  return children;
}
