import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { darkTheme, lightTheme, useThemeStore } from "@/lib/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark" || (theme === "system" && systemScheme === "dark");
  const themeVars = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    // garde le thème appliqué dès le montage
  }, [themeVars]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View style={themeVars} className="flex-1 bg-background">
          <StatusBar style={isDark ? "light" : "dark"} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }} />
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
