import { useEffect, useState } from "react";

/** Horloge locale ré-échantillonnée (timers, cooldowns, comptes à rebours). */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
