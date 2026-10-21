import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { useUnreadNotificationsCount } from "@/features/notifications";
import { useNativeColors } from "@/theme";

function HeaderIconButton({
  label,
  name,
  onPress,
  badge = false,
}: {
  label: string;
  name: React.ComponentProps<typeof SymbolView>["name"];
  onPress: () => void;
  badge?: boolean;
}) {
  const colors = useNativeColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={10}
      style={{ padding: 4 }}
    >
      <SymbolView name={name} size={22} tintColor={colors.text} />
      {badge ? (
        <View
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.danger,
          }}
        />
      ) : null}
    </Pressable>
  );
}

/** Actions natives des headers d'onglets (recherche, réglages, cloche). */
export function HeaderActions({
  search = false,
  settings = false,
}: {
  search?: boolean;
  settings?: boolean;
}) {
  const router = useRouter();
  const unread = useUnreadNotificationsCount();
  const hasUnread = (unread.data?.count ?? 0) > 0;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingRight: 4,
      }}
    >
      {search ? (
        <HeaderIconButton
          label="Rechercher"
          name={{ ios: "magnifyingglass", android: "search", web: "search" }}
          onPress={() => router.push("/search")}
        />
      ) : null}
      {settings ? (
        <HeaderIconButton
          label="Réglages"
          name={{ ios: "gearshape", android: "settings", web: "settings" }}
          onPress={() => router.push("/settings")}
        />
      ) : null}
      <HeaderIconButton
        label="Notifications"
        name={{ ios: "bell", android: "notifications", web: "notifications" }}
        onPress={() => router.push("/notifications")}
        badge={hasUnread}
      />
    </View>
  );
}
