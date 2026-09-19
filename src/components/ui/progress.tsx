import { View } from "react-native";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

/** Barre de progression simple (0-100). */
export function Progress({ value, className }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <View className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
    </View>
  );
}
