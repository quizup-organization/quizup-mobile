/** Génération d'URL d'avatar DiceBear à partir des options persistées. */

type AvatarOptions = Record<string, unknown>;

const STYLES = new Set(["micah", "lorelei", "notionists"]);

function parseOptions(value: string | null | undefined): AvatarOptions | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as AvatarOptions;
  } catch {
    return null;
  }
}

function optionValue(value: unknown): string | null {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : null;
}

/**
 * URL PNG DiceBear. Les options compactes du web (`style`, `backgroundColor`,
 * variantes, `none`) sont traduites en paramètres de l'API publique.
 */
export function avatarImageUrl({
  userId,
  name,
  avatarOptions,
  size = 96,
}: {
  userId?: string | null;
  name?: string | null;
  avatarOptions?: string | null;
  size?: number;
}): string | null {
  const options = parseOptions(avatarOptions);
  if (options?.style === "base") return null;

  const style =
    typeof options?.style === "string" && STYLES.has(options.style)
      ? options.style
      : "micah";
  const seed = userId?.trim() || name?.trim() || "quizup";
  const params = new URLSearchParams({
    seed,
    size: String(Math.min(256, Math.max(48, Math.round(size * 2)))),
    radius: "50",
  });

  for (const [key, raw] of Object.entries(options ?? {})) {
    if (key === "style") continue;
    const value = optionValue(raw);
    if (!value) continue;
    if (key === "backgroundColor") {
      params.set("backgroundColor", value.replace(/^#/, ""));
      continue;
    }
    if (value === "none") {
      params.set(`${key}Probability`, "0");
      continue;
    }
    params.set(key, value);
  }

  return `https://api.dicebear.com/9.x/${style}/png?${params.toString()}`;
}
