import { useRouter } from "expo-router";

import {
  AppButton,
  AppText,
  Column,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { NotificationRow } from "@/features/notifications/components/notification-row";
import {
  isUnread,
  notificationIntent,
  type NotificationView,
} from "@/features/notifications/domain/notification";
import {
  useNotifications,
  useUnreadNotificationsCount,
} from "@/features/notifications/hooks/use-notifications";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useSetNotificationRead,
} from "@/features/notifications/hooks/use-notification-mutations";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

export function NotificationsPage() {
  const router = useRouter();
  const notifications = useNotifications();
  const unreadCount = useUnreadNotificationsCount();
  const markAllRead = useMarkAllNotificationsRead();
  const setRead = useSetNotificationRead();
  const remove = useDeleteNotification();

  const refetch = () => {
    void notifications.refetch();
    void unreadCount.refetch();
  };

  if (notifications.isLoading || unreadCount.isLoading) {
    return (
      <Screen>
        <LoadingState label="Chargement des notifications…" />
      </Screen>
    );
  }

  if (notifications.isError || unreadCount.isError) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger les notifications."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const items = notifications.data?.content ?? [];
  const unread = unreadCount.data?.count ?? 0;

  function open(notification: NotificationView) {
    if (isUnread(notification)) {
      setRead.mutate({ notificationId: notification.notificationId, read: true });
    }

    const intent = notificationIntent(notification);
    if (intent?.kind === "player") {
      router.push(`/players/${intent.id}`);
    } else if (intent?.kind === "topic") {
      router.push(`/topics/${intent.id}`);
    }
  }

  return (
    <Screen
      refreshing={notifications.isRefetching || unreadCount.isRefetching}
      onRefresh={refetch}
    >
      <Row spacing={8} alignment="center">
        <AppText variant="body" tone="muted">
          {unread > 0 ? `${unread} notifications non lues` : "Tout est à jour"}
        </AppText>
        <Spacer flexible />
        <AppButton
          variant="text"
          label="Tout lire"
          disabled={unread === 0 || markAllRead.isPending}
          onPress={() => markAllRead.mutate()}
        />
      </Row>

      <Section title="Inbox">
        {items.length === 0 ? (
          <EmptyState
            title="Aucune notification"
            subtitle="Les nouveaux défis et abonnements apparaîtront ici."
          />
        ) : (
          <Column spacing={2}>
            {items.map((notification) => (
              <NotificationRow
                key={notification.notificationId}
                notification={notification}
                onPress={() => open(notification)}
                onDelete={() => remove.mutate(notification.notificationId)}
              />
            ))}
          </Column>
        )}
      </Section>
    </Screen>
  );
}
