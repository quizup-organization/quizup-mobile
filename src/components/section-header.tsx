import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row items-baseline justify-between">
      <Text className="text-base font-semibold">{title}</Text>
      {action}
    </View>
  );
}
