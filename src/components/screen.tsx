import { Column, Host } from "@expo/ui";
import type { UniversalAlignment } from "@expo/ui";
import { createContext, useContext, type ReactNode } from "react";
import { Platform, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  SCREEN_HORIZONTAL_PADDING,
  useContentWidth,
} from "@/hooks/use-content-width";
import { useThemeSettings } from "@/providers/theme-provider";
import { useNativeColors } from "@/theme";

/** Hauteur de la barre d'onglets native (template Expo). */
const TAB_BAR_INSET = Platform.select({ ios: 50, android: 80 }) ?? 0;

const ScreenWidthContext = createContext<number | null>(null);

/**
 * Largeur de contenu fournie par l'unique `Screen` de l'écran.
 * Réservé aux fragments de layout (PageHeader, Section, Carousel, Grid, Card).
 */
export function useScreenWidth(): number {
  const width = useContext(ScreenWidthContext);
  if (width == null) {
    throw new Error("useScreenWidth doit être utilisé dans Screen");
  }
  return width;
}

/**
 * Écran : structure React Native (scroll vertical, safe areas) et **unique
 * Host** Expo UI. Tout le contenu rendu dans `children` est natif (SwiftUI /
 * Compose) : c'est la seule frontière native de l'écran.
 */
export function Screen({
  children,
  tabBar = false,
  align = "start",
  refreshing = false,
  onRefresh,
}: {
  children: ReactNode;
  tabBar?: boolean;
  align?: UniversalAlignment;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  const colors = useNativeColors();
  const { resolvedScheme, seed } = useThemeSettings();
  const insets = useSafeAreaInsets();
  const contentWidth = useContentWidth();
  const hostWidth = contentWidth + SCREEN_HORIZONTAL_PADDING * 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          ) : undefined
        }
        contentContainerStyle={{ alignItems: "center" }}
      >
        <ScreenWidthContext.Provider value={contentWidth}>
          <Host
            matchContents={{ vertical: true }}
            colorScheme={resolvedScheme}
            seedColor={seed}
            style={{ width: hostWidth }}
          >
            <Column
              alignment={align}
              spacing={16}
              style={{
                width: hostWidth,
                paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
                paddingTop: insets.top + 12,
                paddingBottom: insets.bottom + (tabBar ? TAB_BAR_INSET : 24),
              }}
            >
              {children}
            </Column>
          </Host>
        </ScreenWidthContext.Provider>
      </ScrollView>
    </View>
  );
}
