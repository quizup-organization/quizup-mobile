import { View } from "react-native";
import { Text } from "./text";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  className?: string;
}

export function Badge({ label, className }: BadgeProps) {
  return (
    <View className={cn("self-start rounded-full bg-muted px-2 py-0.5", className)}>
      <Text className="text-[11px] font-semibold text-muted-foreground">{label}</Text>
    </View>
  );
}
