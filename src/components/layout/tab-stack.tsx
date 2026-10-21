import { Stack } from "expo-router";

import { HeaderActions } from "@/components/layout/header-actions";
import { useNativeColors } from "@/theme";

/** Stack natif d'un onglet : header, grand titre iOS, actions communes. */
export function TabStack({
  title,
  search = false,
  settings = false,
}: {
  title: string;
  search?: boolean;
  settings?: boolean;
}) {
  const colors = useNativeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
        headerTintColor: colors.accent,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
        headerLargeTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title,
          headerRight: () => <HeaderActions search={search} settings={settings} />,
        }}
      />
    </Stack>
  );
}
