import { Icon } from "@expo/ui";

/**
 * Registre d'icônes natif : SF Symbol sur iOS, Material Symbol sur Android.
 * `import()` est réécrit par le plugin Babel d'Expo UI pour ne bundler que la
 * variante utile à la plateforme.
 */
export const icons = {
  home: Icon.select({
    ios: "house.fill",
    android: import("@expo/material-symbols/home.xml"),
  }),
  topics: Icon.select({
    ios: "square.grid.2x2.fill",
    android: import("@expo/material-symbols/explore.xml"),
  }),
  social: Icon.select({
    ios: "person.2.fill",
    android: import("@expo/material-symbols/groups.xml"),
  }),
  notifications: Icon.select({
    ios: "bell.fill",
    android: import("@expo/material-symbols/notifications.xml"),
  }),
  profile: Icon.select({
    ios: "person.crop.circle.fill",
    android: import("@expo/material-symbols/person.xml"),
  }),
  star: Icon.select({
    ios: "star.fill",
    android: import("@expo/material-symbols/star.xml"),
  }),
  fire: Icon.select({
    ios: "flame.fill",
    android: import("@expo/material-symbols/local_fire_department.xml"),
  }),
  bolt: Icon.select({
    ios: "bolt.fill",
    android: import("@expo/material-symbols/bolt.xml"),
  }),
  trophy: Icon.select({
    ios: "crown.fill",
    android: import("@expo/material-symbols/crown.xml"),
  }),
  play: Icon.select({
    ios: "play.fill",
    android: import("@expo/material-symbols/play_arrow.xml"),
  }),
  chevron: Icon.select({
    ios: "chevron.right",
    android: import("@expo/material-symbols/chevron_right.xml"),
  }),
  back: Icon.select({
    ios: "chevron.left",
    android: import("@expo/material-symbols/arrow_back.xml"),
  }),
  game: Icon.select({
    ios: "gamecontroller.fill",
    android: import("@expo/material-symbols/sports_esports.xml"),
  }),
  calendar: Icon.select({
    ios: "calendar",
    android: import("@expo/material-symbols/calendar_month.xml"),
  }),
  trend: Icon.select({
    ios: "chart.line.uptrend.xyaxis",
    android: import("@expo/material-symbols/trending_up.xml"),
  }),
  medal: Icon.select({
    ios: "rosette",
    android: import("@expo/material-symbols/workspace_premium.xml"),
  }),
  chat: Icon.select({
    ios: "bubble.left.fill",
    android: import("@expo/material-symbols/chat_bubble.xml"),
  }),
  settings: Icon.select({
    ios: "gearshape.fill",
    android: import("@expo/material-symbols/settings.xml"),
  }),
  clock: Icon.select({
    ios: "clock.fill",
    android: import("@expo/material-symbols/schedule.xml"),
  }),
  search: Icon.select({
    ios: "magnifyingglass",
    android: import("@expo/material-symbols/search.xml"),
  }),
} as const;

export type IconKey = keyof typeof icons;
