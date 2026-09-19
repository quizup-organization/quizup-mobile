import { View } from "react-native";
import { Text } from "./text";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

/** Avatar joueur — initiales sur fond coloré (fallback de la maquette). */
export function Avatar({ name, size = 40, color, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <View
      className={cn("items-center justify-center rounded-full bg-primary", className)}
      style={{ width: size, height: size, backgroundColor: color }}
    >
      <Text
        className="font-bold text-primary-foreground"
        style={{ fontSize: size * 0.36 }}
      >
        {initials}
      </Text>
    </View>
  );
}
