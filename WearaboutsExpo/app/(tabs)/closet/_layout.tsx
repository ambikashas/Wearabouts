import { Stack } from "expo-router";
import colors from "tailwindcss/colors";

export default function ClosetLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.pink[200] },
        headerTintColor: "black",
        headerTitleAlign: "center",
        title: "My Closet",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="type"
        options={{
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
