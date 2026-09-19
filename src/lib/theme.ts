import { vars } from "nativewind";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Theme = "light" | "dark" | "system";

/**
 * Tokens de la maquette convertis en hex pour React Native (oklch non supporté par RN).
 * Appliqués via `vars()` sur la racine ; les classes `bg-background`, `text-foreground`… y pointent.
 */
export const lightTheme = vars({
  "--background": "#ffffff",
  "--foreground": "#0a0a0a",
  "--card": "#ffffff",
  "--card-foreground": "#0a0a0a",
  "--popover": "#ffffff",
  "--popover-foreground": "#0a0a0a",
  "--primary": "#6d5efc",
  "--primary-foreground": "#f5f7ff",
  "--secondary": "#f4f4f5",
  "--secondary-foreground": "#18181b",
  "--muted": "#f4f4f5",
  "--muted-foreground": "#71717a",
  "--accent": "#f4f4f5",
  "--accent-foreground": "#18181b",
  "--destructive": "#e5484d",
  "--destructive-foreground": "#ffffff",
  "--border": "#e4e4e7",
  "--input": "#e4e4e7",
  "--ring": "#a1a1aa",
  "--success": "#16a34a",
  "--warning": "#f59e0b",
  "--radius": "10px",
});

export const darkTheme = vars({
  "--background": "#0a0a0a",
  "--foreground": "#fafafa",
  "--card": "#1c1c1f",
  "--card-foreground": "#fafafa",
  "--popover": "#1c1c1f",
  "--popover-foreground": "#fafafa",
  "--primary": "#6d5efc",
  "--primary-foreground": "#f5f7ff",
  "--secondary": "#27272a",
  "--secondary-foreground": "#fafafa",
  "--muted": "#27272a",
  "--muted-foreground": "#a1a1aa",
  "--accent": "#27272a",
  "--accent-foreground": "#fafafa",
  "--destructive": "#f87171",
  "--destructive-foreground": "#0a0a0a",
  "--border": "#2e2e33",
  "--input": "#2e2e33",
  "--ring": "#71717a",
  "--success": "#22c55e",
  "--warning": "#f59e0b",
  "--radius": "10px",
});

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/** Palette concrète pour les styles impératifs (ex. `tabBarStyle`) où les variables CSS ne passent pas. */
export const palette = {
  light: {
    background: "#ffffff",
    card: "#ffffff",
    border: "#e4e4e7",
    foreground: "#0a0a0a",
    mutedForeground: "#71717a",
    primary: "#6d5efc",
  },
  dark: {
    background: "#0a0a0a",
    card: "#1c1c1f",
    border: "#2e2e33",
    foreground: "#fafafa",
    mutedForeground: "#a1a1aa",
    primary: "#6d5efc",
  },
} as const;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "quizup-theme",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
