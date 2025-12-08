import { brandColors } from "@/constants/colors";
import { Stack } from "expo-router";

export default function GenerationLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: brandColors.brandPink },
        headerTintColor: brandColors.textGreen,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      {/* Dashboard / entry screen */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      {/* Generate Outfit screen */}
      <Stack.Screen
        name="outfit-generation/generate"
        options={{
          title: "Generate an outfit",
          headerTitleAlign: "center",
        }}
      />

      {/* Generated outfit screen */}
      <Stack.Screen
        name="outfit-generation/generated-outfit"
        options={{
          title: "Your outfit",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
