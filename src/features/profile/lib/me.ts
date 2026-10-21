import type { Me } from "@/features/profile/domain/me";
import { db } from "@/mocks/db";
import { assertSuccess, mockDelay } from "@/mocks/scenario";

/** Implémentation mock du profil courant — remplacée par le BFF en phase API. */
export const meService = {
  async get(): Promise<Me> {
    await mockDelay();
    assertSuccess();
    return {
      ...db.me,
      progression: { ...db.me.progression },
      stats: { ...db.me.stats },
    };
  },
};
