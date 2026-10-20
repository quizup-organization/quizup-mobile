import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSegments } from "expo-router";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { Bell, Compass, Home, UserRound, Users } from "lucide-react-native";
import {
  GlassView,
  PressableFeedback,
  Typography,
  useThemeColor,
} from "heroui-native";
import { cn } from "@/lib/utils";

const ITEMS = [
  { name: "index", label: "Accueil", icon: Home },
  { name: "topics", label: "Sujets", icon: Compass },
  { name: "social", label: "Social", icon: Users },
  { name: "notifications", label: "Notifications", icon: Bell },
  { name: "profile", label: "Profil", icon: UserRound },
] as const;

/**
 * Barre de navigation basse alignée sur le rendu web mobile :
 * pilule flottante, verre dépoli, onglet actif qui déploie son libellé.
 * Tous les éléments visuels sont HeroUI (GlassView, PressableFeedback, Typography).
 */
export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const [accent, muted] = useThemeColor(["accent", "muted"]);

  if (segments.some((segment) => segment === "room" || segment === "duel")) {
    return null;
  }

  const currentName = state.routes[state.index]?.name;
  const activeName =
    currentName?.startsWith("topic/")
      ? "topics"
      : currentName === "settings"
        ? "profile"
        : currentName;

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-0"
      style={{ paddingBottom: insets.bottom + 10 }}
    >
      <View className="relative mx-4 overflow-hidden rounded-full border border-border bg-surface/80 shadow-lg">
        <GlassView intensity={55} fallbackColor="surface" />
        <View className="flex-row items-center justify-between gap-1 p-2">
          {ITEMS.map((item) => {
            const route = state.routes.find((entry) => entry.name === item.name);
            if (!route) return null;

            const active = activeName === item.name;
            const Icon = item.icon;

            return (
              <PressableFeedback
                key={item.name}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: active }}
                onPress={() => {
                  if (!active) navigation.navigate(item.name);
                }}
                className={cn(
                  "h-12 min-w-11 items-center justify-center rounded-full",
                  active
                    ? "flex-row gap-2 bg-accent-soft px-3"
                    : "w-11",
                )}
              >
                <Icon color={active ? accent : muted} size={22} />
                {active ? (
                  <Typography
                    type="body-xs"
                    weight="medium"
                    className="text-accent"
                  >
                    {item.label}
                  </Typography>
                ) : null}
              </PressableFeedback>
            );
          })}
        </View>
      </View>
    </View>
  );
}
