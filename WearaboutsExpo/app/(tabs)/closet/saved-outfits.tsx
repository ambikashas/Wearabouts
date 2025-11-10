import { getClothingItemUrl } from "@/lib/getClothingItems";
import { getOutfits } from "@/lib/getOutfits";
import { Outfit } from "@/types/outfit";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function SavedOutfitsScreen() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;

  // Fetch paginated outfits
  const fetchOutfits = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { data, hasMore } = await getOutfits(page, PAGE_SIZE);
      setHasMore(hasMore);
      setOutfits((prev) => [...prev, ...(data as Outfit[])]);
      setPage((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const renderItem = ({ item }: { item: Outfit }) => (
    <OutfitCard outfit={item} />
  );

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={outfits}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        onEndReached={fetchOutfits}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator testID="ActivityIndicator" size="small" />
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
      />
    </View>
  );
}

function OutfitCard({ outfit }: { outfit: Outfit }) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      const ids = outfit.full
        ? [outfit.full, outfit.shoes].filter(Boolean)
        : [outfit.top, outfit.bottom, outfit.shoes].filter(Boolean);

      const urls = await Promise.all(
        ids.map((id) => getClothingItemUrl(id as string))
      );
      setImages(urls.filter(Boolean) as string[]);
      setLoading(false);
    };
    loadImages();
  }, [outfit]);

  return (
    <View testID="OutfitCard" className="bg-white rounded-lg shadow mb-4">
      <View className="p-2 px-4 rounded-xl shadow-md shadow-black/10">
        <Text className="mb-2 font-bold text-base">{outfit.name}</Text>
        <View className="flex-row justify-start gap-4 mb-3">
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            images.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                className="w-20 h-20 rounded-lg bg-[#EEE]"
              />
            ))
          )}
        </View>
      </View>
    </View>
  );
}
