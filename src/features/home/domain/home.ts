import type { TopicCard } from "@/features/topics/domain/topic";

/** Données de l'accueil (`HomeView`). */
export interface Home {
  followedTopics: TopicCard[];
  trendingTopics: TopicCard[];
  newTopics: TopicCard[];
}
