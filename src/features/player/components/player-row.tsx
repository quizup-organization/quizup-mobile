import { AppAvatar, AppButton, AppText, Column, Row, Spacer } from "@/components";
import type { PlayerCard } from "@/features/player/domain/profile";
import { isOnline } from "@/features/player/domain/profile";
import { useSetPlayerFollow } from "@/features/player/hooks/use-set-player-follow";
import { formatNumber } from "@/shared/utils/format";

export function PlayerRow({
  player,
  onPress,
}: {
  player: PlayerCard;
  onPress?: () => void;
}) {
  const follow = useSetPlayerFollow(player.userId);
  const name = player.pseudonym ?? "Joueur";
  const online = isOnline(player.presence);
  const rating =
    player.rating > 0
      ? player.provisional
        ? "Elo provisoire"
        : `Elo ${formatNumber(player.rating)}`
      : null;
  const presence = online ? "En ligne" : "Hors ligne";
  const subtitle = rating ? `${rating} · ${presence}` : presence;

  return (
    <Row spacing={12} alignment="center" style={{ paddingVertical: 8 }}>
      <Row spacing={12} alignment="center" onPress={onPress}>
        <AppAvatar
          name={name}
          userId={player.userId}
          avatarOptions={player.avatarOptions}
          size={40}
        />
        <Column spacing={2}>
          <AppText variant="label">{name}</AppText>
          <AppText variant="caption" tone="muted">
            {subtitle}
          </AppText>
        </Column>
      </Row>
      <Spacer flexible />
      <AppButton
        variant={player.following ? "text" : "outlined"}
        label={player.following ? "Suivi" : "Suivre"}
        disabled={follow.isPending}
        onPress={() => follow.mutate(!player.following)}
      />
    </Row>
  );
}
