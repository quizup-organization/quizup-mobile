import { Button, Row, Text } from "@expo/ui";
import type { UniversalStyle } from "@expo/ui";

import { useNativeColors } from "@/theme";

/** Bouton social avec un badge de marque (G / f) et un libellé. */
export function AppSocialButton({
  label,
  badge,
  badgeColor,
  onPress,
  disabled,
  style,
}: {
  label: string;
  badge: string;
  badgeColor: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: UniversalStyle;
}) {
  const colors = useNativeColors();

  return (
    <Button
      variant="outlined"
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      <Row spacing={10} alignment="center">
        <Text
          textStyle={{
            fontSize: 20,
            fontWeight: "800",
            color: badgeColor,
          }}
        >
          {badge}
        </Text>
        <Text
          textStyle={{
            fontSize: 17,
            fontWeight: "600",
            color: colors.text,
          }}
        >
          {label}
        </Text>
      </Row>
    </Button>
  );
}
