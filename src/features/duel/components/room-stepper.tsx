import { View } from "react-native";
import { Typography, useThemeColor } from "heroui-native";
import type { RoomStatus } from "@/shared/types/bff";
import { cn } from "@/lib/utils";

const STEPS = ["Joueurs", "Profils", "Questions", "Lancement"];

function stepIndex(status: RoomStatus): number {
  switch (status) {
    case "WAITING_PLAYERS":
      return 0;
    case "FETCHING_PLAYERS":
      return 1;
    case "FETCHING_PLAYED_QUESTIONS":
    case "FETCHING_QUESTIONS":
      return 2;
    case "CREATING_GAME":
    case "GAME_CREATED":
      return 3;
    case "COMPLETED":
      return 4;
    default:
      return 0;
  }
}

/** Progression de la préparation d'une salle. */
export function RoomStepper({ status }: { status: RoomStatus }) {
  const [accent, track] = useThemeColor(["accent", "default"]);
  const active = stepIndex(status);

  return (
    <View className="gap-2">
      <View className="flex-row items-center">
        {STEPS.map((label, index) => {
          const done = index < active;
          const current = index === active;
          return (
            <View key={label} className="flex-1 flex-row items-center">
              <View
                className={cn(
                  "h-7 w-7 items-center justify-center rounded-full",
                  done || current ? "bg-accent" : "bg-default",
                )}
                style={{
                  backgroundColor: done || current ? accent : track,
                }}
              >
                <Typography type="body-xs" weight="bold">
                  {done ? "✓" : index + 1}
                </Typography>
              </View>
              {index < STEPS.length - 1 ? (
                <View
                  className="h-0.5 flex-1"
                  style={{ backgroundColor: done ? accent : track }}
                />
              ) : null}
            </View>
          );
        })}
      </View>
      <View className="flex-row">
        {STEPS.map((label, index) => (
          <Typography
            key={label}
            type="body-xs"
            color={index <= active ? "default" : "muted"}
            className="flex-1 text-center"
          >
            {label}
          </Typography>
        ))}
      </View>
    </View>
  );
}
