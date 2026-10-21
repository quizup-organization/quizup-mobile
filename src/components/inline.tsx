import { Host } from "@expo/ui";
import type { ReactNode } from "react";

import { useThemeSettings } from "@/providers/theme-provider";

/** Variante `Block` qui se dimensionne sur son contenu (chips, petites actions). */
export function Inline({ children }: { children: ReactNode }) {
  const { resolvedScheme, seed } = useThemeSettings();

  return (
    <Host matchContents colorScheme={resolvedScheme} seedColor={seed}>
      {children}
    </Host>
  );
}
