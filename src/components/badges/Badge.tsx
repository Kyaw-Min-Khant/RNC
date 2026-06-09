import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { useTheme, RNCTheme } from "../../theme/ThemeContext";

export type BadgeVariant = "filled" | "outline";
export type BadgeColor = "primary" | "secondary" | "error" | "success" | "warning";

export interface BadgeProps {
  label?: string;
  count?: number;
  /** Truncates count above this value, e.g. maxCount={99} shows "99+" */
  maxCount?: number;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string;
}

const SIZE_MAP = {
  small: { paddingH: 6, paddingV: 2, fontSize: 10, minWidth: 18, height: 18 },
  medium: { paddingH: 8, paddingV: 3, fontSize: 12, minWidth: 22, height: 22 },
  large: { paddingH: 10, paddingV: 4, fontSize: 14, minWidth: 26, height: 26 },
};

function resolveColor(color: BadgeColor, theme: RNCTheme) {
  switch (color) {
    case "primary":
      return { bg: theme.colors.primary, text: theme.colors.onPrimary };
    case "secondary":
      return { bg: theme.colors.secondary, text: theme.colors.onSecondary };
    case "error":
      return { bg: theme.colors.error, text: theme.colors.onPrimary };
    case "success":
      return { bg: theme.colors.success, text: "#ffffff" };
    case "warning":
      return { bg: theme.colors.warning, text: "#ffffff" };
  }
}

export function Badge({
  label,
  count,
  maxCount = 99,
  variant = "filled",
  color = "primary",
  size = "medium",
  style,
  textStyle,
}: BadgeProps) {
  const theme = useTheme();
  const palette = resolveColor(color, theme);
  const sizing = SIZE_MAP[size];

  const displayText =
    count !== undefined
      ? count > maxCount
        ? `${maxCount}+`
        : String(count)
      : (label ?? "");

  const containerStyle: ViewStyle = {
    borderRadius: sizing.height / 2,
    minWidth: sizing.minWidth,
    height: sizing.height,
    paddingHorizontal: sizing.paddingH,
    paddingVertical: sizing.paddingV,
    backgroundColor: variant === "filled" ? palette.bg : "transparent",
    borderWidth: variant === "outline" ? 1.5 : 0,
    borderColor: palette.bg,
  };

  const labelColor = variant === "filled" ? palette.text : palette.bg;

  return (
    <View style={[styles.badge, containerStyle, style]}>
      <Text
        style={[styles.text, { fontSize: sizing.fontSize, color: labelColor }, textStyle]}
        numberOfLines={1}
      >
        {displayText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
});
