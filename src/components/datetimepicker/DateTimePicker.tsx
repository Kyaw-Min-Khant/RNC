import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";

export type DateTimePickerMode = "date" | "time" | "datetime";

type PickerStep = "month" | "day" | "time";

export interface DateTimePickerProps {
  /** Selected date/time. Uncontrolled (defaults to now) when omitted */
  value?: Date | null;
  /** Fires whenever the year, month, day, hour, minute or AM/PM changes */
  onChange?: (date: Date) => void;
  /** Which parts of the date the user can pick. Default "datetime" */
  mode?: DateTimePickerMode;
  minimumDate?: Date;
  maximumDate?: Date;
  /** 24-hour hour wheel instead of 12-hour + AM/PM. Default true */
  is24Hour?: boolean;
  /** Step between selectable minutes. Default 1 */
  minuteInterval?: 1 | 5 | 10 | 15 | 30;
  /** Week starts on Sunday (0) or Monday (1). Default 0 */
  firstDayOfWeek?: 0 | 1;
  /** Accent color for the selected day/month and wheel highlight */
  color?: string;
  style?: ViewStyle;
  className?: string;
}

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_CELL_SIZE = 36;
const WHEEL_ITEM_HEIGHT = 40;
const WHEEL_VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ITEMS;
const WHEEL_PADDING = (WHEEL_HEIGHT - WHEEL_ITEM_HEIGHT) / 2;

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarWeeks(
  year: number,
  month: number,
  firstDayOfWeek: 0 | 1,
) {
  const totalDays = daysInMonth(year, month);
  let startOffset = new Date(year, month, 1).getDay() - firstDayOfWeek;
  if (startOffset < 0) startOffset += 7;

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthDays = daysInMonth(prevYear, prevMonth);

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < startOffset; i++) {
    const day = prevMonthDays - startOffset + 1 + i;
    cells.push({ date: new Date(prevYear, prevMonth, day), inMonth: false });
  }
  for (let day = 1; day <= totalDays; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, inMonth: false });
  }

  const weeks: { date: Date; inMonth: boolean }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

interface WheelColumnProps {
  data: number[];
  selectedValue: number;
  onChange: (value: number) => void;
  formatItem?: (value: number) => string;
  accentColor: string;
  textColor: string;
}

function WheelColumn({
  data,
  selectedValue,
  onChange,
  formatItem,
  accentColor,
  textColor,
}: WheelColumnProps) {
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = Math.max(0, data.indexOf(selectedValue));

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: selectedIndex * WHEEL_ITEM_HEIGHT,
      animated: false,
    });
  }, [selectedIndex]);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.max(
      0,
      Math.min(
        data.length - 1,
        Math.round(e.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT),
      ),
    );
    const value = data[index];
    if (value !== selectedValue) onChange(value);
    scrollRef.current?.scrollTo({
      y: index * WHEEL_ITEM_HEIGHT,
      animated: true,
    });
  };

  return (
    <View style={styles.wheelColumn}>
      <View
        pointerEvents="none"
        style={[
          styles.wheelHighlight,
          { top: WHEEL_PADDING, height: WHEEL_ITEM_HEIGHT, borderColor: accentColor },
        ]}
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={WHEEL_ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: WHEEL_PADDING }}
        onMomentumScrollEnd={handleMomentumEnd}
      >
        {data.map((item) => {
          const isSelected = item === selectedValue;
          return (
            <View key={item} style={styles.wheelItem}>
              <Text
                style={[
                  styles.wheelItemText,
                  {
                    color: isSelected ? accentColor : textColor,
                    fontWeight: isSelected ? "700" : "400",
                  },
                ]}
              >
                {formatItem ? formatItem(item) : String(item).padStart(2, "0")}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function DateTimePicker({
  value,
  onChange,
  mode = "datetime",
  minimumDate,
  maximumDate,
  is24Hour = true,
  minuteInterval = 1,
  firstDayOfWeek = 0,
  color,
  style,
  className,
}: DateTimePickerProps) {
  const theme = useTheme();
  const accentColor = color ?? theme.colors.primary;
  const initial = value ?? new Date();

  const [step, setStep] = useState<PickerStep>(
    mode === "time" ? "time" : "day",
  );
  const [selected, setSelected] = useState<Date>(initial);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useEffect(() => {
    if (!value) return;
    setSelected(value);
    setViewYear(value.getFullYear());
    setViewMonth(value.getMonth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.getTime()]);

  const isDayDisabled = (date: Date) => {
    const time = stripTime(date).getTime();
    if (minimumDate && time < stripTime(minimumDate).getTime()) return true;
    if (maximumDate && time > stripTime(maximumDate).getTime()) return true;
    return false;
  };

  const isMonthDisabled = (year: number, month: number) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    if (maximumDate && first.getTime() > stripTime(maximumDate).getTime())
      return true;
    if (minimumDate && last.getTime() < stripTime(minimumDate).getTime())
      return true;
    return false;
  };

  const commitDay = (date: Date) => {
    const next = new Date(selected);
    next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setSelected(next);
    onChange?.(next);
    if (mode === "datetime") setStep("time");
  };

  const shiftMonth = (delta: number) => {
    let month = viewMonth + delta;
    let year = viewYear;
    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }
    setViewMonth(month);
    setViewYear(year);
  };

  const hourValues = is24Hour
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteValues = Array.from(
    { length: Math.ceil(60 / minuteInterval) },
    (_, i) => i * minuteInterval,
  );

  const isPM = selected.getHours() >= 12;
  const selectedHourDisplay = is24Hour
    ? selected.getHours()
    : (() => {
        const h = selected.getHours() % 12;
        return h === 0 ? 12 : h;
      })();
  const selectedMinuteValue =
    selected.getMinutes() - (selected.getMinutes() % minuteInterval);

  const commitHourDisplay = (hour: number) => {
    const next = new Date(selected);
    if (is24Hour) {
      next.setHours(hour);
    } else {
      const pm = next.getHours() >= 12;
      next.setHours((hour % 12) + (pm ? 12 : 0));
    }
    setSelected(next);
    onChange?.(next);
  };

  const commitMinute = (minute: number) => {
    const next = new Date(selected);
    next.setMinutes(minute);
    setSelected(next);
    onChange?.(next);
  };

  const toggleAmPm = (nextIsPM: boolean) => {
    if (nextIsPM === isPM) return;
    const next = new Date(selected);
    const hours = next.getHours();
    next.setHours(nextIsPM ? hours + 12 : hours - 12);
    setSelected(next);
    onChange?.(next);
  };

  const weeks = useMemo(
    () => buildCalendarWeeks(viewYear, viewMonth, firstDayOfWeek),
    [viewYear, viewMonth, firstDayOfWeek],
  );

  const orderedWeekDays = useMemo(() => {
    const days = [...WEEKDAYS_SHORT];
    return [...days.slice(firstDayOfWeek), ...days.slice(0, firstDayOfWeek)];
  }, [firstDayOfWeek]);

  const monthStep = (
    <View>
      <View style={styles.yearHeader}>
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => setViewYear((y) => y - 1)}
        >
          <Text style={[styles.arrowTxt, { color: accentColor }]}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={[styles.yearTxt, { color: theme.colors.onSurface }]}>
          {viewYear}
        </Text>
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => setViewYear((y) => y + 1)}
        >
          <Text style={[styles.arrowTxt, { color: accentColor }]}>{"›"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.monthGrid}>
        {MONTHS_SHORT.map((name, index) => {
          const isSelected =
            viewYear === selected.getFullYear() && index === selected.getMonth();
          const disabled = isMonthDisabled(viewYear, index);
          return (
            <TouchableOpacity
              key={name}
              disabled={disabled}
              onPress={() => {
                setViewMonth(index);
                setStep("day");
              }}
              style={[
                styles.monthCell,
                isSelected && { backgroundColor: accentColor },
                disabled && styles.disabledCell,
              ]}
            >
              <Text
                style={[
                  styles.monthCellTxt,
                  { color: isSelected ? "#fff" : theme.colors.onSurface },
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const dayStep = (
    <View>
      <View style={styles.monthHeader}>
        <TouchableOpacity style={styles.arrowBtn} onPress={() => shiftMonth(-1)}>
          <Text style={[styles.arrowTxt, { color: accentColor }]}>{"‹"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStep("month")}>
          <Text
            style={[styles.monthHeaderTxt, { color: theme.colors.onSurface }]}
          >
            {MONTHS_LONG[viewMonth]} {viewYear}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.arrowBtn} onPress={() => shiftMonth(1)}>
          <Text style={[styles.arrowTxt, { color: accentColor }]}>{"›"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekRow}>
        {orderedWeekDays.map((w) => (
          <Text
            key={w}
            style={[styles.weekDayTxt, { color: theme.colors.outline }]}
          >
            {w}
          </Text>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map(({ date, inMonth }) => {
            const disabled = !inMonth || isDayDisabled(date);
            const isSelected = isSameDay(date, selected);
            const isToday = isSameDay(date, new Date());
            return (
              <TouchableOpacity
                key={date.toISOString()}
                disabled={disabled}
                onPress={() => commitDay(date)}
                style={[
                  styles.dayCell,
                  isSelected && { backgroundColor: accentColor },
                ]}
              >
                <Text
                  style={[
                    styles.dayCellTxt,
                    {
                      color: isSelected
                        ? "#fff"
                        : inMonth
                          ? theme.colors.onSurface
                          : theme.colors.outline,
                    },
                    isToday &&
                      !isSelected && { color: accentColor, fontWeight: "700" },
                    disabled && styles.disabledCell,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );

  const timeStep = (
    <View style={styles.timeWrap}>
      {mode === "datetime" && (
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => setStep("day")}
        >
          <Text style={[styles.backTxt, { color: accentColor }]}>
            {"‹"} {MONTHS_SHORT[selected.getMonth()]} {selected.getDate()},{" "}
            {selected.getFullYear()}
          </Text>
        </TouchableOpacity>
      )}
      <View style={styles.wheelRow}>
        <WheelColumn
          data={hourValues}
          selectedValue={selectedHourDisplay}
          onChange={commitHourDisplay}
          accentColor={accentColor}
          textColor={theme.colors.onSurface}
        />
        <Text style={[styles.colon, { color: theme.colors.onSurface }]}>
          :
        </Text>
        <WheelColumn
          data={minuteValues}
          selectedValue={selectedMinuteValue}
          onChange={commitMinute}
          accentColor={accentColor}
          textColor={theme.colors.onSurface}
        />
        {!is24Hour && (
          <View style={styles.ampmWrap}>
            <TouchableOpacity
              onPress={() => toggleAmPm(false)}
              style={[
                styles.ampmBtn,
                !isPM && { backgroundColor: accentColor },
              ]}
            >
              <Text
                style={{ color: !isPM ? "#fff" : theme.colors.onSurface }}
              >
                AM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleAmPm(true)}
              style={[styles.ampmBtn, isPM && { backgroundColor: accentColor }]}
            >
              <Text style={{ color: isPM ? "#fff" : theme.colors.onSurface }}>
                PM
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness,
        },
        style,
      ]}
      className={className}
    >
      {step === "month" && monthStep}
      {step === "day" && dayStep}
      {step === "time" && timeStep}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  yearHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  yearTxt: {
    fontSize: 16,
    fontWeight: "700",
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthHeaderTxt: {
    fontSize: 16,
    fontWeight: "700",
  },
  arrowBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  arrowTxt: {
    fontSize: 20,
    fontWeight: "700",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  monthCell: {
    width: "25%",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  monthCellTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  weekDayTxt: {
    width: DAY_CELL_SIZE,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
  dayCell: {
    width: DAY_CELL_SIZE,
    height: DAY_CELL_SIZE,
    borderRadius: DAY_CELL_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellTxt: {
    fontSize: 14,
  },
  disabledCell: {
    opacity: 0.35,
  },
  timeWrap: {
    alignItems: "center",
  },
  backRow: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  backTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
  wheelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wheelColumn: {
    height: WHEEL_HEIGHT,
    width: 60,
  },
  wheelHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  wheelItem: {
    height: WHEEL_ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelItemText: {
    fontSize: 18,
  },
  colon: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 4,
  },
  ampmWrap: {
    marginLeft: 12,
    gap: 6,
  },
  ampmBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
});
