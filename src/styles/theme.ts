// src/styles/theme.ts
export const lightTheme = {
  colors: {
    primary: "#3498db",
    secondary: "#e74c3c",
    background: "#ffffff",
    text: "#333333",
  },
};

export const darkTheme = {
  colors: {
    primary: "#2980b9",
    secondary: "#c0392b",
    background: "#1e1e1e",
    text: "#ffffff",
  },
};

export type ThemeType = typeof lightTheme;
