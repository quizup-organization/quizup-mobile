import { Pressable, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { Text } from "./text";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex-row items-center justify-center gap-2 rounded-md px-4 py-2.5",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        outline: "border border-border bg-transparent",
        ghost: "bg-transparent",
        destructive: "bg-destructive",
      },
      size: {
        sm: "px-3 py-1.5",
        default: "px-4 py-2.5",
        lg: "px-5 py-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

const textVariants = cva("text-sm font-semibold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      outline: "text-foreground",
      ghost: "text-foreground",
      destructive: "text-destructive-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

interface ButtonProps
  extends Omit<PressableProps, "children">,
    VariantProps<typeof buttonVariants> {
  label: string;
  className?: string;
  textClassName?: string;
}

export function Button({
  label,
  variant,
  size,
  className,
  textClassName,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, size }),
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <Text className={cn(textVariants({ variant }), textClassName)}>
        {label}
      </Text>
    </Pressable>
  );
}
