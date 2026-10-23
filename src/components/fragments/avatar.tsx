import { useEffect, useState } from "react";
import { Row, Spacer, Text } from "@expo/ui";

import { AppImage } from "@/components/fragments/image";
import { decorativeModifiers } from "@/components/fragments/accessibility";
import { avatarImageUrl } from "@/shared/avatar/dicebear";
import { initials } from "@/shared/utils/format";
import { useNativeColors } from "@/theme";

export function AppAvatar({
  initials: legacyInitials,
  name,
  userId,
  avatarOptions,
  size = 44,
  ringColor,
  initialOnly = false,
}: {
  /** Compatibilité avec les écrans historiques. */
  initials?: string;
  name?: string;
  userId?: string | null;
  avatarOptions?: string | null;
  size?: number;
  /** Couleur de l'anneau (Elo, premium…). */
  ringColor?: string;
  /** Compte supprimé / bot : pas d'avatar personnalisé. */
  initialOnly?: boolean;
}) {
  const colors = useNativeColors();
  const [failed, setFailed] = useState(false);
  const fallback = legacyInitials ?? initials(name ?? "?");
  const ring = ringColor ? 3 : 0;
  const inner = size - ring * 2;
  const imageUrl =
    initialOnly || failed
      ? null
      : avatarImageUrl({ userId, name, avatarOptions, size });

  useEffect(() => {
    setFailed(false);
  }, [avatarOptions, userId]);

  return (
    <Row
      alignment="center"
      modifiers={decorativeModifiers()}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: ring,
        borderColor: ringColor ?? "transparent",
        backgroundColor: colors.fill,
      }}
    >
      <Spacer flexible />
      {imageUrl ? (
        <AppImage
          source={{ uri: imageUrl }}
          width={inner}
          height={inner}
          radius={inner / 2}
          accessibilityLabel={name ? `Avatar de ${name}` : "Avatar"}
          onError={() => setFailed(true)}
        />
      ) : (
        <Text
          textStyle={{
            fontSize: Math.round(size / 2.8),
            fontWeight: "700",
            color: colors.accent,
          }}
        >
          {fallback}
        </Text>
      )}
      <Spacer flexible />
    </Row>
  );
}
