import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import { useTheme } from "@/hooks/use-theme";
import { ThemeProvider, useThemeSettings } from "@/providers/theme-provider";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Le splash peut déjà être masqué (Fast Refresh).
});

function RootNavigator() {
  const theme = useTheme();
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const onLoginScreen = segments[0] === "login";

    if (status === "signedOut" && !onLoginScreen) {
      router.replace("/login");
      return;
    }

    if (status === "signedIn" && onLoginScreen) {
      router.replace("/(tabs)");
      return;
    }

    void SplashScreen.hideAsync().catch(() => {
      // Le splash a déjà été masqué.
    });
  }, [status, segments, router]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" options={{ animation: "fade" }} />
        <Stack.Screen
          name="topic/[id]"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

function RootLayoutContent() {
  const { resolvedScheme } = useThemeSettings();

  return (
    <NavigationThemeProvider
      value={resolvedScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
