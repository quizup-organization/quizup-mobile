import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import type { MeView } from "@/shared/types/bff";

export const meService = {
  get: (): Promise<MeView> => api.get<MeView>(ENDPOINTS.me),
};
