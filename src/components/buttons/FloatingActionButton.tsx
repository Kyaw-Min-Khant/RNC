import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
  TextStyle,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";

export type FABPosition = "bottom-right" | "bottom-left" | "bottom-center";

export type FABSize = "small" | "medium" | "large";

export interface FABAction {
  icon: React.ReactNode;
  label?: string;
  onPress: () => void;
}

export interface FloatingActionButtonProps {
  /** Main FAB press handler */
  onPress: () => void;
  /** Icon to show (e.g. plus, edit). Use a custom component or Text */
  icon: React.ReactNode;
  /** Optional label below the FAB (extended FAB style) */
  label?: string;
  /** Position on screen */
  position?: FABPosition;
  /** Button size */
  size?: FABSize;
  /** Optional speed-dial actions. When set, main FAB toggles open/close and these show above it */
  actions?: FABAction[];
  /** Background color */
  color?: string;
  /** Icon/label color */
  iconColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  className?: string;
  /** Style for the label text (when label is set) */
  labelStyle?: TextStyle;
}

const SIZE_MAP = { small: 44, medium: 60, large: 68 } as const;

export function FloatingActionButton({
  onPress,
  icon,
  label,
  position = "bottom-right",
  size = "medium",
  actions = [],
  color,
  iconColor,
  disabled = false,
  style,
  labelStyle,
}: FloatingActionButtonProps) {
  const theme = useTheme();
  const resolvedColor = color ?? theme.colors.primary;
  const resolvedIconColor = iconColor ?? theme.colors.onPrimary;
  const [open, setOpen] = useState(false);
  const animValues = useRef(actions.map(() => new Animated.Value(0))).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const isSpeedDial = actions.length > 0;

  const toggleSpeedDial = () => {
    if (!isSpeedDial) {
      onPress();
      return;
    }
    const toValue = open ? 0 : 1;
    setOpen(!open);

    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: open ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
      ...animValues.map((val, i) =>
        Animated.timing(val, {
          toValue,
          duration: 200,
          delay: toValue === 1 ? 100 * i : 0,
          useNativeDriver: true,
        }),
      ),
    ]).start();
  };

  const handleMainPress = () => {
    if (isSpeedDial) toggleSpeedDial();
    else onPress();
  };

  const dim = SIZE_MAP[size];
  const positionStyles = getPositionStyles(position, dim);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={[styles.wrapper, positionStyles]} pointerEvents="box-none">
      {/* Backdrop when speed dial is open - tap outside to close */}
      {isSpeedDial && open && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={toggleSpeedDial}
        />
      )}

      {/* Speed-dial actions (above main FAB) */}
      {isSpeedDial && (
        <View style={[styles.actionsContainer, { bottom: dim + 16 }]}>
          {actions.map((action, index) => {
            const scale = animValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            });
            const translateY = animValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: [(index + 1) * 40, 0],
            });
            return (
              <Animated.View
                key={index}
                style={[
                  styles.actionRow,
                  {
                    opacity: animValues[index],
                    transform: [{ scale }, { translateY }],
                  },
                ]}
              >
                {action.label != null && (
                  <Text
                    style={[styles.actionLabel, labelStyle]}
                    numberOfLines={1}
                  >
                    {action.label}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    action.onPress();
                    toggleSpeedDial();
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.smallFab,
                    {
                      width: dim - 10,
                      height: dim - 10,
                      borderRadius: (dim - 10) / 2,
                      backgroundColor: resolvedColor,
                    },
                  ]}
                >
                  {action.icon}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* Extended FAB with label */}
      {label != null && !isSpeedDial && (
        <TouchableOpacity
          onPress={handleMainPress}
          disabled={disabled}
          activeOpacity={0.8}
          style={[
            styles.extendedFab,
            {
              height: dim,
              borderRadius: dim / 2,
              backgroundColor: resolvedColor,
              paddingLeft: 16,
              paddingRight: 20,
            },
            style,
          ]}
        >
          <View style={styles.extendedContent}>
            {icon}
            <Text
              style={[
                styles.extendedLabel,
                { color: resolvedIconColor },
                labelStyle,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Main FAB (round) */}
      {(!label || isSpeedDial) && (
        <TouchableOpacity
          onPress={handleMainPress}
          disabled={disabled}
          activeOpacity={0.8}
          style={[styles.touchTarget]}
        >
          <Animated.View
            style={[
              styles.fab,
              {
                width: dim,
                height: dim,
                borderRadius: dim / 2,
                backgroundColor: resolvedColor,
                transform: isSpeedDial ? [{ rotate }] : undefined,
              },
              style,
            ]}
          >
            {icon}
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
}

function getPositionStyles(position: FABPosition, dim: number): ViewStyle {
  const base = {
    position: "absolute" as const,
    bottom: 16,
  };
  switch (position) {
    case "bottom-right":
      return { ...base, right: 16 };
    case "bottom-left":
      return { ...base, left: 16 };
    case "bottom-center":
      return { ...base, left: 0, right: 0, alignItems: "center" };
    default:
      return { ...base, right: 16 };
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: -2000,
    left: -2000,
    right: -2000,
    bottom: -2000,
    zIndex: -1,
  },
  touchTarget: {
    padding: 4,
  },
  fab: {
    justifyContent: "center",
    alignItems: "center",
  },
  extendedFab: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  extendedContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  extendedLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionsContainer: {
    position: "absolute",
    left: 7,
    gap: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 14,
    color: "#333",
    maxWidth: 120,
  },
  smallFab: {
    justifyContent: "center",
    alignItems: "center",
  },
});
