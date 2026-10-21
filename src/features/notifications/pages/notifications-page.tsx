import {
  AppButton,
  AppSwitch,
  AppText,
  Column,
  PageHeader,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import type { NotificationCategory } from "@/features/notifications/domain/notification";
import { isUnread } from "@/features/notifications/domain/notification";
import { NotificationRow } from "@/features/notifications/components/notification-row";
import {
  useNotifications,
  useNotificationPreferences,
  useUnreadNotificationsCount,
} from "@/features/notifications/hooks/use-notifications";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useSetNotificationRead,
  useUpdateNotificationPreference,
} from "@/features/notifications/hooks/use-notification-mutations";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

const PREFERENCE_LABELS: Record<NotificationCategory, string> = {
  FOLLOW: "Abonnements",
  ROOM: "Salles et défis",
  QUESTION: "Questions",
  ACCOUNT: "Compte",
};

export function NotificationsPage() {
  const notifications = useNotifications();
  const unreadCount = useUnreadNotificationsCount();
  const preferences = useNotificationPreferences();
  const markAllRead = useMarkAllNotificationsRead();
  const setRead = useSetNotificationRead();
  const remove = useDeleteNotification();
  const updatePreference = useUpdateNotificationPreference();

  const refetch = () => {
    void notifications.refetch();
    void unreadCount.refetch();
    void preferences.refetch();
  };

  if (
    notifications.isLoading ||
    unreadCount.isLoading ||
    preferences.isLoading
  ) {
    return (
      <Screen tabBar>
        <LoadingState label="Chargement des notifications…" />
      </Screen>
    );
  }

  if (notifications.isError || unreadCount.isError || preferences.isError) {
    return (
      <Screen tabBar>
        <ErrorState
          message="Impossible de charger les notifications."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const items = notifications.data?.content ?? [];
  const unread = unreadCount.data?.count ?? 0;

  return (
    <Screen
      tabBar
      refreshing={
        notifications.isRefetching ||
        unreadCount.isRefetching ||
        preferences.isRefetching
      }
      onRefresh={refetch}
    >
      <PageHeader
        title="Alertes"
        subtitle={
          unread > 0 ? `${unread} notifications non lues` : "Tout est à jour"
        }
      />

      <Row spacing={8} alignment="center">
        <AppButton
          variant="outlined"
          label="Tout marquer lu"
          disabled={unread === 0 || markAllRead.isPending}
          onPress={() => markAllRead.mutate()}
        />
        <Spacer flexible />
      </Row>

      <Section title="Inbox">
        {items.length === 0 ? (
          <EmptyState
            title="Aucune notification"
            subtitle="Les nouveaux défis et abonnements apparaîtront ici."
          />
        ) : (
          <Column spacing={2}>
            {items.map((notification) => {
              const read = !isUnread(notification);
              return (
                <NotificationRow
                  key={notification.notificationId}
                  notification={notification}
                  onPress={() =>
                    setRead.mutate({
                      notificationId: notification.notificationId,
                      read: !read,
                    })
                  }
                  onDelete={() =>
                    remove.mutate(notification.notificationId)
                  }
                />
              );
            })}
          </Column>
        )}
      </Section>

      <Section title="Préférences">
        <Column spacing={2}>
          {(preferences.data ?? []).map((preference) => (
            <Row
              key={preference.category}
              spacing={12}
              alignment="center"
              style={{ paddingVertical: 8 }}
            >
              <AppText variant="label">
                {PREFERENCE_LABELS[preference.category]}
              </AppText>
              <Spacer flexible />
              <AppSwitch
                value={preference.enabled}
                disabled={updatePreference.isPending}
                onValueChange={(enabled) =>
                  updatePreference.mutate({
                    category: preference.category,
                    enabled,
                  })
                }
              />
            </Row>
          ))}
        </Column>
      </Section>
    </Screen>
  );
}
