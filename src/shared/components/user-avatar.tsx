import { Avatar } from "heroui-native";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

/** Avatar joueur HeroUI + repli initiales QuizUp (DiceBear viendra plus tard). */
export function UserAvatar({ name, size = "md" }: UserAvatarProps) {
  return (
    <Avatar size={size} className="bg-accent">
      <Avatar.Fallback
        animation="disabled"
        styles={{
          container: { backgroundColor: "#1447E6" },
          text: { color: "#FFFFFF", fontWeight: "600" },
        }}
      >
        {name.slice(0, 2).toUpperCase()}
      </Avatar.Fallback>
    </Avatar>
  );
}
