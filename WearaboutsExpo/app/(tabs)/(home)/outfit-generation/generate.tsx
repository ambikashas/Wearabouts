import RadioButton from "../../../../components/radio-button";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function GenerateScreen() {
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const options = ["Casual", "Work", "Party", "Formal", "Other"];

  const handleGenerate = () => {
    const event = selectedOption === "Other" ? otherText : selectedOption;
    if (!event.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      router.push({
        pathname: "./generated-outfit",
        params: { eventType: event },
      });
    }, 1200);
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
      {/* Event Type Selection */}
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
            testID={`radio-${option}`}
          />
        ))}

        {selectedOption === "Other" && (
          <TextInput
            className="border-[1.5px] border-[#FFB6C1] rounded-lg p-3 text-base bg-[#FFF0F5] text-[#333] mt-2"
            placeholder="Please specify"
            placeholderTextColor="#888"
            onChangeText={setOtherText}
            value={otherText}
          />
        )}
      </View>

      {/* Bottom Buttons */}
      <View className="absolute bottom-7 left-5 right-5 flex-row justify-between">
        <TouchableOpacity
          className="flex-1 py-3 rounded-lg items-center bg-[#FFC0CB] mx-2"
          onPress={() => router.back()}
          testID="back-button"
        >
          <Text className="text-base font-bold text-white">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg items-center mx-2 ${
            selectedOption || otherText
              ? "bg-[#FF69B4]"
              : "bg-[#FFC0CB] opacity-60"
          }`}
          disabled={!selectedOption && !otherText}
          onPress={handleGenerate}
          testID="generate-button"
        >
          <Text className="text-base font-bold text-white">Generate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
