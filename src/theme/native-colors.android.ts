import { useMaterialColors } from "@expo/ui/jetpack-compose";

import { useThemeSettings } from "@/providers/theme-provider";

import type { NativeColors } from "./types";

/**
 * Palette Material 3 native. Quand `seed` est absent, Android 12+ utilise les
 * couleurs dynamiques du fond d'écran (Material You) ; sinon la palette
 * baseline. Avec un seed, la palette est dérivée sur toutes les versions.
 */
export function useNativeColors(): NativeColors {
  const { resolvedScheme, seed } = useThemeSettings();
  const palette = useMaterialColors({
    colorScheme: resolvedScheme,
    seedColor: seed,
  });

  return {
    background: palette.background,
    surface: palette.surfaceContainer,
    fill: palette.surfaceContainerHighest,
    text: palette.onSurface,
    textSecondary: palette.onSurfaceVariant,
    accent: palette.primary,
    onAccent: palette.onPrimary,
    danger: palette.error,
  };
}
