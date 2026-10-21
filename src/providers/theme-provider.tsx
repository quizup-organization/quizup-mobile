import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Appearance } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { loadPreferences, savePreferences } from "@/lib/preferences";

/**
 * Préférence de thème (clair / sombre / système) et couleur d'accent.
 * Persistée dans SecureStore ; sans seed, l'accent est celui de la plateforme.
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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    void loadPreferences()
      .then((stored) => {
        if (!active) return;
        if (stored) {
          setScheme(stored.scheme);
          setSeed(stored.seed);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void savePreferences({ scheme, seed }).catch(() => undefined);
  }, [hydrated, scheme, seed]);

  // Force l'apparence native (PlatformColor, Safe Areas, contrôles) sur le choix utilisateur.
  useEffect(() => {
    if (!hydrated) return;
    Appearance.setColorScheme(
      scheme === "system" ? "unspecified" : scheme,
    );
  }, [hydrated, scheme]);

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
