import React, { useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { ThemeProvider } from "./theme/ThemeContext";
import { Dropdown } from "./components/ui/Dropdown";
import { Badge } from "./components/ui/Badge";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [dateTimePickerModal, setDateTimePickerModal] = useState(false);
  const [date, setDate] = useState<Date>();
  const options = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
    { label: "Option D", value: "d" },
    { label: "Option E", value: "e" },
    { label: "Option F", value: "f" },
    { label: "Option G", value: "g" },
    { label: "Option H", value: "h" },
    { label: "Option I", value: "i" },
    { label: "Option J", value: "j" },
    { label: "Disabled", value: "k", disabled: true },
  ];
  return (
    <ThemeProvider>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Dropdown dropDownPosition="top" options={options} />

        <Badge style={{ width: 100 }} label="Test" />
      </ScrollView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  buttonRow: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
    color: "#6200ee",
  },
});
