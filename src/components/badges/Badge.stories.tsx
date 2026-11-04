import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: { label: "New", color: "primary" },
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "error", "success", "warning"],
    },
    variant: { control: "select", options: ["filled", "outline"] },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Label: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Count: Story = {
  args: { label: undefined, count: 5, color: "error" },
};
export const CountOverflow: Story = {
  args: { label: undefined, count: 120, maxCount: 99 },
};
export const Large: Story = { args: { size: "large" } };
