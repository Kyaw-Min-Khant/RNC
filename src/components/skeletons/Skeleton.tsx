import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

export type SkeletonVariant = "rectangular" | "circle";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  /** Diameter for the circle variant. Ignored for "rectangular" */
  size?: number;
  /** Corner radius for the rectangular variant */
  borderRadius?: number;
  color?: string;
}

const DEFAULT_CIRCLE_SIZE = 40;
const DEFAULT_COLOR = "#9c9c9d";

export function Skeleton({
  variant = "rectangular",
  width = "100%",
  height = 16,
  size,
  borderRadius,
  color = DEFAULT_COLOR,
}: SkeletonProps) {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });

  const isCircle = variant === "circle";
  const circleSize = size ?? DEFAULT_CIRCLE_SIZE;

  const dimensionStyle: ViewStyle = isCircle
    ? {
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
      }
    : {
        width,
        height,
        borderRadius: borderRadius ?? theme.roundness,
      };

  return (
    <Animated.View
      style={[styles.base, dimensionStyle, { backgroundColor: color, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
