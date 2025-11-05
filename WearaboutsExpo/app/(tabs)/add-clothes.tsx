import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ConfettiCannon from "react-native-confetti-cannon";
import { uploadClothingItem } from "@/lib/uploadClothingItem";

export default function AddClothesScreen() {
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [itemName, setItemName] = useState("");
  const [tags, setTags] = useState("");
  const [type, setType] = useState<"top" | "bottom" | "full" | "shoes" | "">(""); // ← NEW
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const confettiRef = useRef(null);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setImageUris((prevUris) => [...prevUris, ...selectedUris]);
    }
  };

  const deleteImage = (uri: string) => {
    setImageUris((prevUris) => prevUris.filter((item) => item !== uri));
  };

  const handleUpload = async () => {
    if (imageUris.length === 0 || !type) return;
    setIsLoading(true);

    try {
      const tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);

      for (const uri of imageUris) {
        await uploadClothingItem(uri, itemName || "Unnamed", tagsArray, type); // ← send type
      }

      setImageUris([]);
      setItemName("");
      setTags("");
      setType("");
      setShowSuccess(true);
      (confettiRef.current as any)?.start();

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed — see console for details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text className="mt-2 text-base text-brandPink">Uploading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      {/* Upload Area */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="w-full mb-4 rounded-2xl bg-brandPink justify-center items-center p-8 shadow-sm shadow-black/10"
        onPress={pickImages}
      >
        <Text className="text-base text-white">Tap to upload images</Text>
      </TouchableOpacity>

      {/* Item Name Input */}
      <TextInput
        placeholder="Item name"
        value={itemName}
        onChangeText={setItemName}
        className="border border-gray-300 rounded-lg p-3 mb-3 text-base bg-white"
      />

      {/* Tags Input */}
      <TextInput
        placeholder="Tags (comma-separated)"
        value={tags}
        onChangeText={setTags}
        className="border border-gray-300 rounded-lg p-3 mb-4 text-base bg-white"
      />

      {/* Type Dropdown */}
      <View className="border border-gray-300 rounded-lg mb-4 bg-white">
        <Picker
          testID="picker-type"
          selectedValue={type}
          onValueChange={(value) => setType(value)}
        >
          <Picker.Item label="Select Type..." value="" />
          <Picker.Item label="Top" value="top" />
          <Picker.Item label="Bottom" value="bottom" />
          <Picker.Item label="Full (dress, jumpsuit, etc.)" value="full" />
          <Picker.Item label="Shoes" value="shoes" />
        </Picker>
      </View>

      {/* Selected Images */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row flex-wrap">
          {imageUris.map((uri, index) => (
            <View key={index} className="relative p-1 w-1/4">
              <Image source={{ uri }} className="aspect-square rounded-lg" />
              <TouchableOpacity
                activeOpacity={0.7}
                className="absolute top-1 right-1 bg-[#fd6cb5] w-6 h-6 rounded-full justify-center items-center"
                onPress={() => deleteImage(uri)}
              >
                <Text className="text-white font-bold text-sm">X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Upload Button */}
      <View className="items-center pt-4">
        <TouchableOpacity
          activeOpacity={0.7}
          className={`w-[150px] py-3 rounded-lg items-center ${
            imageUris.length === 0 || isLoading || !type
              ? "bg-brandPink"
              : "bg-[#FF69B4]"
          }`}
          disabled={imageUris.length === 0 || isLoading || !type}
          onPress={handleUpload}
        >
          <Text className="text-white font-bold text-base">Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal transparent={true} visible={showSuccess} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <Text className="text-2xl font-bold text-white text-center mb-2">
            Added to your closet!
          </Text>
          {showSuccess && (
            <ConfettiCannon
              ref={confettiRef}
              count={200}
              origin={{ x: -10, y: 0 }}
              autoStart={true}        // <-- changed from false to true
              fadeOut
              colors={["#FF69B4", "#FFB6C1", "#FFF0F5", "#DB7093"]}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}