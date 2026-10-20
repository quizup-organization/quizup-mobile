import { useEffect } from "react";
import { restoreSession } from "@/lib/auth";
import { signOutFacebook } from "../lib/facebook";
import { signOutGoogle } from "../lib/google";
import { useSessionStore } from "../session-store";

/**
 * Restaure la session une seule fois au démarrage, avant l'affichage des écrans protégés.
 *
 * <p>Monté dans le layout racine : les deep links vers `(app)` ne passent pas par
 * `app/index.tsx`, donc la restauration ne peut pas vivre uniquement dans cet écran.</p>
 */
export function useSessionBootstrap() {
  const setSession = useSessionStore((state) => state.setSession);
  const endSession = useSessionStore((state) => state.endSession);
  const setReady = useSessionStore((state) => state.setReady);

  useEffect(() => {
    let cancelled = false;

    void restoreSession()
      .then((result) => {
        if (cancelled) return;
        if (result.reason) {
          endSession(result.reason);
          void signOutGoogle();
          void signOutFacebook();
        } else {
          setSession(result.authenticated);
        }
      })
      .catch(() => {
        if (!cancelled) setSession(false);
      })
      .finally(() => {
        if (!cancelled) setReady();
      });

    return () => {
      cancelled = true;
    };
  }, [endSession, setSession, setReady]);
}
