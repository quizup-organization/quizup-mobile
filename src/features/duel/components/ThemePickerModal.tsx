import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TopicIcon } from "@/components/topic-icon";
import { queryKeys } from "@/lib/query-keys";
import { topicsService, toTopicView } from "@/lib/services/topics";
import { normalize } from "@/lib/helpers";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { FilterCriteria, SearchRequest } from "@/shared/types/search";

interface ThemePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (topicId: string) => void;
  opponentName: string;
}

/** Sélecteur de thème (défi) — recherche serveur via `POST /topics/search`. */
export function ThemePickerModal({
  visible,
  onClose,
  onSelect,
  opponentName,
}: ThemePickerModalProps) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);

  const request: SearchRequest = useMemo(() => {
    const filters: FilterCriteria[] = [
      { property: "status", operator: "EQUALS", value: "PUBLISHED" },
    ];
    if (debounced.trim()) {
      filters.push({
        property: "nameNormalized",
        operator: "CONTAINS",
        value: normalize(debounced),
      });
    }
    return {
      filters,
      sorts: [{ property: "followersCounter", direction: "DESC" }],
      page: { number: 0, size: 12 },
    };
  }, [debounced]);

  const topicsQuery = useQuery({
    queryKey: queryKeys.topics.search(request),
    queryFn: () => topicsService.search(request),
    enabled: visible,
    staleTime: 5 * 60 * 1000,
  });
  const topics = (topicsQuery.data?.content ?? []).map(toTopicView);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="max-h-[80%] gap-3 rounded-t-2xl bg-background p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold">Choisir un thème</Text>
            <Button variant="ghost" size="sm" label="Fermer" onPress={onClose} />
          </View>
          <Text className="text-xs text-muted-foreground">
            Défie {opponentName} sur le thème de ton choix.
          </Text>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un thème…"
          />
          <FlatList
            data={topics}
            keyExtractor={(topic) => topic.id}
            style={{ maxHeight: 360 }}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSelect(item.id)}
                className="flex-row items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <TopicIcon topic={item} size={36} />
                <Text className="flex-1 text-sm font-semibold" numberOfLines={1}>
                  {item.name}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text className="p-4 text-center text-sm text-muted-foreground">
                Aucun thème à ce nom.
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}
