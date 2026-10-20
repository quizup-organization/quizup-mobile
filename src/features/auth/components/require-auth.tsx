import type { ReactNode } from "react";
import { Redirect } from "expo-router";
import { useSessionStore } from "../session-store";
import { BootScreen } from "./boot-screen";

interface RequireAuthProps {
  children: ReactNode;
}

/** Garde de route : affiche l'attente de bootstrap, puis redirige vers le login. */
export function RequireAuth({ children }: RequireAuthProps) {
  const ready = useSessionStore((state) => state.ready);
  const authenticated = useSessionStore((state) => state.authenticated);

  if (!ready) return <BootScreen />;
  if (!authenticated) return <Redirect href="/(auth)/login" />;
  return <>{children}</>;
}
