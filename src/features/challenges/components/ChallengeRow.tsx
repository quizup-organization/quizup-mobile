import { View } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { TopicIcon } from "@/components/topic-icon";
import type { ChallengeStatus } from "@/shared/types/domain";
import type { ChallengeView } from "../hooks/useChallenges";

function timeLeftLabel(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "expiré";
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 1) return `${hours} h`;
  return `${Math.max(1, Math.floor(ms / 60_000))} min`;
}

const STATUS_LABEL: Record<Exclude<ChallengeStatus, "PENDING">, string> = {
  ACCEPTED: "Accepté",
  DECLINED: "Refusé",
  EXPIRED: "Expiré",
};

interface ChallengeRowProps {
  view: ChallengeView;
  onAccept: (challengeId: string) => void;
  onDecline: (challengeId: string) => void;
  pending: boolean;
}

export function ChallengeRow({
  view,
  onAccept,
  onDecline,
  pending,
}: ChallengeRowProps) {
  const router = useRouter();
  const { challenge, direction, otherName, topic } = view;
  const isPending = challenge.status === "PENDING";

  return (
    <Card className="flex-row items-center gap-3">
      <TopicIcon topic={topic} size={38} />
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-medium" numberOfLines={1}>
          {direction === "received"
            ? `${otherName} te défie`
            : `Tu défies ${otherName}`}
        </Text>
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          {topic.name} ·{" "}
          {isPending
            ? `expire dans ${timeLeftLabel(challenge.expiresAt)}`
            : STATUS_LABEL[challenge.status as Exclude<ChallengeStatus, "PENDING">]}
        </Text>
      </View>

      {isPending ? (
        direction === "received" ? (
          <View className="shrink-0 flex-row gap-2">
            <Button
              size="sm"
              label="Accepter"
              disabled={pending}
              onPress={() => onAccept(challenge.challengeId)}
            />
            <Button
              variant="ghost"
              size="sm"
              label="Refuser"
              disabled={pending}
              onPress={() => onDecline(challenge.challengeId)}
            />
          </View>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            label="Annuler"
            disabled={pending}
            onPress={() => onDecline(challenge.challengeId)}
          />
        )
      ) : challenge.status === "ACCEPTED" && challenge.gameId ? (
        <Button
          size="sm"
          label="Jouer"
          onPress={() => router.push(`/(app)/duel/${challenge.gameId}`)}
        />
      ) : (
        <Badge
          label={
            STATUS_LABEL[challenge.status as Exclude<ChallengeStatus, "PENDING">]
          }
        />
      )}
    </Card>
  );
}
