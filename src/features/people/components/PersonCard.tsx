import { Pressable } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Avatar } from "@/components/ui/avatar";
import { personColor } from "../lib/person-color";

export interface Person {
  userId: string;
  displayName: string;
}

/** Carte de personne minimaliste — avatar + nom, aucune action. */
export function PersonCard({
  person,
  onOpen,
}: {
  person: Person;
  onOpen: (userId: string) => void;
}) {
  return (
    <Pressable onPress={() => onOpen(person.userId)}>
      <Card className="flex-row items-center gap-3">
        <Avatar
          name={person.displayName}
          color={personColor(person.userId)}
          size={36}
        />
        <Text className="flex-1 text-[15px] font-semibold" numberOfLines={1}>
          {person.displayName}
        </Text>
      </Card>
    </Pressable>
  );
}
