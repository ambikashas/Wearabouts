import { Text, TouchableOpacity, View } from "react-native";

const RadioButton = ({
  label,
  selected,
  onPress,
  testID
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}) => (
  <TouchableOpacity className="flex-row items-center my-2" onPress={onPress} testID="{testID}">
    <View
      className={`h-6 w-6 rounded-full border-2 mr-2 flex items-center justify-center ${
        selected ? "border-[#0a7ea4]" : "border-gray-500"
      }`}
    >
      {selected && <View className="h-3 w-3 rounded-full bg-[#0a7ea4]" />}
    </View>
    <Text className="text-base text-[#333]">{label}</Text>
  </TouchableOpacity>
);

export default RadioButton;
