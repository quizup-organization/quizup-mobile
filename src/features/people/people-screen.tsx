import { useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { normalize } from "@/lib/helpers";
import { PersonCard } from "./components/PersonCard";
import { usePeople, type PeopleDirection } from "./hooks/usePeople";

export function PeopleScreen() {
  const router = useRouter();
  const [direction, setDirection] = useState<PeopleDirection>("following");
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);

  const following = usePeople("following");
  const followers = usePeople("followers");
  const active = direction === "following" ? following : followers;

  const people = useMemo(() => {
    const needle = normalize(debounced);
    if (!needle) return active.people;
    return active.people.filter((p) => normalize(p.displayName).includes(needle));
  }, [active.people, debounced]);

  return (
    <View className="flex-1 bg-background">
      <View className="gap-3 border-b border-border p-4">
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Chercher une personne…"
        />
        <View className="flex-row gap-2">
          {(["following", "followers"] as const).map((value) => {
            const activeTab = direction === value;
            const count =
              value === "following"
                ? following.people.length
                : followers.people.length;
            return (
              <Pressable
                key={value}
                onPress={() => setDirection(value)}
                className={`rounded-full border px-3 py-1.5 ${
                  activeTab ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                <Text className="text-xs font-semibold">
                  {value === "following" ? "Abonnements" : "Abonnés"} ({count})
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={people}
        keyExtractor={(person) => person.userId}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <PersonCard
            person={item}
            onOpen={(userId) => router.push(`/(app)/player/${userId}`)}
          />
        )}
        ListEmptyComponent={
          <Text className="p-4 text-center text-sm text-muted-foreground">
            {direction === "following"
              ? "Tu ne suis encore personne."
              : "Personne ne te suit encore."}
          </Text>
        }
      />
    </View>
  );
}
