import { useMemo } from "react";
import { Platform, PlatformColor } from "react-native";

import { useThemeSettings } from "@/providers/theme-provider";

import type { NativeColors } from "./types";

/**
 * Résout un nom de couleur sémantique iOS. Expo UI et expo-modules-core
 * convertissent les objets `PlatformColor` (`{ semantic: ... }`) en UIColor
 * dynamiques, y compris dans les modifiers `foregroundStyle` / `background`.
 */
function semanticColor(name: string): string {
  return PlatformColor(name) as unknown as string;
}

function iosColors(seed: string | undefined): NativeColors {
  return {
    background: semanticColor("systemBackground"),
    surface: semanticColor("secondarySystemBackground"),
    fill: semanticColor("tertiarySystemFill"),
    text: semanticColor("label"),
    textSecondary: semanticColor("secondaryLabel"),
    accent: seed ?? semanticColor("tintColor"),
    onAccent: semanticColor("white"),
    danger: semanticColor("systemRed"),
  };
}

/** Couleurs système CSS : équivalent natif du navigateur. */
const webColors: NativeColors = {
  background: "Canvas",
  surface: "ButtonFace",
  fill: "ButtonFace",
  text: "CanvasText",
  textSecondary: "GrayText",
  accent: "Highlight",
  onAccent: "HighlightText",
  danger: "red",
};

export function useNativeColors(): NativeColors {
  const { seed } = useThemeSettings();

  return useMemo(
    () => (Platform.OS === "web" ? webColors : iosColors(seed)),
    [seed],
  );
}
