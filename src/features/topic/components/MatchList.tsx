import { View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { getUserId } from "@/lib/auth";
import type { Game } from "@/shared/types/domain";

/** Historique des duels (lecture seule). */
export function MatchList({ games }: { games: Game[] }) {
  const userId = getUserId();

  return (
    <Card className="gap-0 p-0">
      {games.map((game, index) => {
        const isPlayer1 = game.player1Id === userId;
        const me = isPlayer1 ? game.player1Score : game.player2Score;
        const them = isPlayer1 ? game.player2Score : game.player1Score;
        const opponent =
          (isPlayer1 ? game.player2Name : game.player1Name) ?? "Adversaire";
        const win = game.winnerId === userId;
        const draw = game.winnerId == null;
        const result = draw ? "N" : win ? "V" : "D";

        return (
          <View
            key={game.gameId}
            className={`flex-row items-center gap-3 px-4 py-3 ${
              index < games.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <View
              className={`h-9 w-9 items-center justify-center rounded-xl ${
                draw
                  ? "bg-muted"
                  : win
                    ? "bg-emerald-500/15"
                    : "bg-destructive/15"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  draw
                    ? "text-muted-foreground"
                    : win
                      ? "text-emerald-500"
                      : "text-destructive"
                }`}
              >
                {result}
              </Text>
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-sm font-semibold" numberOfLines={1}>
                vs {opponent}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {new Date(game.createdAt).toLocaleDateString("fr-FR")}
              </Text>
            </View>
            <Text className="text-sm font-bold tabular-nums">
              {me} – {them}
            </Text>
          </View>
        );
      })}
    </Card>
  );
}
