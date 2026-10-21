import { Row, Spacer, Text } from "@expo/ui";

import { useThemeColor } from "@/hooks/use-theme-color";

const avatarSurface = {
  light: "#eee",
  dark: "rgba(255,255,255,0.1)",
};

export function AppAvatar({
  initials,
  size = 44,
}: {
  initials: string;
  size?: number;
}) {
  const background = useThemeColor(avatarSurface, "background");
  const tint = useThemeColor({}, "tint");

  return (
    <Row
      alignment="center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: background,
      }}
    >
      <Spacer flexible />
      <Text
        textStyle={{
          fontSize: Math.round(size / 2.8),
          fontWeight: "700",
          color: tint,
        }}
      >
        {initials}
      </Text>
      <Spacer flexible />
    </Row>
  );
}
