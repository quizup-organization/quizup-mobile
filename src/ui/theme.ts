import { useColorScheme } from "react-native";

/** Couleur de marque QuizUp (seed des thèmes natifs iOS/Android). */
export const brand = "#4F46E5";

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export interface Colors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
}

export const lightColors: Colors = {
  background: "#F4F4F7",
  surface: "#FFFFFF",
  surfaceAlt: "#ECECF1",
  border: "#E1E1E8",
  text: "#0B0B10",
  textMuted: "#6E6E7A",
  accent: brand,
  accentSoft: "#ECEBFF",
  onAccent: "#FFFFFF",
  success: "#15803D",
  successSoft: "#DCFCE7",
  warning: "#B45309",
  warningSoft: "#FEF3C7",
  danger: "#B91C1C",
  dangerSoft: "#FEE2E2",
};

export const darkColors: Colors = {
  background: "#0B0B10",
  surface: "#16161D",
  surfaceAlt: "#22222B",
  border: "#2C2C37",
  text: "#F6F6F9",
  textMuted: "#9C9CAA",
  accent: "#8B87FF",
  accentSoft: "#24224A",
  onAccent: "#FFFFFF",
  success: "#4ADE80",
  successSoft: "#12301F",
  warning: "#FBBF24",
  warningSoft: "#332511",
  danger: "#F87171",
  dangerSoft: "#3A1616",
};

export function useColors(): Colors {
  return useColorScheme() === "dark" ? darkColors : lightColors;
}

export function useScheme(): "light" | "dark" {
  return useColorScheme() === "dark" ? "dark" : "light";
}
