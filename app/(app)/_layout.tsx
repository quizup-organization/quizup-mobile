import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Home, Search, Swords, UserRound, Users } from "lucide-react-native";
import { palette, useThemeStore } from "@/lib/theme";

export default function AppLayout() {
  const systemScheme = useColorScheme();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && systemScheme === "dark");
  const colors = isDark ? palette.dark : palette.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="topics"
        options={{
          title: "Sujets",
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: "Personnes",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Défis",
          tabBarIcon: ({ color, size }) => <Swords color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="topic/[id]" options={{ href: null }} />
      <Tabs.Screen name="player/[id]" options={{ href: null }} />
      <Tabs.Screen name="duel/[gameId]" options={{ href: null }} />
      <Tabs.Screen name="duel/search/[ticketId]" options={{ href: null }} />
    </Tabs>
  );
}
