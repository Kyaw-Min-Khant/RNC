import React from "react";
import { Text } from "react-native";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FloatingActionButton } from "./FloatingActionButton";

const meta: Meta<typeof FloatingActionButton> = {
  title: "Components/FloatingActionButton",
  component: FloatingActionButton,
  args: {
    icon: <Text style={{ color: "#fff", fontSize: 20 }}>+</Text>,
    onPress: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ position: "relative", height: 220 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FloatingActionButton>;

export const Simple: Story = {};

export const ExtendedWithLabel: Story = { args: { label: "Create" } };

export const SpeedDial: Story = {
  args: {
    actions: [
      { icon: <Text style={{ color: "#fff" }}>A</Text>, onPress: () => {} },
      { icon: <Text style={{ color: "#fff" }}>B</Text>, onPress: () => {} },
      { icon: <Text style={{ color: "#fff" }}>C</Text>, onPress: () => {} },
    ],
  },
};
