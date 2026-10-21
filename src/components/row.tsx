import { Column, Row, Spacer } from "@expo/ui";

import { AppIcon } from "@/components/icon";
import { AppIconTile } from "@/components/icon-tile";
import type { IconKey } from "@/components/icons";
import { AppText } from "@/components/text";

/** Ligne de liste native : icône + titre + sous-titre + chevron. */
export function AppRow({
  icon,
  title,
  subtitle,
  trailing,
  onPress,
  tileBackground,
  tileColor,
}: {
  icon?: IconKey;
  title: string;
  subtitle?: string;
  trailing?: string;
  onPress?: () => void;
  tileBackground?: string;
  tileColor?: string;
}) {
  return (
    <Row
      spacing={12}
      alignment="center"
      onPress={onPress}
      style={{ paddingVertical: 8 }}
    >
      {icon ? (
        <AppIconTile
          name={icon}
          background={tileBackground}
          color={tileColor}
        />
      ) : null}
      <Column spacing={2}>
        <AppText variant="label" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </Column>
      <Spacer flexible />
      {trailing ? (
        <AppText variant="caption" tone="muted">
          {trailing}
        </AppText>
      ) : null}
      {onPress ? <AppIcon name="chevron" size={14} tone="muted" /> : null}
    </Row>
  );
}
