import ImageListHorizontalScrollDisplay from "@/components/ImageListHorizontalScrollDisplay";
import { allOutfitItemTypes, typeDisplayNames } from "@/types/outfit";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";

export default function ItemsCloset() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="pt-2">
        {allOutfitItemTypes.map((type) => {
          const title = typeDisplayNames[type];

          const onPressSeeMore = () => {
            router.push(`/closet/type?type=${type}`);
          };

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
                type={type}
                onPressSeeMore={onPressSeeMore}
                onPressItem={(id: string) =>
                  router.push({
                    pathname: "/closet/[id]",
                    params: { id },
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
