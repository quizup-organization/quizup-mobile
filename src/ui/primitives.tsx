import {
  Button,
  Column,
  Host,
  Icon,
  Row,
  Spacer,
  Text,
  TextInput,
} from "@expo/ui";
import type {
  TextInputProps,
  UniversalStyle,
} from "@expo/ui";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { icons, type IconKey } from "./icons";
import { brand, radius, useColors, useScheme, type Colors } from "./theme";

/* -------------------------------------------------------------------------- */
/*  Conteneurs                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Pont React Native → UI native. Un `Block` par bloc de contenu : c'est la
 * granularité qui garde le nombre de vues natives raisonnable.
 */
export function Block({
  children,
  width,
}: {
  children: ReactNode;
  width?: number;
}) {
  const scheme = useScheme();

  return (
    <Host
      matchContents={{ vertical: true }}
      colorScheme={scheme}
      seedColor={brand}
      style={width === undefined ? { width: "100%" } : { width }}
    >
      {children}
    </Host>
  );
}

/** Variante `Block` qui se dimensionne sur son contenu (chips, petites actions). */
export function Inline({ children }: { children: ReactNode }) {
  const scheme = useScheme();

  return (
    <Host matchContents colorScheme={scheme} seedColor={brand}>
      {children}
    </Host>
  );
}

/** Écran : scroll et marges côté React Native, contenu côté Expo UI. */
export function Screen({
  children,
  padded = true,
  horizontalPadding = 20,
  bottomPadding = 104,
}: {
  children: ReactNode;
  padded?: boolean;
  horizontalPadding?: number;
  bottomPadding?: number;
}) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          paddingHorizontal: padded ? horizontalPadding : 0,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + bottomPadding,
          gap: 22,
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

/** Bloc titré (section d'écran). */
export function Section({
  title,
  action,
  children,
}: {
  title?: string;
  action?: string;
  children: ReactNode;
}) {
  return (
    <Block>
      <Column spacing={12}>
        {title ? <SectionTitle title={title} action={action} /> : null}
        {children}
      </Column>
    </Block>
  );
}

/* -------------------------------------------------------------------------- */
/*  Typographie                                                               */
/* -------------------------------------------------------------------------- */

export type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "body"
  | "label"
  | "caption";

export type TextTone =
  | "default"
  | "muted"
  | "accent"
  | "onAccent"
  | "success"
  | "warning"
  | "danger";

const typography = {
  display: { fontSize: 34, fontWeight: "800" },
  title: { fontSize: 26, fontWeight: "700" },
  heading: { fontSize: 20, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  label: { fontSize: 15, fontWeight: "600" },
  caption: { fontSize: 13, fontWeight: "500" },
} as const;

function toneColor(tone: TextTone, c: Colors): string {
  switch (tone) {
    case "muted":
      return c.textMuted;
    case "accent":
      return c.accent;
    case "onAccent":
      return c.onAccent;
    case "success":
      return c.success;
    case "warning":
      return c.warning;
    case "danger":
      return c.danger;
    default:
      return c.text;
  }
}

export function AppText({
  children,
  variant = "body",
  tone = "default",
  align,
  numberOfLines,
}: {
  children: string | number;
  variant?: TextVariant;
  tone?: TextTone;
  align?: "left" | "center" | "right";
  numberOfLines?: number;
}) {
  const c = useColors();

  return (
    <Text
      numberOfLines={numberOfLines}
      textStyle={{
        ...typography[variant],
        color: toneColor(tone, c),
        textAlign: align,
      }}
    >
      {String(children)}
    </Text>
  );
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <Row spacing={8} alignment="center">
      <AppText variant="heading">{title}</AppText>
      <Spacer flexible />
      {action ? (
        <AppText variant="caption" tone="muted">
          {action}
        </AppText>
      ) : null}
    </Row>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contrôles                                                                 */
/* -------------------------------------------------------------------------- */

export function AppButton({
  label,
  onPress,
  variant = "filled",
  disabled,
  style,
  children,
}: {
  label?: string;
  onPress?: () => void;
  variant?: "filled" | "outlined" | "text";
  disabled?: boolean;
  style?: UniversalStyle;
  children?: ReactNode;
}) {
  return (
    <Button
      label={label}
      onPress={onPress}
      variant={variant}
      disabled={disabled}
      style={style}
    >
      {children}
    </Button>
  );
}

/** Champ de saisie universel (SwiftUI TextField / Compose BasicTextField). */
export function AppTextField({
  style,
  textStyle,
  placeholderTextColor,
  ...props
}: TextInputProps) {
  const c = useColors();

  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor ?? c.textMuted}
      style={{
        height: 50,
        paddingHorizontal: 14,
        backgroundColor: c.surface,
        borderColor: c.border,
        borderWidth: 1,
        borderRadius: radius.md,
        ...style,
      }}
      textStyle={{
        fontSize: 16,
        color: c.text,
        ...textStyle,
      }}
    />
  );
}

/** Bouton social avec un badge de marque (G / f) et un libellé. */
export function AppSocialButton({
  label,
  badge,
  badgeColor,
  onPress,
  disabled,
  style,
}: {
  label: string;
  badge: string;
  badgeColor: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: UniversalStyle;
}) {
  const c = useColors();

  return (
    <Button
      variant="outlined"
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      <Row spacing={10} alignment="center">
        <Text
          textStyle={{
            fontSize: 20,
            fontWeight: "800",
            color: badgeColor,
          }}
        >
          {badge}
        </Text>
        <Text
          textStyle={{
            fontSize: 16,
            fontWeight: "600",
            color: c.text,
          }}
        >
          {label}
        </Text>
      </Row>
    </Button>
  );
}

export function AppIcon({
  name,
  size = 18,
  color,
}: {
  name: IconKey;
  size?: number;
  color?: string;
}) {
  const c = useColors();
  return <Icon name={icons[name]} size={size} color={color ?? c.text} />;
}

export function AppChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: IconKey;
  selected?: boolean;
  onPress?: () => void;
}) {
  const c = useColors();

  return (
    <Row
      spacing={6}
      alignment="center"
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: radius.pill,
        backgroundColor: selected ? c.accent : c.surface,
        borderWidth: 1,
        borderColor: selected ? c.accent : c.border,
      }}
    >
      {icon ? (
        <Icon
          name={icons[icon]}
          size={14}
          color={selected ? c.onAccent : c.textMuted}
        />
      ) : null}
      <AppText variant="caption" tone={selected ? "onAccent" : "muted"}>
        {label}
      </AppText>
    </Row>
  );
}

/* -------------------------------------------------------------------------- */
/*  Surfaces                                                                  */
/* -------------------------------------------------------------------------- */

export function AppCard({
  children,
  onPress,
  tone = "surface",
}: {
  children: ReactNode;
  onPress?: () => void;
  tone?: "surface" | "accent" | "alt";
}) {
  const c = useColors();
  const background =
    tone === "accent" ? c.accentSoft : tone === "alt" ? c.surfaceAlt : c.surface;

  return (
    <Column
      spacing={10}
      onPress={onPress}
      style={{
        padding: 16,
        backgroundColor: background,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: c.border,
      }}
    >
      {children}
    </Column>
  );
}

export function AppDivider() {
  const c = useColors();
  return <Column style={{ height: 1, backgroundColor: c.border }} />;
}

/* -------------------------------------------------------------------------- */
/*  Données visuelles                                                         */
/* -------------------------------------------------------------------------- */

export function AppAvatar({
  initials,
  size = 44,
}: {
  initials: string;
  size?: number;
}) {
  const c = useColors();

  return (
    <Row
      alignment="center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: c.accentSoft,
      }}
    >
      <Spacer flexible />
      <Text
        textStyle={{
          fontSize: Math.round(size / 2.8),
          fontWeight: "700",
          color: c.accent,
        }}
      >
        {initials}
      </Text>
      <Spacer flexible />
    </Row>
  );
}

/** Barre de progression composée (Expo UI n'expose pas de Progress universel). */
export function AppBar({ value, width }: { value: number; width: number }) {
  const c = useColors();
  const filled = Math.max(4, Math.round(width * Math.min(1, Math.max(0, value))));

  return (
    <Row
      style={{
        width,
        height: 8,
        borderRadius: 4,
        backgroundColor: c.surfaceAlt,
      }}
    >
      <Column
        style={{
          width: filled,
          height: 8,
          borderRadius: 4,
          backgroundColor: c.accent,
        }}
      />
    </Row>
  );
}

/** Pastille ronde (compteur, indicateur non-lu). */
export function AppDot({ size = 8, tone = "accent" }: { size?: number; tone?: TextTone }) {
  const c = useColors();
  return (
    <Column
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: toneColor(tone, c),
      }}
    />
  );
}

/** Tuile d'icône colorée. */
export function AppIconTile({
  name,
  size = 40,
  background,
  color,
}: {
  name: IconKey;
  size?: number;
  background?: string;
  color?: string;
}) {
  const c = useColors();

  return (
    <Row
      alignment="center"
      style={{
        width: size,
        height: size,
        borderRadius: radius.md,
        backgroundColor: background ?? c.accentSoft,
      }}
    >
      <Spacer flexible />
      <Icon name={icons[name]} size={Math.round(size / 2.2)} color={color ?? c.accent} />
      <Spacer flexible />
    </Row>
  );
}

/** Ligne de liste native : icône + titre + sous-titre + chevron. */
export function AppRow({
  icon,
  title,
  subtitle,
  trailing,
  onPress,
  tileBackground,
  tileColor,
}: {
  icon?: IconKey;
  title: string;
  subtitle?: string;
  trailing?: string;
  onPress?: () => void;
  tileBackground?: string;
  tileColor?: string;
}) {
  const c = useColors();

  return (
    <Row spacing={12} alignment="center" onPress={onPress} style={{ paddingVertical: 10 }}>
      {icon ? (
        <AppIconTile name={icon} background={tileBackground} color={tileColor} />
      ) : null}
      <Column spacing={2}>
        <AppText variant="label" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </Column>
      <Spacer flexible />
      {trailing ? (
        <AppText variant="caption" tone="muted">
          {trailing}
        </AppText>
      ) : null}
      {onPress ? <Icon name={icons.chevron} size={14} color={c.textMuted} /> : null}
    </Row>
  );
}
