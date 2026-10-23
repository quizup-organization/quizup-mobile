import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { isMockData } from "@/lib/config";
import type {
  PlayerTitles,
  RewardsCatalog,
} from "@/features/profile/domain/progression";
import { progressionService as mockProgressionService } from "./progression.mock";

const apiProgressionService = {
  titles: (userId: string): Promise<PlayerTitles> =>
    api.get<PlayerTitles>(ENDPOINTS.profiles.titles(userId)),

  rewards: (): Promise<RewardsCatalog> =>
    api.get<RewardsCatalog>(ENDPOINTS.meRewards),
};

/** Titres et récompenses via le BFF, ou catalogue de démonstration local. */
export const progressionService = isMockData
  ? mockProgressionService
  : apiProgressionService;
