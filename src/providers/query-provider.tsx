import { AppState } from "react-native";
import { focusManager, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { useSessionStore } from "@/features/auth/stores/use-session-store";
import { createQueryClient } from "@/lib/query-client";

/**
 * Provider React Query : cache, focus natif (AppState) et purge à la
 * déconnexion pour éviter de réutiliser les données d'un autre compte.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  const status = useSessionStore((state) => state.status);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      focusManager.setFocused(state === "active");
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (status === "signedOut") {
      queryClient.clear();
    }
  }, [queryClient, status]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
