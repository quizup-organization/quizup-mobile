import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { cn } from "@/lib/utils";

interface ScreenProps {
  children: ReactNode;
  className?: string;
  scroll?: boolean;
}

/** Conteneur de page mobile (padding horizontal standard). */
export function Screen({ children, className, scroll = true }: ScreenProps) {
  if (!scroll) {
    return <View className={cn("flex-1 bg-background p-4", className)}>{children}</View>;
  }
  return (
    <ScrollView
      className={cn("flex-1 bg-background", className)}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
