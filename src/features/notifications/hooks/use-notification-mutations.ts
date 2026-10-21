import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationsService } from "@/features/notifications/lib/notifications";
import { queryKeys } from "@/lib/query-keys";

function useInvalidateInbox() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
}

export function useSetNotificationRead() {
  const invalidate = useInvalidateInbox();
  return useMutation({
    mutationFn: ({
      notificationId,
      read,
    }: {
      notificationId: string;
      read: boolean;
    }) =>
      read
        ? notificationsService.markRead(notificationId)
        : notificationsService.markUnread(notificationId),
    onSuccess: invalidate,
  });
}

export function useDeleteNotification() {
  const invalidate = useInvalidateInbox();
  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsService.remove(notificationId),
    onSuccess: invalidate,
  });
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateInbox();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: invalidate,
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      category,
      enabled,
    }: {
      category: Parameters<typeof notificationsService.updatePreference>[0];
      enabled: boolean;
    }) => notificationsService.updatePreference(category, enabled),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.preferences(),
      }),
  });
}
