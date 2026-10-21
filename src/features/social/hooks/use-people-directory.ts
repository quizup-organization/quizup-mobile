import type { PeopleDirection } from "@/features/player/domain/profile";
import { usePeople } from "@/features/player/hooks/use-people";
import { useMe } from "@/features/profile/hooks/use-me";

/** Annuaire Social : listes Abonnements / Abonnés du joueur courant. */
export function usePeopleDirectory(direction: PeopleDirection) {
  const me = useMe();
  const people = usePeople(me.data?.userId, direction);
  return { me, people };
}
