import { brandColors } from "@/constants/colors";
import { Stack } from "expo-router";
import colors from "tailwindcss/colors";

export default function ClosetLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: brandColors.brandPink },
        headerTintColor: colors.white,
        headerTitleAlign: "center",
        title: "My Closet",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="type" />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
