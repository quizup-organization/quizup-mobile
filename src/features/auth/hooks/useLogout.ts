import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/lib/auth";
import { useSessionStore } from "../session-store";
import { signOutFacebook } from "../lib/facebook";
import { signOutGoogle } from "../lib/google";

/**
 * Déconnexion commune : révoque l'autorisation identity, efface la session Google native
 * (best-effort), purge le cache React Query puis termine la session. Les gardes de route
 * ramènent automatiquement au login.
 */
export function useLogout() {
  const setSession = useSessionStore((state) => state.setSession);
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await logout();
    await signOutGoogle();
    await signOutFacebook();
    queryClient.clear();
    setSession(false);
  }, [queryClient, setSession]);
}
