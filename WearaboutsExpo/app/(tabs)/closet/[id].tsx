import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { removeClothingItem } from "@/lib/removeClothingItem";
import { editItemTags } from "@/lib/editTags";
import { ChevronLeftIcon, PencilIcon } from "react-native-heroicons/outline";
import { brandColors } from "@/constants/colors";

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
    setNewTags(Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "");
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
      setItem((prev) => (prev ? { ...prev, tags: tagArray } : prev));
      setIsModalVisible(false);
      Alert.alert("Success", "Tags updated successfully.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update tags.");
    }
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

        {/* Tags with Edit Button */}
        <View className="flex-row items-center mb-6">
          <Text className="text-gray-400 text-xl mr-2">
            {Array.isArray(item?.tags)
              ? item.tags.join(", ")
              : item?.tags || "No tags added"}
          </Text>
          <TouchableOpacity onPress={handleEditTags}>
            <PencilIcon size={20} color={brandColors.brandPink} />
          </TouchableOpacity>
        </View>

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
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
