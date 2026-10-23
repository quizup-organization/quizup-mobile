import { RNHostView } from "@expo/ui";
import { Image, type ImageContentFit, type ImageSource } from "expo-image";

/** Image distante ou locale rendue dans un pont RN contrôlé par Expo UI. */
export function AppImage({
  source,
  width,
  height,
  radius = 12,
  contentFit = "cover",
  accessibilityLabel,
  onError,
}: {
  source: ImageSource | null | undefined;
  width: number;
  height: number;
  radius?: number;
  contentFit?: ImageContentFit;
  accessibilityLabel?: string;
  onError?: () => void;
}) {
  if (!source) return null;

  return (
    <RNHostView matchContents>
      <Image
        source={source}
        contentFit={contentFit}
        transition={180}
        cachePolicy="memory-disk"
        accessibilityLabel={accessibilityLabel}
        onError={onError}
        style={{ width, height, borderRadius: radius }}
      />
    </RNHostView>
  );
}
