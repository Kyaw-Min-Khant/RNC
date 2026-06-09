import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";

export type InputVariant = "outlined" | "filled" | "underlined";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  className?: string;
}

export function Input({
  label,
  error,
  variant = "outlined",
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  className,
  editable = true,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.error
    : focused
    ? theme.colors.primary
    : theme.colors.outline;

  const containerStyles: ViewStyle[] = [
    variant === "outlined" && {
      borderWidth: 1.5,
      borderColor,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.surface,
    },
    variant === "filled" && {
      borderBottomWidth: 2,
      borderBottomColor: borderColor,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.surface,
    },
    variant === "underlined" && {
      borderBottomWidth: 1.5,
      borderBottomColor: borderColor,
    },
    !editable && { opacity: 0.5 },
  ].filter(Boolean) as ViewStyle[];

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.onSurface }, labelStyle]}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.inputRow, ...containerStyles]}>
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.onSurface },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.outline + "80"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          className={className}
          {...rest}
        />
        {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text style={[styles.error, { color: theme.colors.error }, errorStyle]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
