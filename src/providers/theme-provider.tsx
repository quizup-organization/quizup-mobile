import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Préférence de thème (clair / sombre / système) et couleur d'accent.
 *
 * Aucun écran ne modifie encore ces valeurs : le provider est le point d'entrée
 * prévu pour le futur sélecteur de thème (à l'image de WhatsApp Android).
 * Par défaut on reprend le `tint` du template Expo.
 */
export type ThemeScheme = "light" | "dark" | "system";
export type ResolvedScheme = "light" | "dark";

type ThemeSettings = {
  scheme: ThemeScheme;
  resolvedScheme: ResolvedScheme;
  seed: string;
  setScheme: (scheme: ThemeScheme) => void;
  setSeed: (seed: string) => void;
};

const DEFAULT_SEED = Colors.light.tint;

const ThemeSettingsContext = createContext<ThemeSettings | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [scheme, setScheme] = useState<ThemeScheme>("system");
  const [seed, setSeed] = useState(DEFAULT_SEED);

  const resolvedScheme: ResolvedScheme =
    scheme === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : scheme;

  const value = useMemo<ThemeSettings>(
    () => ({ scheme, resolvedScheme, seed, setScheme, setSeed }),
    [scheme, resolvedScheme, seed],
  );

  return (
    <ThemeSettingsContext.Provider value={value}>
      {children}
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings(): ThemeSettings {
  const value = useContext(ThemeSettingsContext);
  if (!value) {
    throw new Error("useThemeSettings doit être utilisé dans ThemeProvider");
  }
  return value;
}
