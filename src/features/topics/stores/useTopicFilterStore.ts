import { create } from "zustand";
import type { TopicSort } from "@/shared/types/bff";

export const TOPIC_SORTS: { value: TopicSort; label: string }[] = [
  { value: "POPULAR", label: "Les plus suivis" },
  { value: "MOST_PLAYED", label: "Les plus joués" },
  { value: "ALPHA", label: "Ordre alphabétique" },
  { value: "RECENT", label: "Nouveautés" },
];

interface TopicFiltersState {
  q: string;
  category: string | null;
  sort: TopicSort;
  followedOnly: boolean;
  setQuery: (q: string) => void;
  setCategory: (category: string | null) => void;
  setSort: (sort: TopicSort) => void;
  setFollowedOnly: (followedOnly: boolean) => void;
  reset: () => void;
}

const initialState = {
  q: "",
  category: null as string | null,
  sort: "POPULAR" as TopicSort,
  followedOnly: false,
};

export const useTopicFilterStore = create<TopicFiltersState>((set) => ({
  ...initialState,
  setQuery: (q) => set({ q }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  setFollowedOnly: (followedOnly) => set({ followedOnly }),
  reset: () => set(initialState),
}));

export const useActiveFilterCount = () =>
  useTopicFilterStore(
    (state) =>
      (state.q ? 1 : 0) +
      (state.category ? 1 : 0) +
      (state.followedOnly ? 1 : 0),
  );
