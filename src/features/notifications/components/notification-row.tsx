import {
  AppButton,
  AppDot,
  AppIconTile,
  AppText,
  Column,
  Row,
  Spacer,
  type IconKey,
} from "@/components";
import type {
  NotificationType,
  NotificationView,
} from "@/features/notifications/domain/notification";
import {
  isUnread,
  notificationLabel,
  relativeTime,
} from "@/features/notifications/domain/notification";
import { useProfile } from "@/features/player/hooks/use-profile";

const NOTIFICATION_ICONS: Record<NotificationType, IconKey> = {
  FOLLOW: "social",
  CHALLENGE_RECEIVED: "game",
  CHALLENGE_DECLINED: "chat",
  ROOM_ACCEPTED: "play",
  WIZZ: "bolt",
  QUESTION_REPORTED: "medal",
  ACCOUNT_SUSPENDED: "settings",
};

export function NotificationRow({
  notification,
  onPress,
  onDelete,
}: {
  notification: NotificationView;
  onPress: () => void;
  onDelete: () => void;
}) {
  const actor = useProfile(notification.actorId ?? undefined);
  const actorName = actor.data?.pseudonym ?? "Un joueur";
  const unread = isUnread(notification);

  return (
    <Row spacing={12} alignment="start" style={{ paddingVertical: 10 }}>
      <AppIconTile name={NOTIFICATION_ICONS[notification.type]} size={40} />
      <Column spacing={2}>
        <AppText
          variant={unread ? "label" : "caption"}
          numberOfLines={2}
          onPress={onPress}
        >
          {notificationLabel(notification.type, actorName)}
        </AppText>
        <AppText variant="caption" tone="muted">
          {relativeTime(notification.createdAt)}
        </AppText>
      </Column>
      <Spacer flexible />
      <Row spacing={6} alignment="center">
        {unread ? <AppDot /> : null}
        <AppButton variant="text" label="Suppr." onPress={onDelete} />
      </Row>
    </Row>
  );
}
