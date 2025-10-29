import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export default function EventSummaryScreen() {
  const { eventType } = useLocalSearchParams();

  const [outfitName, setOutfitName] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const confettiRef = React.useRef(null);

  const handleSave = () => {
    if (!outfitName.trim()) return;

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);

      setTimeout(() => {
        if (confettiRef.current) {
          (confettiRef.current as any).start();
        }
      }, 100);

      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 3000);
    }, 1500);
  };

  if (isSaving) {
    return (
      <View className="flex-1 p-5 justify-center items-center">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="mt-2 text-base text-brandPink">Saving outfit...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5">
      {/* Header */}
      <View className="mt-12 items-center">
        <Text className="text-2xl font-bold text-brandPink">Event Summary</Text>

        <Text className="text-base text-brandPink mt-4 mb-1">
          Selected Event Type:
        </Text>
        <Text className="text-lg font-semibold text-[#333] mb-5">
          {eventType || "—"}
        </Text>

        <Text className="text-base text-brandPink mb-1">
          Generated Outfit Preview:
        </Text>
        <View className="h-[150px] w-full border-2 border-[#FFB6C1] rounded-xl bg-[#FFF0F5] mb-5" />
        <TextInput
          className="border-1.5 border-[#FFB6C1] rounded-lg p-3 text-base bg-[#FFF0F5] text-[#333] mb-5 w-full"
          onChangeText={setOutfitName}
          value={outfitName}
          placeholder="Name your outfit"
          placeholderTextColor="#666"
        />
      </View>

      {/* Bottom Buttons */}
      <View className="absolute bottom-7 left-5 right-5 flex-row justify-between">
        <TouchableOpacity
          className="flex-1 py-3 rounded-lg items-center bg-[#FFC0CB] mx-2"
          onPress={() => router.push("./generate")}
        >
          <Text className="text-base font-semibold text-[#333]">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 py-3 rounded-lg items-center bg-[#FF69B4] mx-2"
          onPress={handleSave}
        >
          <Text className="text-base font-semibold text-white">Save</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal transparent={true} visible={showSuccess} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <Text className="text-2xl font-bold text-white text-center">
            Outfit Saved!
          </Text>
          {showSuccess && (
            <ConfettiCannon
              ref={confettiRef}
              count={200}
              origin={{ x: -10, y: 0 }}
              autoStart={false}
              fadeOut
              colors={["#FF69B4", "#FFB6C1", "#FFF0F5", "#DB7093"]}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
