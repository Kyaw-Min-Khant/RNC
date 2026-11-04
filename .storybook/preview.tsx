import React from "react";
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/theme/ThemeContext";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: 24, maxWidth: 480 }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
