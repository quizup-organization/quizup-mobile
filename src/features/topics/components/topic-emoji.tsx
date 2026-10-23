import { Row, Spacer, Text } from "@expo/ui";

import { AppImage } from "@/components/fragments/image";
import { decorativeModifiers } from "@/components/fragments/accessibility";
import { useNativeColors } from "@/theme";

/** Pastille d'un sujet : image distante si disponible, sinon emoji éditorial. */
export function TopicEmoji({
  emoji,
  color,
  imageUrl,
  size = 44,
}: {
  emoji: string | null;
  color: string | null;
  imageUrl?: string | null;
  size?: number;
}) {
  const colors = useNativeColors();

  if (imageUrl) {
    return (
      <AppImage
        source={{ uri: imageUrl }}
        width={size}
        height={size}
        radius={Math.max(10, size / 4)}
        accessibilityLabel="Illustration du sujet"
      />
    );
  }

  return (
    <Row
      alignment="center"
      modifiers={decorativeModifiers()}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(10, size / 4),
        backgroundColor: color ?? colors.fill,
      }}
    >
      <Spacer flexible />
      <Text textStyle={{ fontSize: Math.round(size / 2.2) }}>
        {emoji ?? "❓"}
      </Text>
      <Spacer flexible />
    </Row>
  );
}
