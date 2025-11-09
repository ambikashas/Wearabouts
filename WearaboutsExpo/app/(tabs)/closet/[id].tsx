import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { removeClothingItem } from "@/lib/removeClothingItem";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { brandColors } from "@/constants/colors";

export default function ItemPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from("clothing_items")
        .select("id, name, tags, type, image_url")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        Alert.alert("Error", "Could not load clothing item.");
      } else {
        setItem(data);
      }
      setLoading(false);
    }

    if (id) fetchItem();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await removeClothingItem(id);
            Alert.alert("Deleted", "Item successfully deleted.");
            router.back();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete item.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={brandColors.brandPink} />
        <Text className="mt-2 text-gray-600">Loading item...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600 text-lg">Item not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Pink Header Bar */}
      <View
        className="flex-row items-center p-3 pt-11"
        style={{ backgroundColor: brandColors.brandPink }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full mr-2 mt-2">
          <ChevronLeftIcon color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white mt-2">Item Details</Text>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: item.image_url }}
          className="w-72 h-72 rounded-2xl mb-6 shadow-sm"
          resizeMode="cover"
        />

        <Text className="text-3xl font-bold mb-2">{item.name}</Text>
        <Text className="text-gray-600 text-2xl mb-1 capitalize">
          {item.type}
        </Text>
        <Text className="text-gray-400 text-xl mb-6">
          {Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "No tags added"}
        </Text>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDelete}
          activeOpacity={0.7}
          style={{ backgroundColor: brandColors.brandPink }}
          className="px-11 py-4 rounded-xl shadow-sm"
        >
          <Text className="text-white font-semibold text-xl">Delete Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
