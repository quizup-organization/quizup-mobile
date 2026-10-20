import { View } from "react-native";
import { useThemeColor } from "heroui-native";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
}

/** Petite barre de progression (HeroUI Native n'expose pas de Progress). */
export function ProgressBar({ value, className }: ProgressBarProps) {
  const [track, indicator] = useThemeColor(["default", "accent"]);
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <View
      className={cn("h-2 w-full overflow-hidden rounded-full", className)}
      style={{ backgroundColor: track }}
    >
      <View
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: indicator }}
      />
    </View>
  );
}
