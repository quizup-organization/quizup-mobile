import { create } from "zustand";
import type { SortDirection } from "@/shared/types/search";

export const PAGE_SIZE = 24;

export type TopicSort = "popular" | "alpha" | "level";

export const TOPIC_SORTS: { value: TopicSort; label: string }[] = [
  { value: "popular", label: "Les plus suivis" },
  { value: "alpha", label: "Ordre alphabétique" },
  { value: "level", label: "Mon niveau" },
];

export const SORT_DIRECTION: Record<TopicSort, { property: string; direction: SortDirection }> = {
  popular: { property: "followersCounter", direction: "DESC" },
  alpha: { property: "name", direction: "ASC" },
  level: { property: "followersCounter", direction: "DESC" },
};

interface TopicFiltersState {
  q: string;
  categories: string[];
  sort: TopicSort;
  followedOnly: boolean;
  setQuery: (q: string) => void;
  setCategories: (categories: string[]) => void;
  setSort: (sort: TopicSort) => void;
  setFollowedOnly: (followedOnly: boolean) => void;
  reset: () => void;
}

const initialState = {
  q: "",
  categories: [] as string[],
  sort: "popular" as TopicSort,
  followedOnly: false,
};

export const useTopicFilterStore = create<TopicFiltersState>((set) => ({
  ...initialState,
  setQuery: (q) => set({ q }),
  setCategories: (categories) => set({ categories }),
  setSort: (sort) => set({ sort }),
  setFollowedOnly: (followedOnly) => set({ followedOnly }),
  reset: () => set(initialState),
}));

export const useActiveFilterCount = () =>
  useTopicFilterStore(
    (s) => (s.q ? 1 : 0) + s.categories.length + (s.followedOnly ? 1 : 0),
  );
