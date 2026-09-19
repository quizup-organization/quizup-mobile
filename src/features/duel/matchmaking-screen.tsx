import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  useCancelMatchmaking,
  useMatchmakingTicket,
} from "./hooks/useMatchmaking";

/** Écran de recherche d'adversaire (duel humain) — polling du ticket. */
export function MatchmakingScreen() {
  const { ticketId = "" } = useLocalSearchParams<{ ticketId: string }>();
  const router = useRouter();
  const ticket = useMatchmakingTicket(ticketId);
  const cancel = useCancelMatchmaking(ticketId);

  const matched = ticket.data?.status === "MATCHED" && ticket.data.gameId;

  useEffect(() => {
    if (matched && ticket.data?.gameId) {
      router.replace(`/(app)/duel/${ticket.data.gameId}`);
    }
  }, [matched, ticket.data?.gameId, router]);

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <ActivityIndicator />
      <Text className="text-lg font-semibold">Recherche d'un adversaire…</Text>
      <Button
        variant="outline"
        label="Annuler"
        disabled={cancel.isPending}
        onPress={() => cancel.mutate()}
      />
    </View>
  );
}
