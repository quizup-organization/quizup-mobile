import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Préférence de thème (clair / sombre / système) et couleur d'accent.
 *
 * Aucun écran ne modifie encore ces valeurs : le provider est le point d'entrée
 * prévu pour le futur sélecteur de thème. Sans seed, l'accent est celui de la
 * plateforme (tint système iOS, Material You / baseline Android).
 */
export type ThemeScheme = "light" | "dark" | "system";
export type ResolvedScheme = "light" | "dark";

type ThemeSettings = {
  scheme: ThemeScheme;
  resolvedScheme: ResolvedScheme;
  seed?: string;
  setScheme: (scheme: ThemeScheme) => void;
  setSeed: (seed?: string) => void;
};

const ThemeSettingsContext = createContext<ThemeSettings | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [scheme, setScheme] = useState<ThemeScheme>("system");
  const [seed, setSeed] = useState<string | undefined>(undefined);

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
