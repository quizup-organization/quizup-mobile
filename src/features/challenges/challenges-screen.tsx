import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { normalize } from "@/lib/helpers";
import { ChallengeRow } from "./components/ChallengeRow";
import {
  useChallenges,
  useChallengeActions,
  type ChallengeView,
} from "./hooks/useChallenges";

export function ChallengesScreen() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);

  const received = useChallenges("received");
  const sent = useChallenges("sent");
  const { accept, decline } = useChallengeActions();

  const items = useMemo(() => {
    const merged = [...received.items, ...sent.items].sort(
      (a, b) =>
        new Date(b.challenge.createdAt).getTime() -
        new Date(a.challenge.createdAt).getTime(),
    );
    const needle = normalize(debounced);
    if (!needle) return merged;
    return merged.filter(
      (view: ChallengeView) =>
        normalize(view.otherName).includes(needle) ||
        normalize(view.topic.name).includes(needle),
    );
  }, [received.items, sent.items, debounced]);

  const pending = accept.isPending || decline.isPending;

  return (
    <View className="flex-1 bg-background">
      <View className="border-b border-border p-4">
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Chercher parmi mes défis…"
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={(view) => view.challenge.challengeId}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <ChallengeRow
            view={item}
            pending={pending}
            onAccept={(id) => accept.mutate(id)}
            onDecline={(id) => decline.mutate(id)}
          />
        )}
        ListEmptyComponent={
          <Text className="p-4 text-center text-sm text-muted-foreground">
            {query ? "Aucun défi à cette recherche." : "Aucun défi."}
          </Text>
        }
      />
    </View>
  );
}
