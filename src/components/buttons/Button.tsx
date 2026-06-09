import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** StyleSheet styles - works with React Native's StyleSheet */
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Tailwind classes - works with NativeWind. Requires NativeWind in your app. */
  className?: string;
  textClassName?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
  className,
  textClassName,
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const variantContainerStyle: ViewStyle = {
    primary: { backgroundColor: theme.colors.primary },
    secondary: { backgroundColor: theme.colors.secondary },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: theme.colors.outline,
    },
    ghost: { backgroundColor: "transparent" },
  }[variant];

  const variantTextColor: TextStyle = {
    primary: { color: theme.colors.onPrimary },
    secondary: { color: theme.colors.onSecondary },
    outline: { color: theme.colors.outline },
    ghost: { color: theme.colors.outline },
  }[variant];

  const spinnerColor =
    variant === "primary" || variant === "secondary"
      ? theme.colors.onPrimary
      : theme.colors.outline;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={isDisabled ? 1 : 0.8}
      style={[
        styles.base,
        { borderRadius: theme.roundness },
        variantContainerStyle,
        isDisabled && styles.disabled,
        style,
      ]}
      className={className}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <Text
          style={[styles.text, variantTextColor, textStyle]}
          className={textClassName}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
