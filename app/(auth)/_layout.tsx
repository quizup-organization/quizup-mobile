import { Redirect, Stack } from "expo-router";
import { BootScreen } from "@/features/auth/components/boot-screen";
import { useSessionStore } from "@/features/auth/session-store";

export default function AuthLayout() {
  const ready = useSessionStore((state) => state.ready);
  const authenticated = useSessionStore((state) => state.authenticated);
  const pendingRoomId = useSessionStore((state) => state.pendingRoomId);

  if (!ready) return <BootScreen />;
  if (authenticated) {
    return (
      <Redirect
        href={
          pendingRoomId
            ? `/(app)/room/${pendingRoomId}`
            : "/(app)"
        }
      />
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
