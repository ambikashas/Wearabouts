import { brandColors } from "@/constants/colors";
import { editItemTags } from "@/lib/editTags";
import { removeClothingItem } from "@/lib/removeClothingItem";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import GradientBackground from "@/components/GradientBackground";

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeftIcon, PencilIcon } from "react-native-heroicons/outline";

export default function ItemPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTags, setNewTags] = useState("");

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

  const handleEditTags = () => {
    if (!item) {
      Alert.alert("Not ready", "Item is still loading. Please try again.");
      return;
    }
    setNewTags(
      Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || ""
    );
    setIsModalVisible(true);
  };

  const handleSaveTags = async () => {
    if (!id) return;
    try {
      const tagArray = newTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await editItemTags(id, tagArray);
      setItem((prev: any) => (prev ? { ...prev, tags: tagArray } : prev));
      setIsModalVisible(false);
      Alert.alert("Success", "Tags updated successfully.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update tags.");
    }
  };

  if (loading) {
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center bg-transparent">
          <ActivityIndicator size="large" color={brandColors.brandPink} />
          <Text className="mt-2 text-gray-600">Loading item...</Text>
        </View>
      </GradientBackground>
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
    <GradientBackground>
      <View className="flex-1 bg-transparent">
        {/* Pink Header Bar */}
        <View
          className="flex-row items-center p-3 pt-11 border-b-2 border-white border-dashed"
          style={{ backgroundColor: brandColors.brandPink }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full mr-2 mt-2"
          >
            <ChevronLeftIcon color={brandColors.textGreen} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-textGreen mt-2">Item Details</Text>
        </View>

        {/* Main Content */}
        <ScrollView
          className="bg-transparent"
          contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: item.image_url }}
            className="w-96 h-[450px] rounded-2xl mb-6 shadow-sm"
            resizeMode="cover"
          />

          <Text className="text-3xl font-bold mb-2">{item.name}</Text>
          <Text className="text-gray-600 text-2xl mb-1 capitalize">
            {item.type}
          </Text>

          {/* Tags with Edit Button */}
          <View className="flex flex-row items-center justify-center mb-6 gap-4 w-full px-4">

            <Text className="flex-shrink flex-wrap text-gray-600 text-xl">
              {Array.isArray(item?.tags)
                ? item.tags.join(", ")
                : item?.tags || "No tags added"}
            </Text>
            <TouchableOpacity
              className="flex justify-center items-center"
              onPress={handleEditTags}
            >
              <PencilIcon size={28} color={brandColors.textGreen} />
            </TouchableOpacity>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.7}
            className="px-11 py-4 rounded-xl shadow-sm bg-red-500 border-white border-dashed border-2"
          >
            <Text className="text-white font-semibold text-xl">Delete Item</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Edit Tags Modal */}
        <Modal visible={isModalVisible} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-2xl w-80 shadow-lg">
              <Text className="text-xl font-semibold mb-3 text-center">
                Edit Tags
              </Text>
              <TextInput
                value={newTags}
                onChangeText={setNewTags}
                placeholder="Enter tags separated by commas"
                className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-700"
              />
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveTags}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: brandColors.brandPink }}
                >
                  <Text className="text-textGreen font-semibold">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </GradientBackground>
  );
}
