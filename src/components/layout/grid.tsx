import { Column, Row } from "@expo/ui";
import type { ReactNode } from "react";

import { useScreenWidth } from "@/components/screen";

/** Grille native : lignes de `Row`, cellules de largeur calculée. */
export function Grid<T>({
  items,
  columns = 2,
  gap = 12,
  renderItem,
}: {
  items: readonly T[];
  columns?: number;
  gap?: number;
  renderItem: (item: T, width: number) => ReactNode;
}) {
  const width = useScreenWidth();
  const cellWidth = Math.floor((width - gap * (columns - 1)) / columns);

  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += columns) {
    rows.push(items.slice(index, index + columns));
  }

  return (
    <Column spacing={gap} style={{ width }}>
      {rows.map((row, rowIndex) => (
        <Row key={rowIndex} spacing={gap} alignment="start">
          {row.map((item, index) => (
            <Column key={index} style={{ width: cellWidth }}>
              {renderItem(item, cellWidth)}
            </Column>
          ))}
        </Row>
      ))}
    </Column>
  );
}
