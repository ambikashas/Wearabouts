import { brandColors } from "@/constants/colors";
import { Stack } from "expo-router";
import colors from "tailwindcss/colors";

export default function GenerationLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: brandColors.brandPink },
        headerTintColor: colors.white,
        headerTitleAlign: "center",
        title: "Generate an outfit",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="outfit-generation/generate" />
      <Stack.Screen name="outfit-generation/generated-outfit" />
    </Stack>
  );
}
