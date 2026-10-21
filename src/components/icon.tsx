import { Icon } from "@expo/ui";

import { icons, type IconKey } from "@/components/icons";
import { useThemeColor } from "@/hooks/use-theme-color";

export type IconTone = "default" | "muted" | "accent";

const mutedColor = {
  light: "rgba(0,0,0,0.8)",
  dark: "rgba(255,255,255,0.8)",
};

const emptyColor = {};

export function AppIcon({
  name,
  size = 18,
  color,
  tone = "default",
}: {
  name: IconKey;
  size?: number;
  color?: string;
  tone?: IconTone;
}) {
  const resolved = useThemeColor(
    tone === "muted" ? mutedColor : emptyColor,
    tone === "accent" ? "tint" : "text",
  );

  return <Icon name={icons[name]} size={size} color={color ?? resolved} />;
}
