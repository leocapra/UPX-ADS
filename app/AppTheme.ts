import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const greenTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0a7d42",
    onPrimary: "#ffffff",
    primaryContainer: "#a5d6a7",
    secondary: "#2e7d32",
    background: "#f8f9fa",
    surface: "#ffffff",
    surfaceVariant: "#e8f5e9",
  },
  roundness: 8,
};
