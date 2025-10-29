import { HasImage } from "@/types/outfit";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListVerticalScrollDisplay<T extends HasImage>({
  data,
  onPressItem,
}: {
  data: T[];
  onPressItem: (id: string) => void;
}) {
  return (
    <FlatList
      data={data}
      numColumns={2}
      className="mb-4"
      keyExtractor={(item) => item.id}
      columnWrapperClassName="gap-4 px-4"
      contentContainerClassName="gap-4 py-2"
      renderItem={({ item }) => (
        <View className="bg-white rounded-lg shadow flex-1">
          <Image
            source={{ uri: item.image }}
            className="h-60 w-full rounded-t-lg p-2"
          />
        </View>
      )}
    />
  );
}
