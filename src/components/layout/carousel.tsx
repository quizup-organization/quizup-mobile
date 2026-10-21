import { Column, Row, ScrollView } from "@expo/ui";
import type { ReactNode } from "react";

import { useScreenWidth } from "@/components/screen";

type BaseProps<T> = {
  items: readonly T[];
  spacing?: number;
};

type FixedCarouselProps<T> = BaseProps<T> & {
  itemWidth: number;
  renderItem: (item: T, width: number) => ReactNode;
};

type IntrinsicCarouselProps<T> = BaseProps<T> & {
  itemWidth?: undefined;
  renderItem: (item: T) => ReactNode;
};

/**
 * Carrousel horizontal natif (ScrollView Expo UI).
 * - `itemWidth` fourni : éléments à largeur fixe (cartes) ;
 * - sinon : largeur intrinsèque (chips).
 */
export function Carousel<T>(
  props: FixedCarouselProps<T> | IntrinsicCarouselProps<T>,
) {
  const width = useScreenWidth();
  const spacing = props.spacing ?? 8;

  const frame = (children: ReactNode) => (
    <ScrollView
      direction="horizontal"
      showsIndicators={false}
      style={{ width }}
    >
      <Row spacing={spacing}>{children}</Row>
    </ScrollView>
  );

  if (props.itemWidth === undefined) {
    const { items, renderItem } = props;
    return frame(
      items.map((item, index) => (
        <Column key={index}>{renderItem(item)}</Column>
      )),
    );
  }

  const { items, itemWidth, renderItem } = props;
  return frame(
    items.map((item, index) => (
      <Column key={index}>{renderItem(item, itemWidth)}</Column>
    )),
  );
}
