import { ThemeProvider, createTheme } from "@rneui/themed";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useColorScheme } from "@/hooks/use-color-scheme";

const lightTheme = createTheme({
  lightColors: {
    primary: "#007AFF",
    secondary: "#ff6b6b",
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
  },
});

const darkTheme = createTheme({
  darkColors: {
    primary: "#007AFF",
    secondary: "#ff6b6b",
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="main"
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="main" />
        <Stack.Screen name="modal" />
      </Stack>
    </ThemeProvider>
  );
}
