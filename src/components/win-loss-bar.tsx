import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface WinLossBarProps {
  wins: number;
  draws: number;
  losses: number;
}

/** Barre de résultats V / N / D. */
export function WinLossBar({ wins, draws, losses }: WinLossBarProps) {
  const total = Math.max(1, wins + draws + losses);
  const pct = (n: number) => Math.round((n / total) * 100);

  return (
    <View className="gap-2">
      <View className="h-2.5 flex-row overflow-hidden rounded-full bg-muted">
        <View style={{ width: `${pct(wins)}%`, backgroundColor: "#10b981" }} />
        <View style={{ width: `${pct(draws)}%`, backgroundColor: "#f59e0b" }} />
        <View className="bg-destructive" style={{ width: `${pct(losses)}%` }} />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-xs font-semibold text-emerald-500">
          Victoires {pct(wins)}%
        </Text>
        <Text className="text-xs font-semibold text-amber-500">Nuls {pct(draws)}%</Text>
        <Text className="text-xs font-semibold text-destructive">
          Défaites {pct(losses)}%
        </Text>
      </View>
    </View>
  );
}
