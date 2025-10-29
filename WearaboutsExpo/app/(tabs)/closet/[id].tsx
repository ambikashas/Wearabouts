import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function ItemPage() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Text>Hi</Text>
    </View>
  );
}
