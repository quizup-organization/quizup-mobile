import Colors from "@/constants/Colors";
import { useThemeSettings } from "@/providers/theme-provider";

export function useTheme() {
  const { resolvedScheme } = useThemeSettings();
  return Colors[resolvedScheme];
}
