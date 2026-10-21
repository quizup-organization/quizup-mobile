import { Row, Spacer, Text } from "@expo/ui";

import { decorativeModifiers } from "@/components/fragments/accessibility";
import { useNativeColors } from "@/theme";

/** Pastille emoji d'un sujet (les images ne sont pas encore branchées). */
export function TopicEmoji({
  emoji,
  color,
  size = 44,
}: {
  emoji: string | null;
  color: string | null;
  size?: number;
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
