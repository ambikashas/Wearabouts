import { getClothingItemUrl } from "@/lib/getClothingItems";
import { uploadGeneratedOutfit } from "@/lib/uploadOutfits";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export default function GeneratedOutfitScreen() {
  const { eventType, top, bottom, full, shoes, aiOutfitName } = useLocalSearchParams();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const aiOutfitNameStr = Array.isArray(aiOutfitName) ? aiOutfitName[0] : aiOutfitName;
  const [outfitName, setOutfitName] = useState(aiOutfitNameStr || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const confettiRef = useRef(null);

  useEffect(() => {
    const loadImages = async () => {
      const ids = full ? [full, shoes].filter(Boolean) : [top, bottom, shoes].filter(Boolean);
      const urls = await Promise.all(ids.map((id) => getClothingItemUrl(id as string)));
      setImageUrls(urls.filter(Boolean) as string[]);
    };
    loadImages();
  }, [top, bottom, full, shoes]);

  const handleSave = async () => {
    if (!outfitName.trim()) return;
    setIsSaving(true);

    try {
      await uploadGeneratedOutfit({
        name: outfitName,
        event_type: eventType as string,
        top: top as string,
        bottom: bottom as string,
        full: full as string,
        shoes: shoes as string,
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving outfit:", err);
      alert("Failed to save outfit. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="mt-2 text-base text-brandPink">Saving outfit...</Text>
      </View>
    );
  }

  if (confettiRef.current) {
    (confettiRef.current as any).start();
  }

  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-bold text-brandPink text-center mt-10">
        Event Summary
      </Text>
      <Text className="text-base text-brandPink mt-4 text-center">
        Event Type: {eventType || "—"}
      </Text>

      {/* Outfit Preview */}
      <View className="flex-row justify-center flex-wrap mt-6">
        {imageUrls.length === 0 ? (
          <ActivityIndicator size="small" />
        ) : (
          imageUrls.map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              className="w-28 h-28 rounded-lg mx-2 mb-2 bg-[#EEE]"
              resizeMode="cover"
            />
          ))
        )}
      </View>


      <TextInput
        className="border border-[#FFB6C1] rounded-lg p-3 text-base bg-[#FFF0F5] text-[#333] mt-5"
        placeholder="Name your outfit"
        placeholderTextColor="#666"
        onChangeText={setOutfitName}
        value={outfitName}
      />

      {/* Buttons */}
      <View className="absolute bottom-7 left-5 right-5 flex-row justify-between">
        <TouchableOpacity
          className="flex-1 py-3 rounded-lg items-center bg-[#FF69B4] mx-2"
          onPress={handleSave}
        >
          <Text className="text-base font-semibold text-white">Save</Text>
        </TouchableOpacity>
      </View>

      {/* Success modal */}
      <Modal transparent={true} visible={showSuccess} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <Text className="text-2xl font-bold text-white">Outfit Saved!</Text>
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{ x: -10, y: 0 }}
            autoStart={true}
            fadeOut
            colors={["#FF69B4", "#FFB6C1", "#FFF0F5", "#DB7093"]}
          />
        </View>
      </Modal>
    </View>
  );
}
