import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const categorizedOutfits: { [category: string]: string[][] } = {
  Party: [
    [
      "https://via.placeholder.com/100x100?text=Top",
      "https://via.placeholder.com/100x100?text=Bottom",
      "https://via.placeholder.com/100x100?text=Shoes",
    ],
  ],
  Formal: [
    [
      "https://via.placeholder.com/100x100?text=Jacket",
      "https://via.placeholder.com/100x100?text=Jeans",
      "https://via.placeholder.com/100x100?text=Sneakers",
    ],
    [
      "https://via.placeholder.com/100x100?text=Blazer",
      "https://via.placeholder.com/100x100?text=Shirt",
      "https://via.placeholder.com/100x100?text=Heels",
    ],
  ],
  Casual: [],
  Other: [],
};

const SavedOutfitsScreen = () => {
  const [outfitsByCategory, setOutfitsByCategory] =
    useState(categorizedOutfits);

  const handleDelete = (category: string, idx: number) => {
    setOutfitsByCategory((prev) => {
      const updated = { ...prev };
      updated[category] = updated[category].filter((_, i) => i !== idx);
      return updated;
    });
  };

  const renderOutfit =
    (category: string) =>
    ({ item, index }: { item: string[] | undefined; index: number }) => {
      if (!Array.isArray(item)) return null;
      return (
        <View className="mb-6 bg-white rounded-xl p-4 shadow-md shadow-black/10">
          <Text className="mb-2 font-bold text-base">
            Outfit {index + 1} Name
          </Text>
          <View className="flex-row justify-between mb-3">
            {item.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                className="w-20 h-20 rounded-lg mx-1 bg-[#EEE]"
              />
            ))}
          </View>
          <TouchableOpacity
            className="self-end bg-[#fd6cb5] py-[6px] px-4 rounded-lg"
            onPress={() => handleDelete(category, index)}
          >
            <Text className="text-white font-bold">Delete</Text>
          </TouchableOpacity>
        </View>
      );
    };

  return (
    <View className="flex-1 p-4 bg-[#F8F8FF]">
      <View className="h-10" />
      <Text className="mb-4 text-center text-xl font-normal">
        Saved Outfits
      </Text>
      <FlatList
        data={Object.keys(outfitsByCategory)}
        renderItem={({ item: category }) => (
          <View className="mb-8">
            <Text className="mb-2 font-bold text-lg">{category}</Text>
            {outfitsByCategory[category].length === 0 ? (
              <Text>No outfits in this category.</Text>
            ) : (
              <FlatList
                data={outfitsByCategory[category]}
                renderItem={renderOutfit(category)}
                keyExtractor={(_, idx) => idx.toString()}
                contentContainerClassName="py-2"
              />
            )}
          </View>
        )}
        keyExtractor={(category) => category}
        contentContainerClassName="pb-8"
      />
    </View>
  );
};

export default SavedOutfitsScreen;
