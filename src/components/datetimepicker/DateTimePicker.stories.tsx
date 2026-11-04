import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimePicker } from "./DateTimePicker";

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
};
export default meta;

type Story = StoryObj<typeof DateTimePicker>;

function Controlled(args: React.ComponentProps<typeof DateTimePicker>) {
  const [value, setValue] = useState<Date>(args.value ?? new Date());
  return <DateTimePicker {...args} value={value} onChange={setValue} />;
}

export const DateAndTime: Story = { render: (args) => <Controlled {...args} /> };
export const DateOnly: Story = {
  args: { mode: "date" },
  render: (args) => <Controlled {...args} />,
};
export const TimeOnly12Hour: Story = {
  args: { mode: "time", is24Hour: false },
  render: (args) => <Controlled {...args} />,
};
