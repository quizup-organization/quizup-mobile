import { useEffect } from "react";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import { restoreSession } from "@/lib/auth";
import { useSessionStore } from "@/features/auth/session-store";

export default function Index() {
  const { ready, authenticated, setSession, setReady } = useSessionStore();

  useEffect(() => {
    restoreSession()
      .then((ok) => setSession(ok))
      .finally(() => setReady());
  }, [setSession, setReady]);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={authenticated ? "/(app)" : "/(auth)/login"} />;
}
