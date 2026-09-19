import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

interface CardProps extends ViewProps {
  className?: string;
}

/** Carte — surface `card` + bordure, comme la maquette shadcn. */
export function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn("rounded-lg border border-border bg-card p-4", className)}
      {...props}
    />
  );
}
