import { Text as RNText, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

interface AppTextProps extends TextProps {
  className?: string;
}

/** Texte de base — applique la couleur `foreground` du thème. */
export function Text({ className, ...props }: AppTextProps) {
  return <RNText className={cn("text-foreground", className)} {...props} />;
}
