import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onSessionEnded } from "@/lib/auth";
import { signOutFacebook } from "../lib/facebook";
import { signOutGoogle } from "../lib/google";
import { useSessionStore } from "../session-store";

/**
 * Relie les fins de session déclenchées par les appels API (401/403) à l'état de l'app.
 *
 * <p>Le cache React Query est vidé dès que la session n'est plus authentifiée : un joueur
 * qui se reconnecte avec un autre compte ne doit jamais voir les données du précédent.</p>
 */
export function useSessionLifecycle() {
  const endSession = useSessionStore((state) => state.endSession);
  const ready = useSessionStore((state) => state.ready);
  const authenticated = useSessionStore((state) => state.authenticated);
  const queryClient = useQueryClient();

  useEffect(() => {
    return onSessionEnded((reason) => {
      endSession(reason);
      // Best-effort : le prochain login social repart du sélecteur de compte.
      void signOutGoogle();
      void signOutFacebook();
    });
  }, [endSession]);

  useEffect(() => {
    if (ready && !authenticated) {
      queryClient.clear();
    }
  }, [authenticated, queryClient, ready]);
}
