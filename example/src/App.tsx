import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import {
  Button,
  Dropdown,
  FloatingActionButton,
  Input,
  Badge,
  Skeleton,
  DateTimePicker,
  ThemeProvider,
} from "../../src";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const options = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
    { label: "Disabled", value: "d", disabled: true },
  ];

  return (
    <ThemeProvider>
      <View style={styles.root}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>RNC Component Demo</Text>

          {/* ── Button ── */}
          <Text style={styles.sectionTitle}>Button</Text>
          <View style={styles.buttonRow}>
            <Button
              title="Primary Button"
              onPress={() => {}}
              variant="primary"
            />
          </View>
          <View style={styles.buttonRow}>
            <Button
              title="Secondary Button"
              onPress={() => {}}
              variant="secondary"
            />
          </View>
          <View style={styles.buttonRow}>
            <Button
              title="Outline Button"
              onPress={() => {}}
              variant="outline"
            />
          </View>
          <View style={styles.buttonRow}>
            <Button title="Ghost Button" onPress={() => {}} variant="ghost" />
          </View>
          <View style={styles.buttonRow}>
            <Button
              title={loading ? "Loading..." : "Loading State"}
              onPress={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 2000);
              }}
              loading={loading}
            />
          </View>
          <View style={styles.buttonRow}>
            <Button title="Disabled" onPress={() => {}} disabled />
          </View>

          {/* ── Dropdown ── */}
          <Text style={styles.sectionTitle}>Dropdown</Text>
          <Dropdown
            dropDownRightIcon={
              <Entypo name="chevron-small-down" size={24} color="black" />
            }
            dropDownLeftIcon={
              <MaterialIcons name="email" size={20} color="#00000090" />
            }
            placeholder="Choose one"
            options={options}
            value={selected}
            isSearchable
            onSelect={setSelected}
            label="Custom Dropdown"
          />

          {/* ── Input ── */}
          <Text style={styles.sectionTitle}>Input</Text>
          <View style={styles.buttonRow}>
            <Input label="Outlined (default)" placeholder="Type something..." />
          </View>
          <View style={styles.buttonRow}>
            <Input
              label="Filled"
              variant="filled"
              placeholder="Filled style..."
            />
          </View>
          <View style={styles.buttonRow}>
            <Input
              label="Underlined"
              variant="underlined"
              placeholder="Underlined style..."
            />
          </View>
          <View style={styles.buttonRow}>
            <Input
              label="With error"
              placeholder="Bad value"
              error="This field is required"
            />
          </View>
          <View style={styles.buttonRow}>
            <Input
              label="With icons"
              placeholder="Search..."
              leftIcon={
                <MaterialIcons name="search" size={20} color="#6200ee" />
              }
              rightIcon={<Feather name="x" size={18} color="#999" />}
            />
          </View>

          {/* ── Badge ── */}
          <Text style={styles.sectionTitle}>Badge</Text>
          <View style={styles.badgeRow}>
            <Badge label="Primary" color="primary" />
            <Badge label="Secondary" color="secondary" />
            <Badge label="Error" color="error" />
            <Badge label="Success" color="success" />
            <Badge label="Warning" color="warning" />
          </View>
          <View style={styles.badgeRow}>
            <Badge label="Outline" color="primary" variant="outline" />
            <Badge count={5} color="error" />
            <Badge count={120} maxCount={99} color="primary" />
            <Badge label="Large" color="secondary" size="large" />
          </View>

          {/* ── Skeleton ── */}
          <Text style={styles.sectionTitle}>Skeleton</Text>
          <View style={styles.buttonRow}>
            <Skeleton width="60%" height={16} />
          </View>
          <View style={styles.buttonRow}>
            <Skeleton variant="circle" size={64} />
          </View>

          {/* ── DateTimePicker ── */}
          <Text style={styles.sectionTitle}>DateTimePicker</Text>
          <Text style={styles.selectedValue}>{date.toString()}</Text>
          <DateTimePicker value={date} onChange={setDate} />

          {/* ── FloatingActionButton ── */}
          <Text style={styles.sectionTitle}>FloatingActionButton</Text>
          <Text style={styles.selectedValue}>
            Floats fixed at the bottom of the screen — scroll down to see it
            stay in place.
          </Text>
        </ScrollView>
        <FloatingActionButton
          onPress={() => {}}
          icon={<Feather name="plus" color="#fff" size={30} />}
          actions={[
            {
              icon: <Feather name="user-plus" size={18} color="white" />,
              onPress: () => {},
            },
            {
              icon: (
                <MaterialCommunityIcons
                  name="camera-plus"
                  size={18}
                  color="#fff"
                />
              ),
              onPress: () => {},
            },
            {
              icon: <Octicons name="search" size={18} color="#fff" />,
              onPress: () => {},
            },
          ]}
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  selectedValue: {
    fontSize: 14,
    marginBottom: 12,
    color: "#444",
  },
});
