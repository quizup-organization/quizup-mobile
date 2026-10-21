import { useQuery } from "@tanstack/react-query";

import { notificationsService } from "@/features/notifications/lib/notifications";
import { queryKeys } from "@/lib/query-keys";

const INBOX_STALE_MS = 15_000;

export interface NotificationListParams {
  unreadOnly?: boolean;
  page?: number;
  size?: number;
}

export function useNotifications(params: NotificationListParams = {}) {
  const resolved = {
    unreadOnly: params.unreadOnly ?? false,
    page: params.page ?? 0,
    size: params.size ?? 20,
  };

  return useQuery({
    queryKey: queryKeys.notifications.list(resolved),
    queryFn: () => notificationsService.list(resolved),
    staleTime: INBOX_STALE_MS,
    refetchInterval: INBOX_STALE_MS,
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => notificationsService.unreadCount(),
    staleTime: INBOX_STALE_MS,
    refetchInterval: INBOX_STALE_MS,
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: queryKeys.notifications.preferences(),
    queryFn: () => notificationsService.preferences(),
    staleTime: 30_000,
  });
}
