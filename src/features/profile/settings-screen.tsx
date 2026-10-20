import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
  Button,
  Card,
  Chip,
  Input,
  Label,
  Spinner,
  TextField,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";

export function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const update = useUpdateProfile();
  const signOut = useLogout();
  const [background] = useThemeColor(["background"]);

  const [pseudonym, setPseudonym] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState<"fr" | "en">("fr");

  useEffect(() => {
    if (!me.data) return;
    setPseudonym(me.data.pseudonym);
    setBio(me.data.bio ?? "");
    setCountry(me.data.country ?? "");
    setLanguage(me.data.language);
  }, [me.data]);

  if (me.isPending) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: background }}
      >
        <Spinner />
      </View>
    );
  }

  if (!me.data) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 px-6"
        style={{ backgroundColor: background }}
      >
        <Typography type="h5">Impossible de charger le profil</Typography>
        <Button variant="secondary" onPress={() => void me.refetch()}>
          Réessayer
        </Button>
      </View>
    );
  }

  const save = () => {
    if (!pseudonym.trim()) return;
    update.mutate({
      userId: me.data.userId,
      current: me.data,
      values: {
        pseudonym,
        bio,
        country,
        language,
      },
    });
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: background }}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 96,
        gap: 16,
      }}
    >
      <View className="flex-row items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onPress={() => router.back()}
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={20} color="#A0A0A0" />
        </Button>
        <Typography type="h3">Réglages</Typography>
      </View>

      <Card>
        <Card.Body className="gap-5">
          <TextField isRequired>
            <Label>Pseudonyme</Label>
            <Input
              value={pseudonym}
              onChangeText={setPseudonym}
              placeholder="Ton pseudo"
              maxLength={100}
            />
          </TextField>

          <TextField>
            <Label>Bio</Label>
            <Input
              value={bio}
              onChangeText={setBio}
              placeholder="Quelques mots sur toi"
              maxLength={300}
              multiline
              numberOfLines={3}
            />
          </TextField>

          <TextField>
            <Label>Pays</Label>
            <Input
              value={country}
              onChangeText={setCountry}
              placeholder="FR"
              maxLength={100}
            />
          </TextField>

          <View className="gap-2">
            <Typography type="body-sm" weight="semibold">
              Langue du contenu
            </Typography>
            <View className="flex-row gap-2">
              <Chip
                variant={language === "fr" ? "primary" : "secondary"}
                onPress={() => setLanguage("fr")}
              >
                <Chip.Label>Français</Chip.Label>
              </Chip>
              <Chip
                variant={language === "en" ? "primary" : "secondary"}
                onPress={() => setLanguage("en")}
              >
                <Chip.Label>English</Chip.Label>
              </Chip>
            </View>
          </View>

          {update.isError ? (
            <Typography type="body-sm" className="text-danger">
              Enregistrement impossible. Réessaie.
            </Typography>
          ) : null}
          {update.isSuccess ? (
            <Typography type="body-sm" className="text-success">
              Profil enregistré.
            </Typography>
          ) : null}

          <Button
            isDisabled={update.isPending || !pseudonym.trim()}
            onPress={save}
          >
            {update.isPending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </Card.Body>
      </Card>

      <Button variant="outline" onPress={() => void signOut()}>
        Se déconnecter
      </Button>
    </ScrollView>
  );
}
