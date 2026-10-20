import "../global.css";
import { useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HeroUINativeProvider } from "heroui-native";
import { useFonts } from "expo-font";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { Inter_800ExtraBold } from "@expo-google-fonts/inter/800ExtraBold";
import { SessionRuntime } from "@/features/auth/components/session-runtime";
import { BootScreen } from "@/features/auth/components/boot-screen";
import { ConfirmDialogHost } from "@/shared/components/confirm-dialog";
import { ToastBridge } from "@/shared/components/toast-bridge";
import { createQueryClient } from "@/lib/query-client";

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const [queryClient] = useState(() => createQueryClient());
  const [fontsLoaded, fontsError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <HeroUINativeProvider>
            {!fontsLoaded && !fontsError ? (
              <BootScreen />
            ) : (
              <>
                <SessionRuntime />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                  }}
                />
                <ToastBridge />
                <ConfirmDialogHost />
              </>
            )}
            <StatusBar style={systemScheme === "dark" ? "light" : "dark"} />
          </HeroUINativeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
