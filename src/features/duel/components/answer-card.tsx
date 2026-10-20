import { View } from "react-native";
import { Card, PressableFeedback, Typography } from "heroui-native";
import { cn } from "@/lib/utils";

export type AnswerState =
  | "idle"
  | "selected"
  | "correct"
  | "wrong"
  | "disabled";

interface AnswerCardProps {
  choice: string;
  label: string;
  state: AnswerState;
  onPress: () => void;
}

/** Carte de réponse 2×2 de l'arène. */
export function AnswerCard({
  choice,
  label,
  state,
  onPress,
}: AnswerCardProps) {
  const disabled = state === "disabled";

  return (
    <PressableFeedback
      accessibilityRole="button"
      accessibilityState={{ selected: state === "selected", disabled }}
      isDisabled={disabled}
      onPress={onPress}
      className={cn("w-[48%]", disabled && "opacity-50")}
    >
      <Card
        className={cn(
          "min-h-20",
          state === "correct" && "border-success",
          state === "wrong" && "border-danger",
          state === "selected" && "border-accent",
        )}
      >
        <Card.Body className="flex-row items-center gap-2 p-3">
          <View
            className={cn(
              "h-7 w-7 items-center justify-center rounded-full",
              state === "correct"
                ? "bg-success"
                : state === "wrong"
                  ? "bg-danger"
                  : state === "selected"
                    ? "bg-accent"
                    : "bg-default",
            )}
          >
            <Typography type="body-xs" weight="bold">
              {choice}
            </Typography>
          </View>
          <Typography type="body-sm" className="flex-1" numberOfLines={3}>
            {label}
          </Typography>
        </Card.Body>
      </Card>
    </PressableFeedback>
  );
}
