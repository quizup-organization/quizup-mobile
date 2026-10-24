import { Redirect, useLocalSearchParams } from "expo-router";

export default function JoinRoomRoute() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  return <Redirect href={`/rooms/${roomId ?? ""}`} />;
}
