import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      "react-native": "react-native-web",
    };
    viteConfig.resolve.extensions = [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ...(viteConfig.resolve.extensions || [
        ".mjs",
        ".js",
        ".mts",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
      ]),
    ];
    // react-native code assumes a `global` identifier exists (Node-style);
    // Vite's browser build doesn't define one by default.
    viteConfig.define = {
      ...viteConfig.define,
      global: "window",
    };
    return viteConfig;
  },
};

export default config;
