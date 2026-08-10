import React, { useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import {
  Button,
  Dropdown,
  FloatingActionButton,
  Input,
  Badge,
  Skeleton,
  DateTimePicker,
} from "../../src";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* <Text style={styles.title}>RNC Component Demo</Text>
      <View style={styles.buttonRow}>
        <Button
          title="Primary Button"
          onPress={() => console.log("Primary pressed")}
          variant="primary"
        />
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="Secondary Button"
          onPress={() => console.log("Secondary pressed")}
          variant="secondary"
        />
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="Outline Button"
          onPress={() => console.log("Outline pressed")}
          variant="outline"
        />
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="Ghost Button"
          onPress={() => console.log("Ghost pressed")}
          variant="ghost"
        />
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="With StyleSheet"
          onPress={() => {}}
          style={{ backgroundColor: "#ff6b6b" }}
          textStyle={{ fontSize: 18 }}
        />
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
      </View> */}

      {/* <Dropdown
        dropDownRightIcon={
          <Entypo name="chevron-small-down" size={24} color="black" />
        }
        renderItem={(item) => <Text>{item.label}</Text>}
        dropDownLeftIcon={
          <MaterialIcons name="email" size={20} color="#00000090" />
        }
        selectedOptionStyle={{ backgroundColor: "red" }}
        labelStyle={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}
        placeholder="Choose one"
        options={options}
        value={selected}
        isSearchable={true}
        onSelect={setSelected}
        label="Custom Dropdown"
        placeholderTextColor="#000000"
      /> */}
      {/* ── Input ── */}
      {/* <Text style={styles.sectionTitle}>Input</Text>
      <View style={styles.buttonRow}>
        <Input label="Outlined (default)" placeholder="Type something..." />
      </View>
      <View style={styles.buttonRow}>
        <Input label="Filled" variant="filled" placeholder="Filled style..." />
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
          leftIcon={<MaterialIcons name="search" size={20} color="#6200ee" />}
          rightIcon={<Feather name="x" size={18} color="#999" />}
        />
      </View> */}

      {/* ── Badge ── */}
      {/* <Text style={styles.sectionTitle}>Badge</Text>
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
      </View> */}
      {/* <FloatingActionButton
        onPress={() => console.log("FAB pressed")}
        icon={<Feather name="plus" color={"#fff"} size={30} />}
        actions={[
          {
            icon: <Feather name="user-plus" size={18} color="white" />,
            onPress: () => console.log("Add pressed"),
          },
          {
            icon: (
              <MaterialCommunityIcons
                name="camera-plus"
                size={18}
                color="#fff"
              />
            ),
            onPress: () => console.log("Add pressed"),
          },
          {
            icon: <Octicons name="search" size={18} color="#fff" />,
            onPress: () => console.log("Add pressed"),
          },
        ]}
      /> */}
      <Text
        style={{
          fontSize: 24,
        }}
      >
        {date?.toLocaleDateString()}
      </Text>
      <Button
        onPress={() => setDateTimePickerModal(true)}
        title="Date Picker"
      />

      {dateTimePickerModal && (
        <DateTimePicker
          onChange={(e) => {
            setDate(e);
            setDateTimePickerModal(false);
          }}
          mode="time"
        />
      )}

      {/* <Skeleton variant="circle" size={100} /> */}
      {/* <Skeleton height={200} /> */}
    </ScrollView>
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
