import { useMemo, useState } from "react";
import {
  FlatList,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  BottomSheet,
  Button,
  Chip,
  SearchField,
  Spinner,
  Switch,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useMe } from "@/features/auth/hooks/useMe";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useTopicFacets, useTopicsList } from "@/features/topics/hooks/useTopics";
import {
  TOPIC_SORTS,
  useTopicFilterStore,
} from "@/features/topics/stores/useTopicFilterStore";
import { TopicCard } from "@/features/topics/components/topic-card";
import { topicName } from "@/shared/utils/topic-name";

export function TopicsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const store = useTopicFilterStore();
  const debounced = useDebounce(store.q, 300);
  const me = useMe();
  const language = me.data?.language ?? "fr";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [background] = useThemeColor(["background"]);

  const topicsQuery = useTopicsList({
    q: debounced,
    category: store.category ?? undefined,
    followed: store.followedOnly,
    sort: store.sort,
  });
  const facets = useTopicFacets({
    q: debounced,
    followed: store.followedOnly,
  });

  const topics = useMemo(
    () => topicsQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [topicsQuery.data],
  );
  const total = topicsQuery.data?.pages[0]?.totalElements ?? 0;
  const cardWidth = Math.floor((width - 40 - 12) / 2);
  const categories = facets.data?.categories ?? [];

  const header = (
    <View className="gap-4 pb-4">
      <View className="flex-row items-end justify-between gap-3">
        <View className="flex-1 gap-1">
          <Typography type="h1">Sujets</Typography>
          <Typography type="body-sm" color="muted">
            {topicsQuery.isPending ? "Chargement…" : `${total} sujets`}
          </Typography>
        </View>
        <Button
          variant="secondary"
          size="sm"
          onPress={() => setFiltersOpen(true)}
        >
          Filtres
        </Button>
      </View>

      <SearchField value={store.q} onChange={store.setQuery}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Chercher un sujet…" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      <View className="flex-row flex-wrap gap-2">
        <Chip
          variant={store.followedOnly ? "primary" : "secondary"}
          onPress={() => store.setFollowedOnly(!store.followedOnly)}
        >
          <Chip.Label>Suivis</Chip.Label>
        </Chip>
        {store.category ? (
          <Chip variant="soft" onPress={() => store.setCategory(null)}>
            <Chip.Label>
              {categories.find((item) => item.category === store.category)
                ?.label ?? "Catégorie"}
            </Chip.Label>
          </Chip>
        ) : null}
      </View>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: background }}>
      <FlatList
        data={topics}
        keyExtractor={(topic) => topic.topicId}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 120,
          gap: 16,
        }}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <TopicCard
            topic={item}
            language={language}
            width={cardWidth}
            onPress={() => router.push(`/(app)/topic/${item.topicId}`)}
          />
        )}
        onEndReached={() => {
          if (topicsQuery.hasNextPage && !topicsQuery.isFetchingNextPage) {
            void topicsQuery.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          topicsQuery.isPending ? (
            <View className="items-center py-16">
              <Spinner />
            </View>
          ) : (
            <View className="items-center gap-3 py-16">
              <Typography type="h5">Aucun sujet ne correspond</Typography>
              <Typography type="body-sm" color="muted" align="center">
                Essaie une autre recherche ou retire les filtres.
              </Typography>
              <Button variant="secondary" onPress={() => store.reset()}>
                Réinitialiser
              </Button>
            </View>
          )
        }
        ListFooterComponent={
          topicsQuery.isFetchingNextPage ? (
            <View className="items-center py-4">
              <Spinner size="sm" />
            </View>
          ) : null
        }
      />

      <BottomSheet isOpen={filtersOpen} onOpenChange={setFiltersOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            <BottomSheet.Close />
            <BottomSheet.Title>Filtres</BottomSheet.Title>
            <BottomSheet.Description>
              Affine le catalogue des sujets.
            </BottomSheet.Description>

            <View className="mt-6 gap-6">
              <View className="gap-3">
                <Typography type="body-sm" weight="semibold">
                  Source
                </Typography>
                <View className="flex-row items-center justify-between gap-3">
                  <Typography type="body-sm">Mes sujets suivis</Typography>
                  <Switch
                    isSelected={store.followedOnly}
                    onSelectedChange={store.setFollowedOnly}
                  />
                </View>
              </View>

              <View className="gap-3">
                <Typography type="body-sm" weight="semibold">
                  Catégorie
                </Typography>
                <View className="flex-row flex-wrap gap-2">
                  <Chip
                    variant={store.category === null ? "primary" : "secondary"}
                    onPress={() => store.setCategory(null)}
                  >
                    <Chip.Label>Toutes</Chip.Label>
                  </Chip>
                  {categories.map((category) => (
                    <Chip
                      key={category.category}
                      variant={
                        store.category === category.category
                          ? "primary"
                          : "secondary"
                      }
                      onPress={() =>
                        store.setCategory(
                          store.category === category.category
                            ? null
                            : category.category,
                        )
                      }
                    >
                      <Chip.Label>
                        {category.label} · {category.count}
                      </Chip.Label>
                    </Chip>
                  ))}
                </View>
              </View>

              <View className="gap-3">
                <Typography type="body-sm" weight="semibold">
                  Tri
                </Typography>
                <View className="flex-row flex-wrap gap-2">
                  {TOPIC_SORTS.map((sort) => (
                    <Chip
                      key={sort.value}
                      variant={store.sort === sort.value ? "primary" : "secondary"}
                      onPress={() => store.setSort(sort.value)}
                    >
                      <Chip.Label>{sort.label}</Chip.Label>
                    </Chip>
                  ))}
                </View>
              </View>

              <Button onPress={() => setFiltersOpen(false)}>
                Voir les résultats
              </Button>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
