import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Rectangular: Story = { args: { width: 200, height: 16 } };
export const Circle: Story = { args: { variant: "circle", size: 64 } };
