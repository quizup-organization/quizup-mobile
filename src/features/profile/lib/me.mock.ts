import type { Me } from "@/features/profile/domain/me";
import { db } from "@/mocks/db";
import { assertSuccess, mockDelay } from "@/mocks/scenario";

/** Profil courant alimenté par la base de démonstration locale. */
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

  async completeOnboarding(): Promise<Me> {
    await mockDelay(250);
    assertSuccess();
    db.me.onboardingCompleted = true;
    return {
      ...db.me,
      progression: { ...db.me.progression },
      stats: { ...db.me.stats },
    };
  },
};
