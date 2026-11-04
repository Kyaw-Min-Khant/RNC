import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropdown } from "./Dropdown";

const options = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
  { label: "Disabled", value: "d", disabled: true },
];

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  args: { options, label: "Choose one", placeholder: "Select..." },
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

function Controlled(args: React.ComponentProps<typeof Dropdown>) {
  const [value, setValue] = useState<string | null>(null);
  return <Dropdown {...args} value={value} onSelect={setValue} />;
}

export const Default: Story = { render: (args) => <Controlled {...args} /> };
export const NotSearchable: Story = {
  args: { isSearchable: false },
  render: (args) => <Controlled {...args} />,
};
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Controlled {...args} />,
};
