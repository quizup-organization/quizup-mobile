import { useEffect, useRef, useState } from "react";
import { Platform, Vibration } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { queryKeys } from "@/lib/query-keys";
import { roomsService } from "@/lib/services/rooms";
import { showToast } from "@/lib/toast";
import type { EventEnvelope, RoomNotification } from "@/shared/types/notifications";

/** Salle : polling court de la vue serveur (statut, présences, adversaire, gameId). */
export function useRoom(roomId: string) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(roomId),
    queryFn: () => roomsService.get(roomId),
    enabled: !!roomId,
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const terminal =
        status === "COMPLETED" ||
        status === "CANCELLED" ||
        status === "EXPIRED" ||
        status === "FAILED";
      return terminal ? false : 1000;
    },
    retry: (failureCount, error) => {
      const status = (error as { statusCode?: number }).statusCode;
      return status === 404 ? failureCount < 12 : failureCount < 2;
    },
    retryDelay: 400,
  });
}

/** Apparition client-driven (idempotente), avec retry tant que la salle est en cours de création. */
export function useRoomJoin(roomId: string): void {
  const joined = useRef(false);

  useEffect(() => {
    if (!roomId || joined.current) return;
    joined.current = true;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const join = (attempt: number) => {
      void roomsService.join(roomId).catch(() => {
        if (!cancelled && attempt < 10) {
          timer = setTimeout(() => join(attempt + 1), 400);
        }
      });
    };
    join(0);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [roomId]);
}

export function useStartBotRoom() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      topicId,
      difficulty,
    }: {
      topicId: string;
      difficulty: "EASY" | "NORMAL" | "HARD";
    }) => roomsService.createBot(topicId, difficulty),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.mine() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.games.active() });
      router.push(`/(app)/room/${created.id}`);
    },
  });
}

export function useCreateRoom() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (topicId: string) => roomsService.create(topicId),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.mine() });
      router.push(`/(app)/room/${created.id}`);
    },
  });
}

export function useCancelRoom(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => roomsService.cancel(roomId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.mine() });
    },
  });
}

export function useLeaveRoom(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => roomsService.leave(roomId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.mine() });
    },
  });
}

/** Relance : cadence serveur 10 s ; le bouton est grisé localement après l'envoi. */
export function useWizzRoom(roomId: string) {
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const mutation = useMutation({
    mutationFn: () => roomsService.wizz(roomId),
    onSuccess: () => {
      setCooldownUntil(Date.now() + 10_000);
      showToast({ title: "Relance envoyée", tone: "success" });
    },
    onError: () => {
      showToast({
        title: "Relance impossible",
        description: "Attends un peu avant de relancer ton adversaire.",
        tone: "danger",
      });
    },
  });

  return {
    send: () => mutation.mutate(),
    pending: mutation.isPending,
    cooldownUntil,
  };
}

/**
 * Relances reçues (pur temps réel) : on surveille l'historique REST pour faire vibrer/toaster
 * quand l'adversaire relance. La cadence et l'envoi restent côté serveur.
 */
export function useRoomWizzNotifications(roomId: string, meId: string | null) {
  const lastSequence = useRef<number | null>(null);
  const query = useQuery({
    queryKey: queryKeys.rooms.notifications(roomId),
    queryFn: () => roomsService.notifications(roomId),
    enabled: !!roomId && !!meId,
    staleTime: 0,
    refetchInterval: 1500,
    retry: false,
  });

  useEffect(() => {
    const envelopes = query.data;
    if (!envelopes) return;
    const sorted = [...envelopes].sort(
      (left, right) => left.sequenceNumber - right.sequenceNumber,
    );
    const latest = sorted[sorted.length - 1]?.sequenceNumber ?? 0;
    if (lastSequence.current === null) {
      lastSequence.current = latest;
      return;
    }
    const fresh = sorted.filter(
      (envelope) =>
        envelope.sequenceNumber > (lastSequence.current ?? 0) &&
        envelope.payload.type === "ROOM_WIZZED" &&
        envelope.payload.playerId !== meId,
    );
    lastSequence.current = latest;
    if (fresh.length > 0) {
      if (Platform.OS !== "web") Vibration.vibrate(300);
      showToast({
        title: "Ton adversaire t'attend",
        description: "Il vient de te relancer.",
        tone: "default",
      });
    }
  }, [meId, query.data]);

  return {
    events: query.data as EventEnvelope<RoomNotification>[] | undefined,
  };
}
