import { useWindowDimensions } from "react-native";

/** Largeur maximale du contenu, alignée sur le conteneur de `Screen`. */
export const CONTENT_MAX_WIDTH = 480;
export const SCREEN_HORIZONTAL_PADDING = 20;

export function useContentWidth() {
  const { width } = useWindowDimensions();
  return Math.min(width - SCREEN_HORIZONTAL_PADDING * 2, CONTENT_MAX_WIDTH);
}
