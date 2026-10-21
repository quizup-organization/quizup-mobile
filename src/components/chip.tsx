import { Icon, Row } from "@expo/ui";

import { icons, type IconKey } from "@/components/icons";
import { AppText } from "@/components/text";
import { useThemeColor } from "@/hooks/use-theme-color";

/** Surface des contrôles secondaires (`separator` du template). */
const controlSurface = {
  light: "#eee",
  dark: "rgba(255,255,255,0.1)",
};

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
  const tint = useThemeColor({}, "tint");
  const background = useThemeColor({}, "background");
  const neutralSurface = useThemeColor(controlSurface, "background");
  const muted = useThemeColor(
    { light: "rgba(0,0,0,0.8)", dark: "rgba(255,255,255,0.8)" },
    "text",
  );

  return (
    <Row
      spacing={6}
      alignment="center"
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: selected ? tint : neutralSurface,
      }}
    >
      {icon ? (
        <Icon
          name={icons[icon]}
          size={14}
          color={selected ? background : muted}
        />
      ) : null}
      <AppText variant="caption" tone={selected ? "onAccent" : "default"}>
        {label}
      </AppText>
    </Row>
  );
}
