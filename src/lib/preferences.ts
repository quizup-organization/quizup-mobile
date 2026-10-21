import * as SecureStore from "expo-secure-store";

import type { ThemeScheme } from "@/providers/theme-provider";

const PREFERENCES_KEY = "quizup.preferences.v1";

export interface StoredPreferences {
  scheme: ThemeScheme;
  seed?: string;
}

function isPreferences(value: unknown): value is StoredPreferences {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.scheme === "light" ||
    candidate.scheme === "dark" ||
    candidate.scheme === "system"
  );
}

export async function loadPreferences(): Promise<StoredPreferences | null> {
  const raw = await SecureStore.getItemAsync(PREFERENCES_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isPreferences(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function savePreferences(
  preferences: StoredPreferences,
): Promise<void> {
  await SecureStore.setItemAsync(PREFERENCES_KEY, JSON.stringify(preferences));
}
