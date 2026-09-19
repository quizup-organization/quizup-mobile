import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

interface InputProps extends TextInputProps {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      placeholderTextColor="#71717a"
      className={cn(
        "h-11 rounded-md border border-border bg-card px-3 text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
}
