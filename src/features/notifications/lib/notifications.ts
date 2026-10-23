import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { isMockData } from "@/lib/config";
import type { Page } from "@/shared/types/api";
import type {
  NotificationCategory,
  NotificationPreferenceView,
  NotificationView,
} from "../domain/notification";
import { notificationsService as mockNotificationsService } from "./notifications.mock";

const apiNotificationsService = {
  list: (params: {
    unreadOnly: boolean;
    page: number;
    size: number;
  }): Promise<Page<NotificationView>> =>
    api.get<Page<NotificationView>>(ENDPOINTS.notifications.list, {
      params: {
        unreadOnly: params.unreadOnly,
        page: params.page,
        size: params.size,
      },
    }),

  unreadCount: (): Promise<{ count: number }> =>
    api.get<{ count: number }>(ENDPOINTS.notifications.unreadCount),

  markRead: (notificationId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.notifications.read(notificationId)),

  markUnread: (notificationId: string): Promise<void> =>
    api.post<void>(ENDPOINTS.notifications.unread(notificationId)),

  remove: (notificationId: string): Promise<void> =>
    api.delete<void>(ENDPOINTS.notifications.remove(notificationId)),

  removeAll: (): Promise<void> =>
    api.delete<void>(ENDPOINTS.notifications.removeAll),

  markAllRead: (): Promise<void> =>
    api.post<void>(ENDPOINTS.notifications.readAll),

  preferences: (): Promise<NotificationPreferenceView[]> =>
    api.get<NotificationPreferenceView[]>(ENDPOINTS.notifications.preferences),

  updatePreference: (
    category: NotificationCategory,
    enabled: boolean,
  ): Promise<void> =>
    api.put<void>(ENDPOINTS.notifications.preference(category), { enabled }),
};

/** Inbox via le BFF, ou base de démonstration locale. */
export const notificationsService = isMockData
  ? mockNotificationsService
  : apiNotificationsService;
