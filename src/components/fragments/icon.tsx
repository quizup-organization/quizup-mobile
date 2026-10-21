import { Icon } from "@expo/ui";

import { decorativeModifiers } from "@/components/fragments/accessibility";
import { icons, type IconKey } from "@/components/fragments/icons";
import { useNativeColors } from "@/theme";

export type IconTone = "default" | "muted" | "accent" | "danger";

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
  const colors = useNativeColors();
  const resolved =
    tone === "muted"
      ? colors.textSecondary
      : tone === "accent"
        ? colors.accent
        : tone === "danger"
          ? colors.danger
          : colors.text;

  return (
    <Icon
      name={icons[name]}
      size={size}
      color={color ?? resolved}
      modifiers={decorativeModifiers()}
    />
  );
}
