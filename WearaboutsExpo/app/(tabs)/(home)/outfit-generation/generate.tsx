import RadioButton from "../../../../components/radio-button";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/lib/supabase";

export default function GenerateScreen() {
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const options = ["Casual", "Work", "Party", "Formal", "Other"];

  const handleGenerate = async () => {
    const eventType = selectedOption === "Other" ? otherText : selectedOption;
    if (!eventType.trim()) return;

    setIsGenerating(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert("Error", "Please log in to generate outfits");
        return;
      }

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-outfit', {
        body: { userId: user.id }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success || !data.outfits || data.outfits.length === 0) {
        throw new Error("No outfits generated");
      }

      // Navigate to generated outfit with first outfit
      const outfit = data.outfits[0];
      router.push({
        pathname: "./generated-outfit",
        params: {
          eventType,
          outfitId: outfit.id,
          outfitName: outfit.name,
          description: outfit.description,
          itemIds: JSON.stringify(outfit.item_ids),
        },
      });
    } catch (err) {
      console.error("Error generating outfit:", err);
      Alert.alert(
        "Error", "Failed to generate outfit. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <View className="flex-1 bg-[#FFE4E1] p-5 justify-center items-center">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="mt-2 text-base text-[#FF69B4]">
          Generating outfit...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5">
      {/* Event Selection */}
      <View className="mt-8">
        <Text className="text-lg font-semibold text-brandPink mb-3">
          Select Event Type
        </Text>

        {options.map((option) => (
          <RadioButton
            key={option}
            label={option}
            selected={selectedOption === option}
            onPress={() => setSelectedOption(option)}
          />
        ))}

        {selectedOption === "Other" && (
          <TextInput
            className="border border-[#FFB6C1] rounded-lg p-3 text-base bg-[#FFF0F5] text-[#333] mt-2"
            placeholder="Please specify"
            onChangeText={setOtherText}
            value={otherText}
          />
        )}
      </View>

      {/* Buttons */}
      <View className="absolute bottom-7 left-5 right-5 flex-row justify-between">
        <TouchableOpacity
          className="flex-1 py-3 rounded-lg items-center bg-[#FFC0CB] mx-2"
          onPress={() => router.back()}
        >
          <Text className="text-base font-bold text-white">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg items-center mx-2 ${
            selectedOption || otherText ? "bg-[#FF69B4]" : "bg-[#FFC0CB] opacity-60"
          }`}
          disabled={!selectedOption && !otherText}
          onPress={handleGenerate}
        >
          <Text className="text-base font-bold text-white">Generate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}