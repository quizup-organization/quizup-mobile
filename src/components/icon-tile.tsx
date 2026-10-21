import { Icon, Row, Spacer } from "@expo/ui";

import { icons, type IconKey } from "@/components/icons";
import { useThemeColor } from "@/hooks/use-theme-color";

const tileSurface = {
  light: "#eee",
  dark: "rgba(255,255,255,0.1)",
};

/** Tuile d'icône colorée. */
export function AppIconTile({
  name,
  size = 40,
  background,
  color,
}: {
  name: IconKey;
  size?: number;
  background?: string;
  color?: string;
}) {
  const defaultBackground = useThemeColor(tileSurface, "background");
  const tint = useThemeColor({}, "tint");

  return (
    <Row
      alignment="center"
      style={{
        width: size,
        height: size,
        borderRadius: 3,
        backgroundColor: background ?? defaultBackground,
      }}
    >
      <Spacer flexible />
      <Icon
        name={icons[name]}
        size={Math.round(size / 2.2)}
        color={color ?? tint}
      />
      <Spacer flexible />
    </Row>
  );
}
