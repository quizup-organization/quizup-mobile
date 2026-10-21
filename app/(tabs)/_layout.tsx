import { NativeTabs } from "expo-router/unstable-native-tabs";

import { usePendingChallengesCount } from "@/features/challenges";
import { useNativeColors } from "@/theme";

export default function TabsLayout() {
  const colors = useNativeColors();
  const pending = usePendingChallengesCount();
  const pendingCount = pending.data ?? 0;

  return (
    <NativeTabs
      tintColor={colors.accent}
      iconColor={{ selected: colors.accent }}
    >
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        <NativeTabs.Trigger.Label>Accueil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(topics)">
        <NativeTabs.Trigger.Icon sf="square.grid.2x2.fill" md="explore" />
        <NativeTabs.Trigger.Label>Sujets</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(social)">
        <NativeTabs.Trigger.Icon sf="person.2.fill" md="groups" />
        <NativeTabs.Trigger.Label>Social</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(challenges)">
        <NativeTabs.Trigger.Icon sf="flag.checkered" md="sports_esports" />
        <NativeTabs.Trigger.Label>Défis</NativeTabs.Trigger.Label>
        {pendingCount > 0 ? (
          <NativeTabs.Trigger.Badge>
            {String(pendingCount)}
          </NativeTabs.Trigger.Badge>
        ) : null}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon sf="person.crop.circle.fill" md="person" />
        <NativeTabs.Trigger.Label>Profil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
