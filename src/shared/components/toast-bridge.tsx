import { useEffect } from "react";
import { useToast } from "heroui-native";
import { setToastHandler } from "@/lib/toast";

/** Relie `showToast` (services/hooks) au ToastProvider de HeroUI Native. */
export function ToastBridge() {
  const { toast } = useToast();

  useEffect(() => {
    setToastHandler((input) => {
      toast.show({
        variant:
          input.tone === "danger"
            ? "danger"
            : input.tone === "success"
              ? "success"
              : "default",
        label: input.title,
        description: input.description,
      });
    });
    return () => setToastHandler(null);
  }, [toast]);

  return null;
}
