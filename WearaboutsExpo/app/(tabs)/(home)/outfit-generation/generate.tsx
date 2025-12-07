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
import GradientBackground from "@/components/GradientBackground";

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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No logged-in user");
      
  
      // Call Supabase Edge Function with eventType
      const { data, error } = await supabase.functions.invoke('generate-outfit', {
        body: { 
          userId: user.id,
          eventType: eventType 
        }
      });
  
      if (error) {
        console.error('Edge Function Error:', error);
        Alert.alert("Error", error.message || "Failed to generate outfit");
        return;
      }
  
      if (!data.success || !data.outfits || data.outfits.length === 0) {
        throw new Error("No outfits generated");
      }
  
      // Navigate to generated outfit with first outfit
      const outfit = Array.isArray(data.outfits)
      ? data.outfits[0]
      : data.outfits; // if it's already a single object
    
      router.push({
        pathname: "./generated-outfit",
        params: {
          eventType,
          outfitId: outfit.id,
          aiOutfitName: outfit.name,
          top: outfit.top || "",
          bottom: outfit.bottom || "",
          full: outfit.full || "",
          shoes: outfit.shoes || "",
        },
      });
    } catch (err) {
      console.error("Error generating outfit:", err);
      Alert.alert(
        "Error", 
        "Failed to generate outfit. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <GradientBackground>
      <View className="flex-1 bg-transparent p-5 justify-center items-center">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="mt-2 text-xl text-textGreen">
          Generating outfit...
        </Text>
      </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View className="flex-1 p-5">
        {/* Event Selection */}
        <View className="mt-8">
          <Text className="text-3xl font-semibold text-textGreen mb-3">
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
          className={`flex-1 py-3 rounded-lg items-center mx-2 border-white border-dashed border-2 ${
            selectedOption || otherText ? "bg-[#FF69B4]" : "bg-[#FFC0CB] opacity-60"
          }`}
          disabled={!selectedOption && !otherText}
          onPress={handleGenerate}
        >
          <Text className="text-base font-bold text-textGreen">Generate</Text>
        </TouchableOpacity>
      </View>
    </View>
    </GradientBackground>
  );
}