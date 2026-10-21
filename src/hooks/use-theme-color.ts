import Colors, { type ThemeColor } from "@/constants/Colors";
import { useThemeSettings } from "@/providers/theme-provider";

/**
 * Résout une couleur du thème, avec la possibilité de surcharger la valeur
 * pour chaque schéma (API du template Expo : `lightColor` / `darkColor`).
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColor,
) {
  const { resolvedScheme } = useThemeSettings();
  const colorFromProps = props[resolvedScheme];

  return colorFromProps ?? Colors[resolvedScheme][colorName];
}
