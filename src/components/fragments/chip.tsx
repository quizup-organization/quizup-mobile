import { Icon, Row } from "@expo/ui";

import { decorativeModifiers, interactiveModifiers } from "@/components/fragments/accessibility";
import { icons, type IconKey } from "@/components/fragments/icons";
import { AppText } from "@/components/fragments/text";
import { useNativeColors } from "@/theme";

export function AppChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: IconKey;
  selected?: boolean;
  onPress?: () => void;
}) {
  const colors = useNativeColors();

  return (
    <Row
      spacing={6}
      alignment="center"
      onPress={onPress}
      modifiers={
        onPress ? interactiveModifiers({ label, selected }) : undefined
      }
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: selected ? colors.accent : colors.fill,
      }}
    >
      {icon ? (
        <Icon
          name={icons[icon]}
          size={14}
          color={selected ? colors.onAccent : colors.textSecondary}
          modifiers={decorativeModifiers()}
        />
      ) : null}
      <AppText variant="caption" tone={selected ? "onAccent" : "default"}>
        {label}
      </AppText>
    </Row>
  );
}
