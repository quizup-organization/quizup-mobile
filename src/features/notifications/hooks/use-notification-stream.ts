import { useQueryClient } from "@tanstack/react-query";

import type { NotificationEnvelope } from "@/features/notifications/domain/notification";
import { useStompSubscription } from "@/shared/hooks/use-stomp-subscription";
import { queryKeys } from "@/lib/query-keys";

const DELETED_EVENT_TYPE = "NOTIFICATION_DELETED";

/**
 * Flux temps réel de l'inbox (`/topic/notifications/{userId}`) et des vues qui en
 * dépendent (défis, salons, partie active). Le polling REST reste le filet de
 * rattrapage après une déconnexion.
 */
export function useNotificationStream(userId: string | null | undefined): void {
  const queryClient = useQueryClient();

  const invalidateDependentViews = () => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.notifications.all,
    });
    void queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.games.active() });
  };

  useStompSubscription(
    "notifications",
    userId ? `/topic/notifications/${userId}` : null,
    (message) => {
      let envelope: NotificationEnvelope;
      try {
        envelope = JSON.parse(message.body) as NotificationEnvelope;
      } catch {
        return;
      }

      if (envelope.eventType === DELETED_EVENT_TYPE) {
        invalidateDependentViews();
        return;
      }

      const payload = envelope.payload;
      invalidateDependentViews();
      if (
        payload &&
        "type" in payload &&
        (payload.type === "QUESTION_REPORTED" ||
          payload.type === "TOPIC_DRAFTED") &&
        payload.topicId
      ) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.topics.overview(payload.topicId),
        });
      }
    },
    invalidateDependentViews,
  );
}
