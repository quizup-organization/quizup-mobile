import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";
import { RequireAuth } from "@/features/auth/components/require-auth";
import { BottomNav } from "@/features/shell/components/bottom-nav";

export default function AppLayout() {
  const [background] = useThemeColor(["background"]);

  return (
    <RequireAuth>
      <Tabs
        tabBar={(props) => <BottomNav {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: background },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Accueil" }} />
        <Tabs.Screen name="topics" options={{ title: "Sujets" }} />
        <Tabs.Screen name="social" options={{ title: "Social" }} />
        <Tabs.Screen
          name="notifications"
          options={{ title: "Notifications" }}
        />
        <Tabs.Screen name="profile" options={{ title: "Profil" }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="topic/[id]" options={{ href: null }} />
        <Tabs.Screen name="room/[roomId]" options={{ href: null }} />
        <Tabs.Screen name="duel/[gameId]" options={{ href: null }} />
        <Tabs.Screen name="duel/search/[ticketId]" options={{ href: null }} />
        <Tabs.Screen name="duel/result/[gameId]" options={{ href: null }} />
      </Tabs>
    </RequireAuth>
  );
}
