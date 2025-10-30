import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export default function AddClothesScreen() {
  const [imageUris, setImageUris] = useState<string[]>([]);
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

  const handleUpload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setImageUris([]);
      setShowSuccess(true);
      setTimeout(() => {
        if (confettiRef.current) {
          (confettiRef.current as any).start();
        }
      }, 100);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
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
        className="w-full mb-4 rounded-2xl bg-brandPink justify-center items-center p-5"
        onPress={pickImages}
      >
        <Text className="text-base text-white">Tap to upload images</Text>
      </TouchableOpacity>

      {/* Selected Images */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row flex-wrap">
          {imageUris.map((uri, index) => (
            <View key={index} className="relative p-1 w-1/4">
              <Image source={{ uri }} className="aspect-square rounded-lg" />
              <TouchableOpacity
                className="absolute top-1 right-1 bg-[#fd6cb5] w-6 h-6 rounded-full justify-center items-center"
                onPress={() => deleteImage(uri)}
              >
                <Text className="text-white font-bold text-sm">X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Upload Button */}
      <View className="items-center pt-4">
        <TouchableOpacity
          className={`w-[150px] py-3 rounded-lg items-center ${
            imageUris.length === 0 || isLoading
              ? "bg-brandPink"
              : "bg-[#FF69B4]"
          }`}
          disabled={imageUris.length === 0 || isLoading}
          onPress={handleUpload}
        >
          <Text className="text-white font-bold text-base">Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal transparent={true} visible={showSuccess} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <Text className="text-2xl font-bold text-white text-center">
            Added to your closet!
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
