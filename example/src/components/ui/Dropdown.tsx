import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { cn } from "../../lib/cn";

export interface DropdownOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface DropdownProps<T = string> {
  /** Placeholder when no value selected */
  placeholder?: string;
  /** Options to display */
  options: DropdownOption<T>[];
  /** Current selected value (controlled) */
  value?: T | null;
  /** Callback when an option is selected */
  onSelect?: (value: T) => void;
  /** Callback when the selected value changes (same as onSelect, provided for API consistency) */
  onChange?: (value: T) => void;
  /** Disable the trigger */
  disabled?: boolean;
  /** StyleSheet styles */
  style?: ViewStyle;
  dropDownStyle?: ViewStyle;
  menuStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  optionTextStyle?: TextStyle;
  selectedOptionStyle?: ViewStyle;
  selectedOptionTextStyle?: TextStyle;
  placeholderTextColor?: string;
  labelStyle?: TextStyle;

  /** Tailwind classes (NativeWind) */
  className?: string;
  dropDownClassName?: string;
  /** Optional label above the trigger */
  label?: string;
  /** Label Text Style */

  /** Enable search */
  isSearchable?: boolean;
  /** Left Icon */
  dropDownLeftIcon?: React.ReactNode;
  /** Right Icon */
  dropDownRightIcon?: React.ReactNode;

  dropDownPosition?: "top" | "bottom";

  renderItem?: (
    item: DropdownOption<T>,
    meta: { selected: boolean; disabled: boolean },
  ) => React.ReactNode;
}

export function Dropdown<T = string>({
  placeholder = "Select...",
  options,
  value = null,
  onSelect,
  onChange,
  disabled = false,
  style,
  dropDownStyle,
  menuStyle,
  optionStyle,
  optionTextStyle,
  className,
  dropDownClassName,
  label,
  labelStyle,
  isSearchable = true,
  dropDownLeftIcon,
  dropDownRightIcon,
  selectedOptionStyle,
  selectedOptionTextStyle,
  placeholderTextColor,
  dropDownPosition = "bottom",
  renderItem,
}: DropdownProps<T>) {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState({
    width: 0,
    height: 0,
    pageY: 0,
    pageX: 0,
  });

  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  const onTriggerLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    e.target.measureInWindow((x, y) => {
      setTriggerLayout({ width, height, pageX: x, pageY: y });
    });
  }, []);

  const open = useCallback(() => {
    if (!disabled) setIsOpen(true);
  }, [disabled]);

  const close = useCallback(() => setIsOpen(false), []);

  const handleSelect = useCallback(
    (option: DropdownOption<T>) => {
      if (option.disabled) return;
      const newValue = option.value;
      onSelect?.(newValue);
      onChange?.(newValue);
      close();
    },
    [onSelect, onChange, close],
  );

  const dropDownData = searchText
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchText.toLowerCase()),
      )
    : options;

  const MENU_MAX_HEIGHT = 280;
  const menuTop =
    dropDownPosition === "top"
      ? triggerLayout.pageY + triggerLayout.height + 60
      : Math.max(16, triggerLayout.pageY - MENU_MAX_HEIGHT + 50);

  return (
    <View style={[styles.wrapper, style]} className={className}>
      {label ? (
        <Text
          style={[styles.label, labelStyle, { color: theme.colors.onSurface }]}
        >
          {label}
        </Text>
      ) : null}
      <TouchableOpacity
        onLayout={onTriggerLayout}
        onPress={open}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.trigger,
          {
            borderRadius: theme.roundness,
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
          },
          disabled && styles.triggerDisabled,
          dropDownStyle,
        ]}
        className={dropDownClassName}
      >
        {dropDownLeftIcon}
        <Text
          style={[
            styles.triggerText,
            {
              color: selectedOption
                ? theme.colors.onSurface
                : theme.colors.outline,
            },
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        {dropDownRightIcon ? (
          dropDownRightIcon
        ) : (
          <Text style={[styles.chevron, { color: theme.colors.onSurface }]}>
            {isOpen ? "▲" : "▼"}
          </Text>
        )}
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={close}
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable
            style={[
              styles.menu,
              {
                top: menuTop,
                left: triggerLayout.pageX,
                width: triggerLayout.width,
                borderRadius: theme.roundness,
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              },
              menuStyle,
            ]}
            onPress={() => {}}
          >
            {isSearchable && (
              <TextInput
                placeholderTextColor={placeholderTextColor}
                value={searchText}
                onChangeText={setSearchText}
                style={[
                  styles.searchInput,
                  {
                    borderWidth: 1,
                    margin: 5,
                    borderColor: theme.colors.outline,
                  },
                ]}
                placeholder="Search"
              />
            )}

            <ScrollView
              style={styles.scroll}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {dropDownData.map((option) => {
                const selected = option.value === value;
                const disabledOption = !!option.disabled;

                return (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => handleSelect(option)}
                    disabled={disabledOption}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        backgroundColor: selected
                          ? theme.colors.primary
                          : pressed
                            ? "rgba(0,0,0,0.05)"
                            : "transparent",
                      },
                      selected && selectedOptionStyle,
                      disabledOption && styles.optionDisabled,
                      optionStyle,
                    ]}
                  >
                    {renderItem ? (
                      renderItem(option, { selected, disabled: disabledOption })
                    ) : (
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: selected
                              ? theme.colors.onPrimary
                              : disabledOption
                                ? theme.colors.onSurface + "60"
                                : theme.colors.onSurface,
                          },
                          selected && selectedOptionTextStyle,
                          optionTextStyle,
                        ]}
                        numberOfLines={1}
                      >
                        {option.label}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minWidth: 120,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  trigger: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    minHeight: 48,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerText: {
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    fontSize: 10,
    marginLeft: 8,
  },
  backdrop: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    borderWidth: 1,
    maxHeight: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  scroll: {
    maxHeight: 276,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    justifyContent: "center",
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 16,
  },
  searchInput: {
    padding: 10,
  },
});
