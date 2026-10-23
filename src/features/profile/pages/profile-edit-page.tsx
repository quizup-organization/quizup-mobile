import { useEffect, useRef, useState } from "react";
import { Stack, useRouter } from "expo-router";

import {
  AppAvatar,
  AppButton,
  AppCard,
  AppChip,
  AppText,
  AppTextField,
  Carousel,
  Column,
  Row,
  Screen,
  Section,
  Spacer,
} from "@/components";
import { useMe } from "@/features/profile/hooks/use-me";
import { useUpdateProfile } from "@/features/player/hooks/use-update-profile";
import type { Language } from "@/features/player/domain/profile";
import {
  AVATAR_BACKGROUNDS,
  AVATAR_STYLES,
  parseAvatarOptions,
} from "@/shared/avatar/dicebear";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";

const COUNTRIES = ["FR", "BE", "CH", "CA", "SN", "JP"];
const LANGUAGES: { id: Language; label: string }[] = [
  { id: "fr", label: "Français" },
  { id: "en", label: "English" },
];

export function ProfileEditPage() {
  const router = useRouter();
  const me = useMe();
  const update = useUpdateProfile(me.data?.userId ?? "");
  const [pseudonym, setPseudonym] = useState(me.data?.pseudonym ?? "");
  const [bio, setBio] = useState(me.data?.bio ?? "");
  const [country, setCountry] = useState<string | null>(
    me.data?.country ?? "FR",
  );
  const [language, setLanguage] = useState<Language>(
    me.data?.language ?? "fr",
  );
  const avatarOptions = parseAvatarOptions(me.data?.avatarOptions);
  const preservedAvatarOptions = avatarOptions ?? {};
  const canUseMicah = Boolean(
    me.data?.premium || me.data?.rewards?.includes("MICAH_AVATAR"),
  );
  const canUsePremiumStyles = Boolean(me.data?.premium);
  const [style, setStyle] = useState(
    typeof avatarOptions?.style === "string"
      ? avatarOptions.style
      : canUseMicah
        ? "micah"
        : "base",
  );
  const [backgroundColor, setBackgroundColor] = useState(
    typeof avatarOptions?.backgroundColor === "string"
      ? avatarOptions.backgroundColor
      : AVATAR_BACKGROUNDS[0],
  );
  const initialized = useRef(false);

  useEffect(() => {
    if (!me.data || initialized.current) return;
    initialized.current = true;
    setPseudonym(me.data.pseudonym ?? "");
    setBio(me.data.bio ?? "");
    setCountry(me.data.country ?? "FR");
    setLanguage(me.data.language);
    const options = parseAvatarOptions(me.data.avatarOptions);
    if (typeof options?.style === "string") {
      setStyle(options.style);
    } else {
      setStyle(canUseMicah ? "micah" : "base");
    }
    if (typeof options?.backgroundColor === "string") {
      setBackgroundColor(options.backgroundColor);
    }
  }, [me.data]);

  if (me.isLoading) {
    return (
      <Screen>
        <LoadingState label="Chargement de ton profil…" />
      </Screen>
    );
  }

  if (me.isError || !me.data) {
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger ton profil."
          onRetry={() => void me.refetch()}
        />
      </Screen>
    );
  }

  function save() {
    if (!me.data || !pseudonym.trim()) return;
    update.mutate(
      {
        pseudonym: pseudonym.trim(),
        bio: bio.trim() || null,
        country,
        language,
        avatarOptions: JSON.stringify({
          ...preservedAvatarOptions,
          style,
          backgroundColor,
        }),
      },
      {
        onSuccess: () => router.back(),
      },
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Mon profil" }} />
      <Screen>
        <Section title="Identité">
          <AppCard>
            <AppText variant="caption" tone="muted">
              Pseudonyme
            </AppText>
            <AppTextField
              defaultValue={pseudonym}
              placeholder="Ton pseudonyme"
              maxLength={100}
              onChangeText={setPseudonym}
            />
            <AppText variant="caption" tone="muted">
              Bio
            </AppText>
            <AppTextField
              defaultValue={bio}
              placeholder="Quelques mots sur toi"
              maxLength={300}
              multiline
              onChangeText={setBio}
              style={{ height: 88 }}
            />
          </AppCard>
        </Section>

        <Section title="Préférences">
          <AppCard>
            <AppText variant="caption" tone="muted">
              Pays
            </AppText>
            <Carousel
              items={COUNTRIES}
              renderItem={(code) => (
                <AppChip
                  label={code}
                  selected={country === code}
                  onPress={() => setCountry(code)}
                />
              )}
            />
            <Spacer />
            <AppText variant="caption" tone="muted">
              Langue
            </AppText>
            <Carousel
              items={LANGUAGES}
              renderItem={(item) => (
                <AppChip
                  label={item.label}
                  selected={language === item.id}
                  onPress={() => setLanguage(item.id)}
                />
              )}
            />
          </AppCard>
        </Section>

        <Section title="Avatar">
          <AppCard>
            <Column alignment="center" spacing={4}>
              <AppAvatar
                name={pseudonym || "Joueur"}
                userId={me.data.userId}
                avatarOptions={JSON.stringify({
                  ...preservedAvatarOptions,
                  style,
                  backgroundColor,
                })}
                size={88}
              />
              <AppText variant="caption" tone="muted">
                Aperçu
              </AppText>
            </Column>
            <AppText variant="caption" tone="muted">
              Style
            </AppText>
            <Carousel
              items={AVATAR_STYLES}
              renderItem={(item) => {
                const locked =
                  item.id === "micah"
                    ? !canUseMicah
                    : item.id === "base"
                      ? false
                      : !canUsePremiumStyles;
                return (
                  <AppChip
                    label={locked ? `${item.label} · verrouillé` : item.label}
                    selected={style === item.id}
                    onPress={locked ? undefined : () => setStyle(item.id)}
                  />
                );
              }}
            />
            {!canUsePremiumStyles || !canUseMicah ? (
              <AppText variant="caption" tone="muted">
                Micah se débloque avec le badge d'assiduité ; Lorelei et
                Notionists sont réservés aux comptes Premium.
              </AppText>
            ) : null}
            <AppText variant="caption" tone="muted">
              Fond
            </AppText>
            <Row spacing={8} alignment="center">
              {AVATAR_BACKGROUNDS.map((color) => (
                <Row
                  key={color}
                  onPress={() => setBackgroundColor(color)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: color,
                    borderWidth: backgroundColor === color ? 3 : 1,
                    borderColor:
                      backgroundColor === color ? "#ffffff" : "#d4d4d8",
                  }}
                />
              ))}
            </Row>
            <AppText variant="caption" tone="muted">
              L'avatar est généré automatiquement depuis ton identité.
            </AppText>
          </AppCard>
        </Section>

        {update.isError ? (
          <AppText variant="caption" tone="danger" align="center">
            Impossible d'enregistrer les modifications.
          </AppText>
        ) : null}

        <AppButton
          label={update.isPending ? "Enregistrement…" : "Enregistrer"}
          disabled={update.isPending || !pseudonym.trim()}
          onPress={save}
        />
        <AppButton
          label="Annuler"
          variant="text"
          disabled={update.isPending}
          onPress={() => router.back()}
        />
      </Screen>
    </>
  );
}
