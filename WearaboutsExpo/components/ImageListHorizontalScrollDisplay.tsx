import { HasImage } from "@/types/outfit";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { neutral } from "tailwindcss/colors";

export default function ListHorizontalScrollDisplay<T extends HasImage>({
  data,
  onPressSeeMore,
  onPressItem,
}: {
  data: T[];
  onPressSeeMore: () => void;
  onPressItem: (id: string) => void;
}) {
  return (
    <View className="h-fit flex">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        contentContainerClassName="p-2"
        renderItem={({ item }) => (
          <View className="bg-white rounded-lg shadow m-2 w-44 flex-col justify-between">
            <TouchableOpacity
              className="p-2"
              onPress={() => onPressItem(item.id)}
            >
              <Image
                source={{ uri: item.image }}
                className="h-56 w-full rounded-t-lg"
              />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View className="bg-neutral-300 rounded-lg shadow m-2 w-44 flex-1">
            <TouchableOpacity
              className="flex-1 items-center justify-center"
              onPress={onPressSeeMore}
            >
              <Text className="text-neutral-400 text-xl font-bold">
                See More
              </Text>

              <ChevronRightIcon
                size={64}
                className="m-4"
                color={neutral[400]}
              />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
