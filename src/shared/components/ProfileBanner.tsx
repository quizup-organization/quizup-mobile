import type { ReactNode } from "react";
import { View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { StatStrip } from "@/components/stat-strip";

interface ProfileBannerProps {
  name: string;
  avatarColor?: string;
  badge?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  stats: { label: string; value: string | number }[];
}

/** Bandeau d'identité (profil / fiche joueur) — avatar, identité, CTA, stats. */
export function ProfileBanner({
  name,
  avatarColor,
  badge,
  meta,
  actions,
  stats,
}: ProfileBannerProps) {
  return (
    <View className="gap-4">
      <View className="flex-row items-start gap-4">
        <Avatar name={name} color={avatarColor} size={72} />
        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Text className="flex-shrink text-xl font-extrabold" numberOfLines={1}>
              {name}
            </Text>
            {badge}
          </View>
          {meta}
        </View>
      </View>
      {actions}
      <StatStrip className="border-t border-border pt-2" items={stats} />
    </View>
  );
}
