import ImageListHorizontalScrollDisplay, { ImageListRef } from "@/components/ImageListHorizontalScrollDisplay";
import { allOutfitItemTypes, typeDisplayNames } from "@/types/outfit";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { searchClothingItems } from "@/lib/searchClothingItems";

function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
}: {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        margin: 12,
      }}
    >
      <TextInput
        placeholder="Search clothes..."
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        style={{ fontSize: 16, flex: 1 }}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={{ marginLeft: 8 }}>
          <Text style={{ fontSize: 18, color: "gray" }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ItemsCloset() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null); // null = not searched yet
  const [searching, setSearching] = useState(false);

  const listRefs = useRef<Record<string, ImageListRef | null>>({});

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all(allOutfitItemTypes.map((type) => listRefs.current[type]?.refresh?.()));
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setSearchResults(null); // no search yet
      return;
    }

    setSearching(true);
    const results = await searchClothingItems(searchText);
    setSearchResults(results); // empty array if nothing found
    setSearching(false);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchResults(null); // back to normal list
  };

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="pt-2"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          onSubmit={handleSearch}
          onClear={handleClearSearch}
        />

        {/* SHOW SEARCH RESULTS ONLY IF USER SEARCHED */}
        {searchResults !== null
          ? searchResults.length > 0
            ? searchResults.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="gap-2 flex flex-row p-2 px-4 items-center"
                  onPress={() => router.push({ pathname: "/closet/[id]", params: { id: item.id } })}
                >
                  <Text className="text-xl">{item.name}</Text>
                </TouchableOpacity>
              ))
            : (
                <View style={{ padding: 16 }}>
                  <Text className="text-center text-gray-500 text-lg">
                    No items found
                  </Text>
                </View>
              )
          : allOutfitItemTypes.map((type) => {
              const title = typeDisplayNames[type];
              const onPressSeeMore = () => router.push(`/closet/type?type=${type}`);

              return (
                <React.Fragment key={type}>
                  <TouchableOpacity
                    className="gap-2 flex flex-row p-2 px-4 items-center"
                    onPress={onPressSeeMore}
                  >
                    <Text className="font-bold text-2xl">{title}</Text>
                    <ChevronRightIcon size={24} color="black" />
                  </TouchableOpacity>

                  <ImageListHorizontalScrollDisplay
                    ref={(el) => (listRefs.current[type] = el)}
                    type={type}
                    onPressSeeMore={onPressSeeMore}
                    onPressItem={(id: string) =>
                      router.push({ pathname: "/closet/[id]", params: { id } })
                    }
                  />
                </React.Fragment>
              );
            })}
      </ScrollView>
    </View>
  );
}
