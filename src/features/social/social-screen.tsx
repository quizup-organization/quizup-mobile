import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, Typography, useThemeColor } from "heroui-native";

export function SocialScreen() {
  const insets = useSafeAreaInsets();
  const [background] = useThemeColor(["background"]);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: background }}
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 96,
        gap: 16,
      }}
    >
      <Typography type="h1">Social</Typography>
      <Typography type="body-sm" color="muted">
        Tes abonnements, tes abonnés, tes défis et tes salons.
      </Typography>
      <Card className="mt-4">
        <Card.Body className="items-center gap-3 py-12">
          <Typography type="h5">Bientôt disponible</Typography>
          <Typography type="body-sm" color="muted" align="center">
            Cet espace sera branché sur le social QuizUp dans le prochain lot.
          </Typography>
        </Card.Body>
      </Card>
      <View />
    </ScrollView>
  );
}
