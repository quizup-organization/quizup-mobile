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

import { SessionBootstrap, useAuthStatus, useSession } from "@/features/auth";
import { useNotificationStream } from "@/features/notifications/hooks/use-notification-stream";
import { useMe } from "@/features/profile/hooks/use-me";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider, useThemeSettings } from "@/providers/theme-provider";
import { useNativeColors } from "@/theme";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Le splash peut déjà être masqué (Fast Refresh).
});

function RootNavigator() {
  const colors = useNativeColors();
  const status = useAuthStatus();
  const me = useMe(status === "signedIn");
  const segments = useSegments();
  const router = useRouter();
  const onboardingCompleted = me.data?.onboardingCompleted;

  useEffect(() => {
    if (status === "loading") return;

    const onLoginScreen = segments[0] === "login";
    const onOnboardingScreen = segments[0] === "onboarding";
    const hideSplash = () =>
      void SplashScreen.hideAsync().catch(() => {
        // Le splash a déjà été masqué.
      });

    if (status === "signedOut") {
      if (!onLoginScreen) router.replace("/login");
      else hideSplash();
      return;
    }

    // Le shell attend la coquille `me` pour décider de l'onboarding.
    if (me.isLoading) return;

    if (onboardingCompleted === false) {
      if (!onOnboardingScreen) router.replace("/onboarding");
      else hideSplash();
      return;
    }

    if (onLoginScreen || onOnboardingScreen) {
      router.replace("/");
      return;
    }

    hideSplash();
  }, [
    status,
    me.isLoading,
    onboardingCompleted,
    segments,
    router,
  ]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTintColor: colors.accent,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
          headerBackTitle: "Retour",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="topics/[id]" options={{ title: "Sujet" }} />
        <Stack.Screen name="players/[id]" options={{ title: "Joueur" }} />
        <Stack.Screen
          name="notifications"
          options={{ title: "Notifications" }}
        />
        <Stack.Screen name="settings" options={{ title: "Préférences" }} />
        <Stack.Screen name="profile-edit" options={{ title: "Mon profil" }} />
        <Stack.Screen name="search" options={{ title: "Rechercher" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

function RootLayoutContent() {
  const { resolvedScheme } = useThemeSettings();
  const session = useSession();
  useNotificationStream(session?.userId);

  return (
    <NavigationThemeProvider
      value={resolvedScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryProvider>
          <SessionBootstrap>
            <RootLayoutContent />
          </SessionBootstrap>
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
