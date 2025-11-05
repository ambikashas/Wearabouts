import { getClothingItemsPerType } from "@/lib/getClothingItems";
import { ClothingItem } from "@/lib/outfitGenerator";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { neutral } from "tailwindcss/colors";

type Props = {
  type: string;
  onPressSeeMore: () => void;
  onPressItem: (id: string) => void;
};

export default function ListHorizontalScrollDisplay({
  type,
  onPressSeeMore,
  onPressItem,
}: Props) {
  const [data, setData] = useState<ClothingItem[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  async function fetchItems() {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const items = await getClothingItemsPerType(type, page * LIMIT, LIMIT);
      if (!items?.length) {
        setHasMore(false);
      } else {
        setData((prev) => [...prev, ...items]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error(`Error fetching ${type} items:`, err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

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
                source={{ uri: item.image_url }}
                className="h-56 w-full rounded-t-lg"
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={fetchItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View className="bg-neutral-300 rounded-lg shadow m-2 w-44 flex-1">
            <TouchableOpacity
              className="flex-1 items-center justify-center"
              onPress={onPressSeeMore}
            >
              <Text className="text-neutral-400 text-xl font-bold">
                See More
              </Text>
              <ChevronRightIcon size={64} color={neutral[400]} />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
