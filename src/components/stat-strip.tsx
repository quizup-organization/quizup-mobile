import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface StatStripProps {
  items: { label: string; value: string | number }[];
  className?: string;
}

/** Bandeau de statistiques — N colonnes avec filets verticaux. */
export function StatStrip({ items, className }: StatStripProps) {
  return (
    <View className={`flex-row ${className ?? ""}`}>
      {items.map((item, index) => (
        <View
          key={item.label}
          className={`flex-1 items-center gap-0.5 py-2 ${
            index > 0 ? "border-l border-border" : ""
          }`}
        >
          <Text className="text-[11px] font-semibold uppercase text-muted-foreground">
            {item.label}
          </Text>
          <Text className="text-2xl font-extrabold">{item.value}</Text>
        </View>
      ))}
    </View>
  );
}
