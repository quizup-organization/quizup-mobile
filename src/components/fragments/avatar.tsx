import { Row, Spacer, Text } from "@expo/ui";

import { useNativeColors } from "@/theme";

export function AppAvatar({
  initials,
  size = 44,
}: {
  initials: string;
  size?: number;
}) {
  const colors = useNativeColors();

  return (
    <Row
      alignment="center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.fill,
      }}
    >
      <Spacer flexible />
      <Text
        textStyle={{
          fontSize: Math.round(size / 2.8),
          fontWeight: "700",
          color: colors.accent,
        }}
      >
        {initials}
      </Text>
      <Spacer flexible />
    </Row>
  );
}
