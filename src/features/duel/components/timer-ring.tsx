import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Typography, useThemeColor } from "heroui-native";

interface TimerRingProps {
  progress: number;
  seconds: number;
  size?: number;
}

/** Anneau de chrono du duel (SVG + tokens HeroUI). */
export function TimerRing({ progress, seconds, size = 72 }: TimerRingProps) {
  const [track, accent] = useThemeColor(["default", "accent"]);
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg
        width={size}
        height={size}
        style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={track}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accent}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - clamped)}
        />
      </Svg>
      <Typography type="h5">{seconds}</Typography>
    </View>
  );
}
