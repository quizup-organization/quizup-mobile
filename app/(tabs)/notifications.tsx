import { Column, Row, Spacer } from "@expo/ui";
import { notifications } from "@/data/fixtures";
import {
  AppDot,
  AppIconTile,
  AppText,
  Block,
  Screen,
  Section,
} from "@/ui/primitives";

export default function NotificationsScreen() {
  const unread = notifications.filter((item) => item.unread).length;

  return (
    <Screen>
      <Block>
        <Column spacing={4}>
          <AppText variant="title">Alertes</AppText>
          <AppText variant="body" tone="muted">
            {unread > 0
              ? `${unread} notifications non lues`
              : "Tout est à jour"}
          </AppText>
        </Column>
      </Block>

      <Section title="Aujourd'hui">
        <Column spacing={4}>
          {notifications.map((item) => (
            <Row
              key={item.id}
              spacing={12}
              alignment="center"
              style={{ paddingVertical: 10 }}
            >
              <AppIconTile name={item.icon} size={40} />
              <Column spacing={2}>
                <AppText variant="label" numberOfLines={1}>
                  {item.title}
                </AppText>
                <AppText variant="caption" tone="muted" numberOfLines={1}>
                  {item.subtitle}
                </AppText>
              </Column>
              <Spacer flexible />
              {item.unread ? <AppDot /> : null}
            </Row>
          ))}
        </Column>
      </Section>

      <Section title="Préférences">
        <Column spacing={2}>
          <Row spacing={12} alignment="center" style={{ paddingVertical: 10 }}>
            <AppIconTile name="notifications" size={40} />
            <Column spacing={2}>
              <AppText variant="label">Défis et invitations</AppText>
              <AppText variant="caption" tone="muted">
                Toujours activé (démo)
              </AppText>
            </Column>
            <Spacer flexible />
          </Row>
          <Row spacing={12} alignment="center" style={{ paddingVertical: 10 }}>
            <AppIconTile name="medal" size={40} />
            <Column spacing={2}>
              <AppText variant="label">Badges et progression</AppText>
              <AppText variant="caption" tone="muted">
                Toujours activé (démo)
              </AppText>
            </Column>
            <Spacer flexible />
          </Row>
        </Column>
      </Section>
    </Screen>
  );
}
