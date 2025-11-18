import { getClothingItemsPerType } from "@/lib/getClothingItems";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  type: string;
  onPressItem: (id: string) => void;
};

export default function ListVerticalScrollDisplay({
  type,
  onPressItem,
}: Props) {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const LIMIT = 12;

  async function fetchItems(reset = false) {
    if (loading || (!hasMore && !reset)) return;

    if (reset) setRefreshing(true);
    else setLoading(true);

    try {
      const offset = reset ? 0 : page * LIMIT;
      const items = await getClothingItemsPerType(type, offset, LIMIT);

      if (reset) {
        setData(items);
        setPage(1);
        setHasMore(items.length === LIMIT);
      } else {
        if (!items?.length) setHasMore(false);
        else {
          setData((prev) => [...prev, ...items]);
          setPage((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error(`Error fetching ${type} items:`, err);
    } finally {
      if (reset) setRefreshing(false);
      else setLoading(false);
    }
  }

  // refetch when the type changes
  useEffect(() => {
    fetchItems(true);
  }, [type]);

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
          <TouchableOpacity onPress={() => onPressItem(item.id)}>
            <Image
              source={{ uri: item.image_url }}
              className="h-60 w-full rounded-t-lg p-2"
            />
          </TouchableOpacity>
        </View>
      )}
      onEndReached={() => fetchItems(false)}
      onEndReachedThreshold={0.4}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchItems(true)}
        />
      }
      ListFooterComponent={
        loading && !refreshing ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : null
      }
    />
  );
}
