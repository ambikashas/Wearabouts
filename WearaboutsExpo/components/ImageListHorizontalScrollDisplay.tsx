import { getClothingItemsPerType } from "@/lib/getClothingItems";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { neutral } from "tailwindcss/colors";

type Props = {
  type: string;
  onPressSeeMore: () => void;
  onPressItem: (id: string) => void;
};

// Typage pour le ref exposé
export type ImageListRef = {
  refresh: () => void;
};

const ImageListHorizontalScrollDisplay = forwardRef<ImageListRef, Props>(
  ({ type, onPressSeeMore, onPressItem }, ref) => {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const LIMIT = 10;

    const fetchItems = async (isRefresh = false) => {
      if (loading || (!hasMore && !isRefresh)) return;

      if (isRefresh) {
        setRefreshing(true);
        setPage(0);
        setHasMore(true);
        setData([]);
      } else {
        setLoading(true);
      }

      try {
        const nextPage = isRefresh ? 0 : page;
        const items = await getClothingItemsPerType(
          type,
          nextPage * LIMIT,
          LIMIT
        );
        if (!items?.length) setHasMore(false);
        else {
          setData((prev) => (nextPage == 0 ? items : [...prev, ...items]));
          setPage(nextPage + 1);
        }
      } catch (err) {
        console.error(`Error fetching ${type} items:`, err);
      } finally {
        if (isRefresh) setRefreshing(false);
        else setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refresh: () => fetchItems(true),
    }));

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
          keyExtractor={(item) => `${type}-${item.id}`}
          onEndReached={() => fetchItems(false)}
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
);

export default ImageListHorizontalScrollDisplay;
