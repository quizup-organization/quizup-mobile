import { Icon, Row, Spacer } from "@expo/ui";

import { decorativeModifiers } from "@/components/fragments/accessibility";
import { icons, type IconKey } from "@/components/fragments/icons";
import { useNativeColors } from "@/theme";

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
  const colors = useNativeColors();

  return (
    <Row
      alignment="center"
      modifiers={decorativeModifiers()}
      style={{
        width: size,
        height: size,
        borderRadius: 3,
        backgroundColor: background ?? colors.fill,
      }}
    >
      <Spacer flexible />
      <Icon
        name={icons[name]}
        size={Math.round(size / 2.2)}
        color={color ?? colors.accent}
      />
      <Spacer flexible />
    </Row>
  );
}
