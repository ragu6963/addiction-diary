import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
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
    </>
  );
}
