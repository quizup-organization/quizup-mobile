import { View } from "react-native";
import { Spinner, Typography } from "heroui-native";

/** Écran d'attente pendant la restauration de session (cold start / deep link). */
export function BootScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent">
        <Typography type="h4" className="text-accent-foreground">
          Q
        </Typography>
      </View>
      <Typography type="h5">QuizUp</Typography>
      <Spinner size="sm" />
    </View>
  );
}
