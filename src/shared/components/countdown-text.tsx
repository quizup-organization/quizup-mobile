import { Typography } from "heroui-native";
import { useNow } from "@/shared/hooks/useNow";

interface CountdownTextProps {
  deadline: number | string | Date;
  className?: string;
}

/** Compte à rebours mm:ss sur une échéance serveur. */
export function CountdownText({ deadline, className }: CountdownTextProps) {
  const now = useNow(1000);
  const target =
    typeof deadline === "number" ? deadline : new Date(deadline).getTime();
  const remaining = Math.max(0, target - now);
  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  return (
    <Typography type="body-xs" color="muted" className={className}>
      {minutes}:{String(seconds).padStart(2, "0")}
    </Typography>
  );
}
