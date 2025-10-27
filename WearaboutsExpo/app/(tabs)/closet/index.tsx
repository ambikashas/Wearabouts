import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { allOutfitTypes, OutfitItem, OutfitTypes } from "@/types/outfit";
import { mockOutfits } from "@/mock-data/items";
import React from "react";
import ListHorizontalScrollDisplay from "@/components/ImageListHorizontalScrollDisplay";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useRouter } from "expo-router";

export default function ItemsCloset() {
  const router = useRouter();

  const titleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="pt-2 bg-white"
      >
        {allOutfitTypes.map((type) => {
          const itemsOfType = mockOutfits.filter((item) => item.type === type);
          if (!itemsOfType.length) return null;

          const title = titleCase(type).concat("s");

          const onPreeSeeMore = () => {
            router.push(`/closet/type?type=${type}`);
          };

          return (
            <React.Fragment key={type}>
              <TouchableOpacity
                className="gap-2 flex flex-row p-2 px-4 items-center"
                onPress={onPreeSeeMore}
              >
                <Text className="font-bold text-2xl">{title}</Text>
                <ChevronRightIcon size={24} color="black" />
              </TouchableOpacity>
              <ListHorizontalScrollDisplay
                data={itemsOfType}
                onPressSeeMore={onPreeSeeMore}
                onPressItem={(id: string) =>
                  router.push({
                    pathname: "./[id]",
                    params: { id: id },
                  })
                }
              />
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
}
