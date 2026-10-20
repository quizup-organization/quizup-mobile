import { useEffect } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { BootScreen } from "@/features/auth/components/boot-screen";
import { useSessionStore } from "@/features/auth/session-store";

/** Deep link `quizup://join/{roomId}` : rejoint la salle après authentification. */
export default function JoinRoomRoute() {
  const { roomId = "" } = useLocalSearchParams<{ roomId: string }>();
  const ready = useSessionStore((state) => state.ready);
  const authenticated = useSessionStore((state) => state.authenticated);
  const setPendingRoomId = useSessionStore((state) => state.setPendingRoomId);

  useEffect(() => {
    if (roomId && !authenticated) {
      setPendingRoomId(roomId);
    }
  }, [authenticated, roomId, setPendingRoomId]);

  if (!ready) return <BootScreen />;
  if (!roomId) return <Redirect href="/(app)" />;
  if (authenticated) return <Redirect href={`/(app)/room/${roomId}`} />;
  return <Redirect href="/(auth)/login" />;
}
