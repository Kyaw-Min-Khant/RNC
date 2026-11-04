import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: { label: "Email", placeholder: "you@example.com" },
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "filled", "underlined"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Outlined: Story = {};
export const Filled: Story = { args: { variant: "filled" } };
export const Underlined: Story = { args: { variant: "underlined" } };
export const WithError: Story = {
  args: { error: "This field is required" },
};
