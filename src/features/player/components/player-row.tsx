import { AppAvatar, AppButton, AppText, Column, Row, Spacer } from "@/components";
import type { PlayerCard } from "@/features/player/domain/profile";
import { isOnline } from "@/features/player/domain/profile";
import { useSetPlayerFollow } from "@/features/player/hooks/use-set-player-follow";
import { initials } from "@/shared/utils/format";

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

  return (
    <Row spacing={12} alignment="center" style={{ paddingVertical: 8 }}>
      <Row spacing={12} alignment="center" onPress={onPress}>
        <AppAvatar initials={initials(name)} size={40} />
        <Column spacing={2}>
          <AppText variant="label">{name}</AppText>
          <AppText variant="caption" tone="muted">
            {`Niveau ${player.level} · ${online ? "En ligne" : "Hors ligne"}`}
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
