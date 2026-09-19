import { View } from "react-native";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Avatar } from "@/components/ui/avatar";
import { StatStrip } from "@/components/stat-strip";
import { WinLossBar } from "@/components/win-loss-bar";
import { useCurrentPlayer } from "./use-current-player";
import { titleForLevel } from "@/shared/utils/level";
import { clearSession } from "@/lib/auth";
import { useSessionStore } from "@/features/auth/session-store";
import { useRouter } from "expo-router";

export function ProfileScreen() {
  const router = useRouter();
  const { profile, progression, isLoading } = useCurrentPlayer();
  const setSession = useSessionStore((s) => s.setSession);

  if (isLoading) {
    return (
      <Screen>
        <Text className="text-sm text-muted-foreground">Chargement…</Text>
      </Screen>
    );
  }

  const name = profile?.displayName ?? "Joueur";
  const level = progression?.level ?? 1;
  const duel = progression?.duelStats;
  const played = duel?.played ?? 0;
  const wins = duel?.wins ?? 0;
  const losses = duel?.losses ?? 0;
  const draws = Math.max(0, played - wins - losses);

  return (
    <Screen>
      <View className="items-center gap-3">
        <Avatar name={name} size={84} />
        <View className="items-center">
          <Text className="text-2xl font-extrabold">{name}</Text>
          <Text className="text-sm text-muted-foreground">
            {titleForLevel(level)} · Niveau {level}
            {profile?.country ? ` · ${profile.country}` : ""}
          </Text>
        </View>
      </View>

      <StatStrip
        className="mt-5 border-t border-border pt-2"
        items={[
          { label: "Parties", value: played },
          { label: "Victoires", value: wins },
          { label: "Défaites", value: losses },
        ]}
      />

      <View className="mt-6 gap-3">
        <Text className="text-base font-semibold">Statistiques</Text>
        <Card>
          <WinLossBar wins={wins} draws={draws} losses={losses} />
        </Card>
      </View>

      <Button
        className="mt-8"
        variant="secondary"
        label="Réglages"
        onPress={() => router.push("/(app)/settings")}
      />

      <Button
        className="mt-3"
        variant="outline"
        label="Se déconnecter"
        onPress={async () => {
          await clearSession();
          setSession(false);
          router.replace("/(auth)/login");
        }}
      />
    </Screen>
  );
}
