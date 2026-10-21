import { Host } from "@expo/ui";
import type { ReactNode } from "react";

import { useThemeSettings } from "@/providers/theme-provider";

/**
 * Pont React Native → UI native. Un `Block` par bloc de contenu : c'est la
 * granularité qui garde le nombre de vues natives raisonnable.
 */
export function Block({
  children,
  width,
}: {
  children: ReactNode;
  width?: number;
}) {
  const { resolvedScheme, seed } = useThemeSettings();

  return (
    <Host
      matchContents={{ vertical: true }}
      colorScheme={resolvedScheme}
      seedColor={seed}
      style={width === undefined ? { width: "100%" } : { width }}
    >
      {children}
    </Host>
  );
}
