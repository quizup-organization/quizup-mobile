import { useEffect } from "react";
import {
  ScrollView,
  Share,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Share2, Zap } from "lucide-react-native";
import {
  Button,
  Card,
  Spinner,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useMe } from "@/features/auth/hooks/useMe";
import { useSessionStore } from "@/features/auth/session-store";
import { topicName } from "@/shared/utils/topic-name";
import { confirmAction } from "@/shared/components/confirm-dialog";
import { showToast } from "@/lib/toast";
import { useNow } from "@/shared/hooks/useNow";
import { UserAvatar } from "@/shared/components/user-avatar";
import { CountdownText } from "@/shared/components/countdown-text";
import { RoomStepper } from "./components/room-stepper";
import {
  useCancelRoom,
  useLeaveRoom,
  useRoom,
  useRoomJoin,
  useRoomWizzNotifications,
  useWizzRoom,
} from "./hooks/useRoom";
import type { RoomStatus } from "@/shared/types/bff";

const STATUS_LABEL: Record<RoomStatus, string> = {
  WAITING_PLAYERS: "En attente des joueurs",
  FETCHING_PLAYERS: "Chargement des profils",
  FETCHING_PLAYED_QUESTIONS: "Historique des questions",
  FETCHING_QUESTIONS: "Sélection des questions",
  CREATING_GAME: "Création de la partie",
  GAME_CREATED: "Lancement du duel",
  COMPLETED: "Partie terminée",
  CANCELLED: "Salle fermée",
  EXPIRED: "Salle expirée",
  FAILED: "Préparation échouée",
};

export function RoomScreen() {
  const { roomId = "" } = useLocalSearchParams<{ roomId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const roomQuery = useRoom(roomId);
  const cancel = useCancelRoom(roomId);
  const leave = useLeaveRoom(roomId);
  const wizz = useWizzRoom(roomId);
  const now = useNow(1000);
  const [background] = useThemeColor(["background"]);
  const setPendingRoomId = useSessionStore((state) => state.setPendingRoomId);

  useRoomJoin(roomId);
  useRoomWizzNotifications(roomId, me.data?.userId ?? null);

  useEffect(() => {
    setPendingRoomId(null);
  }, [setPendingRoomId]);

  useEffect(() => {
    if (roomQuery.data?.gameId) {
      router.replace(`/(app)/duel/${roomQuery.data.gameId}`);
    }
  }, [roomQuery.data?.gameId, router]);

  if (roomQuery.isPending) {
    return (
      <View
        className="flex-1 items-center justify-center gap-3"
        style={{ backgroundColor: background }}
      >
        <Spinner />
        <Typography type="body-sm" color="muted">
          Préparation de la salle…
        </Typography>
      </View>
    );
  }

  if (!roomQuery.data) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 px-6"
        style={{ backgroundColor: background }}
      >
        <Typography type="h5">Salle introuvable</Typography>
        <Button variant="secondary" onPress={() => router.back()}>
          Retour
        </Button>
      </View>
    );
  }

  const room = roomQuery.data;
  const topic = room.topic;
  const language = me.data?.language ?? "fr";
  const isInitiator = room.canCancel;
  const myPresent = isInitiator
    ? room.initiatorPresent
    : room.participantPresent;
  const opponentPresent = isInitiator
    ? room.participantPresent
    : room.initiatorPresent;
  const opponentName = room.vsBot
    ? "Bot"
    : (room.opponent?.pseudonym ?? "En attente d'un joueur");
  const cooldown = Math.max(
    0,
    Math.ceil((wizz.cooldownUntil - now) / 1000),
  );
  const canWizz =
    !room.vsBot &&
    room.opponent !== null &&
    room.status === "WAITING_PLAYERS" &&
    myPresent &&
    !opponentPresent;
  const terminal =
    room.status === "CANCELLED" ||
    room.status === "EXPIRED" ||
    room.status === "FAILED";

  const shareRoom = async () => {
    const webUrl = `https://quizup.cnadjim.fr/join/${room.roomId}`;
    const appUrl = `quizup://join/${room.roomId}`;
    try {
      await Share.share({
        message: `Rejoins mon duel QuizUp : ${webUrl}\nDans l'app : ${appUrl}`,
      });
    } catch {
      showToast({
        title: "Partage indisponible",
        description: `Salle : ${room.roomId}`,
        tone: "danger",
      });
    }
  };

  const closeRoom = () => {
    confirmAction({
      title: room.vsBot ? "Annuler le duel ?" : "Fermer la salle ?",
      message: "La salle sera fermée pour tous les joueurs.",
      confirmLabel: "Fermer",
      destructive: true,
      onConfirm: () => {
        cancel.mutate(undefined, {
          onSuccess: () =>
            router.replace(`/(app)/topic/${topic.topicId}`),
        });
      },
    });
  };

  const leaveRoom = () => {
    leave.mutate(undefined, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: background }}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 40,
        gap: 16,
      }}
    >
      <View className="flex-row items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onPress={() => router.back()}
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={20} color="#A0A0A0" />
        </Button>
        <View className="flex-1">
          <Typography type="h3">Salon</Typography>
          <Typography type="body-xs" color="muted">
            {STATUS_LABEL[room.status]}
          </Typography>
        </View>
        <CountdownText deadline={room.expiresAt} />
      </View>

      <Card className="overflow-hidden p-0">
        <View
          className="h-28 w-full items-center justify-center"
          style={{ backgroundColor: topic.color ?? "#1447E6" }}
        >
          {topic.imageUrl ? (
            <Image
              source={{ uri: topic.imageUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={150}
            />
          ) : (
            <Typography type="h1">{topic.emoji?.trim() || "❓"}</Typography>
          )}
        </View>
        <Card.Body className="p-4">
          <Typography type="h5">{topicName(topic.names, language)}</Typography>
          <Typography type="body-sm" color="muted">
            {room.vsBot
              ? "Entraînement contre un bot"
              : "Duel entre joueurs"}
          </Typography>
        </Card.Body>
      </Card>

      <RoomStepper status={room.status} />

      {terminal ? (
        <Card>
          <Card.Body className="items-center gap-3 py-8">
            <Typography type="h5">{STATUS_LABEL[room.status]}</Typography>
            <Typography type="body-sm" color="muted" align="center">
              Cette salle n'est plus disponible.
            </Typography>
            <Button
              variant="secondary"
              onPress={() =>
                router.replace(`/(app)/topic/${topic.topicId}`)
              }
            >
              Retour au sujet
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card>
            <Card.Body className="gap-4">
              <View className="flex-row items-center gap-3">
                <UserAvatar
                  name={me.data?.pseudonym ?? "Toi"}
                  size="md"
                />
                <View className="min-w-0 flex-1">
                  <Typography type="body-sm" weight="semibold">
                    {me.data?.pseudonym ?? "Toi"}
                  </Typography>
                  <Typography type="body-xs" color="muted">
                    {myPresent ? "Présent" : "Connexion…"}
                  </Typography>
                </View>
                <View
                  className={
                    myPresent
                      ? "h-2.5 w-2.5 rounded-full bg-success"
                      : "h-2.5 w-2.5 rounded-full bg-muted"
                  }
                />
              </View>

              <View className="flex-row items-center gap-3 border-t border-separator pt-4">
                <UserAvatar
                  name={room.opponent || room.vsBot ? opponentName : "?"}
                  size="md"
                />
                <View className="min-w-0 flex-1">
                  <Typography type="body-sm" weight="semibold">
                    {opponentName}
                  </Typography>
                  <Typography type="body-xs" color="muted">
                    {opponentPresent
                      ? "Présent"
                      : room.vsBot
                        ? "Prêt"
                        : "En attente"}
                  </Typography>
                </View>
                <View
                  className={
                    opponentPresent || room.vsBot
                      ? "h-2.5 w-2.5 rounded-full bg-success"
                      : "h-2.5 w-2.5 rounded-full bg-muted"
                  }
                />
              </View>
            </Card.Body>
          </Card>

          {room.status === "WAITING_PLAYERS" && !room.vsBot ? (
            <Button variant="secondary" onPress={() => void shareRoom()}>
              <Share2 size={16} color="#A0A0A0" />
              <Button.Label>Partager la salle</Button.Label>
            </Button>
          ) : null}

          {canWizz ? (
            <Button
              isDisabled={wizz.pending || cooldown > 0}
              onPress={wizz.send}
            >
              <Zap size={16} color="#EFF6FF" />
              <Button.Label>
                {cooldown > 0
                  ? `Relancer dans ${cooldown} s`
                  : `Relancer ${opponentName}`}
              </Button.Label>
            </Button>
          ) : null}

          {isInitiator ? (
            <Button
              variant="danger-soft"
              isDisabled={cancel.isPending}
              onPress={closeRoom}
            >
              {room.vsBot ? "Annuler le duel" : "Fermer la salle"}
            </Button>
          ) : null}

          {room.status === "WAITING_PLAYERS" && myPresent && !room.vsBot ? (
            <Button
              variant="outline"
              isDisabled={leave.isPending}
              onPress={leaveRoom}
            >
              Quitter la salle
            </Button>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}
