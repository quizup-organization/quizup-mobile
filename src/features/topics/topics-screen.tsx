import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/screen";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/topic-card";
import { toTopicView } from "@/lib/services/topics";
import { categoryColor } from "@/shared/utils/categories";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  PAGE_SIZE,
  useTopicFilterStore,
} from "@/features/topics/stores/useTopicFilterStore";
import {
  useFollowedTopicIds,
  useTopicCategories,
  useTopicFacetCounts,
  useTopicSearch,
} from "@/features/topics/hooks/useTopics";

export function TopicsScreen() {
  const router = useRouter();
  const store = useTopicFilterStore();
  const [visiblePages, setVisiblePages] = useState(1);
  const debounced = useDebounce(store.q, 300);
  const { data: followedIds = [] } = useFollowedTopicIds();

  const query = useTopicSearch({
    query: debounced,
    categories: store.categories,
    sort: store.sort,
    followedOnly: store.followedOnly,
    followedIds,
    page: 0,
    size: visiblePages * PAGE_SIZE,
  });

  const categories = useTopicCategories();
  const categoryCodes = useMemo(
    () => (categories.data ?? []).map((c) => c.category),
    [categories.data],
  );
  const facetCounts = useTopicFacetCounts(categoryCodes);

  const facetList = useMemo(
    () =>
      (categories.data ?? []).map((c) => ({
        code: c.category,
        label: c.label,
        count: facetCounts[c.category] ?? 0,
      })),
    [categories.data, facetCounts],
  );

  const topics = (query.data?.content ?? []).map(toTopicView);
  const total = query.data?.totalElements ?? 0;
  const hasMore = visiblePages * PAGE_SIZE < total;

  return (
    <View className="flex-1 bg-background">
      <View className="gap-3 border-b border-border p-4">
        <Input
          value={store.q}
          onChangeText={store.setQuery}
          placeholder="Chercher parmi tous les sujets…"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => store.setFollowedOnly(!store.followedOnly)}
              className={`rounded-full border px-3 py-1.5 ${
                store.followedOnly
                  ? "border-primary bg-primary/10"
                  : "border-border"
              }`}
            >
              <Text className="text-xs font-semibold">Suivis</Text>
            </Pressable>
            {facetList.map((facet) => {
              const active = store.categories.includes(facet.code);
              return (
                <Pressable
                  key={facet.code}
                  onPress={() =>
                    store.setCategories(
                      active
                        ? store.categories.filter((c) => c !== facet.code)
                        : [...store.categories, facet.code],
                    )
                  }
                  className={`flex-row items-center gap-1.5 rounded-full border px-3 py-1.5 ${
                    active ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  <View
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: categoryColor(facet.code) }}
                  />
                  <Text className="text-xs font-semibold">{facet.label}</Text>
                  <Text className="text-[11px] text-muted-foreground">
                    {facet.count}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TopicCard
            topic={item}
            onOpen={(id) => router.push(`/(app)/topic/${id}`)}
          />
        )}
        ListEmptyComponent={
          query.isLoading ? (
            <Text className="text-sm text-muted-foreground">Chargement…</Text>
          ) : (
            <Text className="text-sm text-muted-foreground">
              Aucun sujet ne correspond.
            </Text>
          )
        }
        ListFooterComponent={
          hasMore ? (
            <View className="items-center py-4">
              <Button
                variant="outline"
                label={`Afficher ${Math.min(PAGE_SIZE, total - topics.length)} sujets de plus`}
                onPress={() => setVisiblePages((p) => p + 1)}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}
