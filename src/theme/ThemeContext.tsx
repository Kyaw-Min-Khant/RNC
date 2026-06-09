import React, { createContext, useContext } from "react";

export interface RNCTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    success: string;
    warning: string;
    onPrimary: string;
    onSecondary: string;
    onSurface: string;
    outline: string;
  };
  roundness: number;
}

const defaultTheme: RNCTheme = {
  colors: {
    primary: "#6200ee",
    secondary: "#03dac6",
    background: "#ffffff",
    surface: "#f5f5f5",
    error: "#b00020",
    success: "#388e3c",
    warning: "#f57c00",
    onPrimary: "#ffffff",
    onSecondary: "#000000",
    onSurface: "#000000",
    outline: "#6200ee",
  },
  roundness: 8,
};

const ThemeContext = createContext<RNCTheme>(defaultTheme);

export interface ThemeProviderProps {
  theme?: Partial<RNCTheme>;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const mergedTheme: RNCTheme = {
    ...defaultTheme,
    ...theme,
    colors: { ...defaultTheme.colors, ...theme?.colors },
  };

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): RNCTheme {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultTheme;
  }
  return context;
}
