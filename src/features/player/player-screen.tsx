import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { WinLossBar } from "@/components/win-loss-bar";
import { ProfileBanner } from "@/shared/components/ProfileBanner";
import { MatchList } from "@/features/topic/components/MatchList";
import { ThemePickerModal } from "@/features/duel/components/ThemePickerModal";
import { useCreateChallenge } from "@/features/challenges/hooks/useChallenges";
import { getUserId } from "@/lib/auth";
import { titleForLevel } from "@/shared/utils/level";
import { personColor } from "@/features/people/lib/person-color";
import { useUserGames } from "@/features/topic/hooks/useTopicDetail";
import {
  usePlayer,
  useFollowState,
  useToggleUserFollow,
} from "./hooks/usePlayer";

export function PlayerScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const me = getUserId();
  const [challengeOpen, setChallengeOpen] = useState(false);

  const { profile, progression, counts, isLoading } = usePlayer(id);
  const followState = useFollowState(id);
  const { follow, unfollow } = useToggleUserFollow(id);
  const createChallenge = useCreateChallenge();
  const gamesQuery = useUserGames();

  if (isLoading) {
    return (
      <Screen>
        <Text className="text-sm text-muted-foreground">Chargement…</Text>
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen>
        <Text className="text-sm text-muted-foreground">Joueur introuvable.</Text>
      </Screen>
    );
  }

  const name = profile.displayName ?? "Joueur";
  const level = progression?.level ?? 1;
  const duel = progression?.duelStats;
  const played = duel?.played ?? 0;
  const wins = duel?.wins ?? 0;
  const losses = duel?.losses ?? 0;
  const draws = Math.max(0, played - wins - losses);

  const followRecord = followState.data;
  const isFollowing = !!followRecord;
  const pending = follow.isPending || unfollow.isPending;
  const isSelf = me === id;

  const versus = (gamesQuery.data ?? []).filter(
    (game) =>
      (game.player1Id === me && game.player2Id === id) ||
      (game.player2Id === me && game.player1Id === id),
  );

  return (
    <Screen>
      <ProfileBanner
        name={name}
        avatarColor={personColor(id)}
        badge={isFollowing ? <Badge label="Abonné" /> : undefined}
        meta={
          <Text className="text-sm text-muted-foreground">
            {progression?.title ?? titleForLevel(level)} · Niveau {level}
            {profile.country ? ` · ${profile.country}` : ""}
          </Text>
        }
        actions={
          isSelf ? (
            <Button
              variant="outline"
              label="Mon profil"
              onPress={() => router.push("/(app)/profile")}
            />
          ) : (
            <View className="gap-2">
              <Button
                label="Défier"
                onPress={() => setChallengeOpen(true)}
              />
              <Button
                variant={isFollowing ? "secondary" : "outline"}
                label={isFollowing ? "Abonné" : "Suivre"}
                disabled={pending}
                onPress={() =>
                  isFollowing && followRecord
                    ? unfollow.mutate(followRecord.followId)
                    : follow.mutate()
                }
              />
            </View>
          )
        }
        stats={[
          { label: "Parties", value: played },
          { label: "Abonnés", value: counts?.followers ?? 0 },
          { label: "Abonné à", value: counts?.following ?? 0 },
        ]}
      />

      <View className="mt-5 gap-3">
        <Text className="text-base font-semibold">Statistiques</Text>
        <Card>
          <WinLossBar wins={wins} draws={draws} losses={losses} />
        </Card>
      </View>

      <Text className="mt-6 mb-3 text-base font-semibold">
        Tes duels contre {name.split(" ")[0]}
      </Text>
      {versus.length === 0 ? (
        <Card>
          <Text className="text-sm text-muted-foreground">
            Aucun duel commun pour l'instant.
          </Text>
        </Card>
      ) : (
        <MatchList games={versus} />
      )}

      <ThemePickerModal
        visible={challengeOpen}
        onClose={() => setChallengeOpen(false)}
        opponentName={name}
        onSelect={(topicId) =>
          createChallenge.mutate(
            { challengedId: id, topicId },
            {
              onSuccess: () => {
                setChallengeOpen(false);
                router.push("/(app)/challenges");
              },
            },
          )
        }
      />
    </Screen>
  );
}
