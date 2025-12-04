import { brandColors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import GradientBackground from "@/components/GradientBackground";

// Helper: Convert clothing item ID → image_url
async function getImageUrl(id: string) {
  const { data, error } = await supabase
    .from("clothing_items")
    .select("image_url")
    .eq("id", id)
    .single();

  if (error) return null;
  return data?.image_url ?? null;
}

export default function OutfitPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [outfit, setOutfit] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOutfit() {
      const { data, error } = await supabase
        .from("outfits")
        .select("id, name, top, bottom, full, shoes")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        Alert.alert("Error", "Could not load outfit.");
        setLoading(false);
        return;
      }

      setOutfit(data);

      // Convert IDs to image URLs
      const ids = [data.top, data.bottom, data.full, data.shoes].filter(Boolean);

      const urls = await Promise.all(ids.map((itemId) => getImageUrl(itemId)));

      setImages(urls.filter(Boolean) as string[]);
      setLoading(false);
    }

    if (id) fetchOutfit();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert("Delete Outfit", "Are you sure you want to delete this outfit?", [
        { text: "Cancel", style: "cancel" },
        {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
            try {
            const { error } = await supabase
                .from("outfits")
                .delete()
                .eq("id", id);

            if (error) throw error;

            Alert.alert("Deleted", "Outfit successfully deleted.");
            router.back();
            } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete outfit.");
            }
        },
        },
    ]);
    };

  return (
    <>
      {/* Hide default header */}
      <Stack.Screen options={{ headerShown: false }} />

      {loading ? (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color={brandColors.brandPink} />
          <Text className="mt-2 text-gray-600">Loading outfit...</Text>
        </View>
      ) : !outfit ? (
        <View className="flex-1 justify-center items-center bg-white">
          <Text className="text-gray-600 text-lg">Outfit not found.</Text>
        </View>
      ) : (
        <GradientBackground>
            <View className="flex-1 bg-transparent">
            {/* Pink Header Bar */}
            <View
                className="flex-row items-center p-3 pt-3"
                style={{ backgroundColor: brandColors.brandPink }}
            >
                <TouchableOpacity
                onPress={() => router.back()}
                className="p-2 rounded-full mr-2"
                >
                <ChevronLeftIcon color="white" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-white">
                Outfit Details
                </Text>
            </View>

            {/* Main Content */}
            <ScrollView
                className="bg-transparent"
                contentContainerStyle={{
                alignItems: "center",
                paddingVertical: 10,
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text className="text-3xl font-bold mb-4 mt-4">{outfit.name}</Text>

                {/* Display actual image URLs */}
                {images.map((url, i) => (
                <Image
                    key={i}
                    source={{ uri: url }}
                    className="w-52 h-52 rounded-2xl mb-6 shadow-sm"
                    resizeMode="cover"
                />
                ))}

                <TouchableOpacity
                    onPress={handleDelete}
                    activeOpacity={0.7}
                    style={{ backgroundColor: brandColors.brandPink }}
                    className="px-11 py-4 rounded-xl shadow-sm mb-16"
                >
                    <Text className="text-white font-semibold text-xl">Delete Outfit</Text>
                </TouchableOpacity>

            </ScrollView>
            </View>
        </GradientBackground>
      )}
    </>
  );
}
