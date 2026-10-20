import { useEffect, useState, type ReactNode } from "react";
import { View } from "react-native";
import { Bot, Globe2, Users } from "lucide-react-native";
import {
  BottomSheet,
  Button,
  Card,
  Chip,
  PressableFeedback,
  Typography,
} from "heroui-native";
import type { BotDifficulty } from "@/shared/types/bff";
import {
  useCreateRoom,
  useStartBotRoom,
} from "../hooks/useRoom";
import { useStartMatchmaking } from "../hooks/useMatchmaking";

type PlayMode = "bot" | "world" | "private";

const DIFFICULTIES: { value: BotDifficulty; label: string }[] = [
  { value: "EASY", label: "Facile" },
  { value: "NORMAL", label: "Normal" },
  { value: "HARD", label: "Difficile" },
];

function ModeRow({
  selected,
  title,
  description,
  icon,
  onPress,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  onPress: () => void;
}) {
  return (
    <PressableFeedback
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      className="rounded-2xl"
    >
      <Card className={selected ? "border-accent" : undefined}>
        <Card.Body className="flex-row items-center gap-3 p-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-default">
            {icon}
          </View>
          <View className="min-w-0 flex-1">
            <Typography type="body-sm" weight="semibold">
              {title}
            </Typography>
            <Typography type="body-xs" color="muted">
              {description}
            </Typography>
          </View>
          <View
            className={
              selected
                ? "h-4 w-4 rounded-full border-2 border-accent bg-accent"
                : "h-4 w-4 rounded-full border-2 border-border"
            }
          />
        </Card.Body>
      </Card>
    </PressableFeedback>
  );
}

interface PlayModeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
  topicName: string;
}

/** Feuille de lancement : entraînement bot, appariement public ou salle privée. */
export function PlayModeSheet({
  open,
  onOpenChange,
  topicId,
  topicName,
}: PlayModeSheetProps) {
  const [mode, setMode] = useState<PlayMode>("bot");
  const [difficulty, setDifficulty] = useState<BotDifficulty>("NORMAL");
  const startBot = useStartBotRoom();
  const startMatchmaking = useStartMatchmaking();
  const createRoom = useCreateRoom();

  useEffect(() => {
    if (open) {
      setMode("bot");
      setDifficulty("NORMAL");
    }
  }, [open]);

  const pending =
    startBot.isPending || startMatchmaking.isPending || createRoom.isPending;
  const error =
    startBot.error ?? startMatchmaking.error ?? createRoom.error;

  const start = () => {
    if (mode === "bot") {
      startBot.mutate(
        { topicId, difficulty },
        { onSuccess: () => onOpenChange(false) },
      );
    } else if (mode === "world") {
      startMatchmaking.mutate(topicId, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createRoom.mutate(topicId, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const label =
    mode === "bot"
      ? "Lancer l'entraînement"
      : mode === "world"
        ? "Chercher un adversaire"
        : "Créer la salle privée";

  return (
    <BottomSheet isOpen={open} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <BottomSheet.Close
            size="sm"
            className="absolute right-3 top-3 z-10"
          />
          <BottomSheet.Title>Lancer un duel</BottomSheet.Title>
          <BottomSheet.Description>{topicName}</BottomSheet.Description>

          <View className="mt-6 gap-3">
            <ModeRow
              selected={mode === "bot"}
              title="S'entraîner contre un bot"
              description="Aucune XP, aucun classement"
              icon={<Bot size={20} color="#1447E6" />}
              onPress={() => setMode("bot")}
            />
            <ModeRow
              selected={mode === "world"}
              title="Défier le monde"
              description="Recherche d'un adversaire en 10 s"
              icon={<Globe2 size={20} color="#1447E6" />}
              onPress={() => setMode("world")}
            />
            <ModeRow
              selected={mode === "private"}
              title="Créer une salle privée"
              description="Partage un lien à un ami"
              icon={<Users size={20} color="#1447E6" />}
              onPress={() => setMode("private")}
            />
          </View>

          {mode === "bot" ? (
            <View className="mt-5 gap-2">
              <Typography type="body-sm" weight="semibold">
                Difficulté
              </Typography>
              <View className="flex-row gap-2">
                {DIFFICULTIES.map((option) => (
                  <Chip
                    key={option.value}
                    variant={
                      difficulty === option.value ? "primary" : "secondary"
                    }
                    onPress={() => setDifficulty(option.value)}
                  >
                    <Chip.Label>{option.label}</Chip.Label>
                  </Chip>
                ))}
              </View>
            </View>
          ) : null}

          {error ? (
            <Typography type="body-sm" className="mt-4 text-danger">
              Impossible de lancer le duel. Réessaie.
            </Typography>
          ) : null}

          <Button className="mt-6" isDisabled={pending} onPress={start}>
            {pending ? "Préparation…" : label}
          </Button>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
