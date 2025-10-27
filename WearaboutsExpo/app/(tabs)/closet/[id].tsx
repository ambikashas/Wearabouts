import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { allOutfitTypes, OutfitItem, OutfitTypes } from "@/types/outfit";
import { mockOutfits } from "@/mock-data/items";
import React from "react";
import ListHorizontalScrollDisplay from "@/components/ImageListHorizontalScrollDisplay";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useRouter } from "expo-router";

export default function ItemPage() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Text>Hi</Text>
    </View>
  );
}
