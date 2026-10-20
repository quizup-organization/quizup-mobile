import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Button,
  Card,
  Spinner,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ProgressBar } from "@/shared/components/progress-bar";
import { UserAvatar } from "@/shared/components/user-avatar";
import { titleForLevel } from "@/shared/utils/level";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 items-center gap-1">
      <Typography type="body-xs" color="muted">
        {label}
      </Typography>
      <Typography type="h5">{value}</Typography>
    </View>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const signOut = useLogout();
  const [background] = useThemeColor(["background"]);

  if (me.isPending) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: background }}
      >
        <Spinner />
      </View>
    );
  }

  if (!me.data) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 px-6"
        style={{ backgroundColor: background }}
      >
        <Typography type="h5">Impossible de charger ton profil</Typography>
        <Button variant="secondary" onPress={() => void me.refetch()}>
          Réessayer
        </Button>
        <Button variant="ghost" onPress={() => void signOut()}>
          Se déconnecter
        </Button>
      </View>
    );
  }

  const data = me.data;
  const level = data.progression.level;
  const name = data.pseudonym;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: background }}
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 96,
        gap: 16,
      }}
    >
      <View className="items-center gap-3">
        <UserAvatar name={name} size="lg" />
        <View className="items-center gap-1">
          <Typography type="h2">{name}</Typography>
          <Typography type="body-sm" color="muted">
            {titleForLevel(level)} · Niveau {level}
            {data.country ? ` · ${data.country}` : ""}
          </Typography>
        </View>
      </View>

      <Card>
        <Card.Body className="gap-3">
          <View className="flex-row items-center justify-between">
            <Typography type="body-xs" color="muted">
              {data.progression.xpTotal} XP
            </Typography>
            <Typography type="body-xs" color="muted">
              Niveau {level}
            </Typography>
          </View>
          <ProgressBar value={data.progression.levelProgressPercent} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex-row gap-2">
          <Stat label="Parties" value={data.stats.played} />
          <Stat label="Victoires" value={data.stats.wins} />
          <Stat label="Défaites" value={data.stats.losses} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex-row gap-2">
          <Stat label="Abonnements" value={data.followingCount} />
          <Stat label="Abonnés" value={data.followersCount} />
          <Stat label="Nuls" value={data.stats.draws} />
        </Card.Body>
      </Card>

      <View className="mt-4 gap-3">
        <Button variant="secondary" onPress={() => router.push("/(app)/settings")}>
          Réglages
        </Button>
        <Button variant="outline" onPress={() => void signOut()}>
          Se déconnecter
        </Button>
      </View>
    </ScrollView>
  );
}
