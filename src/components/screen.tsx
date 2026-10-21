import type { ReactNode } from "react";
import { Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CONTENT_MAX_WIDTH,
  SCREEN_HORIZONTAL_PADDING,
} from "@/hooks/use-content-width";
import { useTheme } from "@/hooks/use-theme";

/** Hauteur de la barre d'onglets native (template Expo). */
const TAB_BAR_INSET = Platform.select({ ios: 50, android: 80 }) ?? 0;

/**
 * Écran : scroll et marges côté React Native, contenu côté Expo UI.
 * Le contenu est centré et borné à `CONTENT_MAX_WIDTH`, comme dans le template.
 */
export function Screen({
  children,
  tabBar = false,
}: {
  children: ReactNode;
  tabBar?: boolean;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + (tabBar ? TAB_BAR_INSET : 24),
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: CONTENT_MAX_WIDTH,
            alignItems: "center",
            gap: 16,
          }}
        >
          {children}
        </View>
      </ScrollView>
    </View>
  );
}
