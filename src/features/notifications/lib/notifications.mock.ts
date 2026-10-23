import type {
  NotificationCategory,
  NotificationPreferenceView,
  NotificationView,
} from "@/features/notifications/domain/notification";
import type { Page } from "@/shared/types/api";
import { toPage } from "@/shared/utils/page";
import {
  db,
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationUnread,
  removeNotification,
} from "@/mocks/db";
import { assertSuccess, isEmpty, mockDelay } from "@/mocks/scenario";

/** Inbox alimentée par la base de démonstration locale. */
export const notificationsService = {
  async list(params: {
    unreadOnly: boolean;
    page: number;
    size: number;
  }): Promise<Page<NotificationView>> {
    await mockDelay(280);
    assertSuccess();
    if (isEmpty()) return toPage([], params.page, params.size);

    const notifications = [...db.notifications]
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      )
      .filter((notification) =>
        params.unreadOnly ? notification.readAt === null : true,
      );

    return toPage(notifications, params.page, params.size);
  },

  async unreadCount(): Promise<{ count: number }> {
    await mockDelay(180);
    assertSuccess();
    return {
      count: db.notifications.filter(
        (notification) => notification.readAt === null,
      ).length,
    };
  },

  async markRead(notificationId: string): Promise<void> {
    await mockDelay(120);
    assertSuccess();
    markNotificationRead(notificationId);
  },

  async markUnread(notificationId: string): Promise<void> {
    await mockDelay(120);
    assertSuccess();
    markNotificationUnread(notificationId);
  },

  async remove(notificationId: string): Promise<void> {
    await mockDelay(120);
    assertSuccess();
    removeNotification(notificationId);
  },

  async removeAll(): Promise<void> {
    await mockDelay(160);
    assertSuccess();
    db.notifications = [];
  },

  async markAllRead(): Promise<void> {
    await mockDelay(160);
    assertSuccess();
    markAllNotificationsRead();
  },

  async preferences(): Promise<NotificationPreferenceView[]> {
    await mockDelay(180);
    assertSuccess();
    return db.preferences.map((preference) => ({ ...preference }));
  },

  async updatePreference(
    category: NotificationCategory,
    enabled: boolean,
  ): Promise<void> {
    await mockDelay(120);
    assertSuccess();
    db.preferences = db.preferences.map((preference) =>
      preference.category === category
        ? { ...preference, enabled }
        : preference,
    );
  },
};
