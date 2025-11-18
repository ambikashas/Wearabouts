import ImageListHorizontalScrollDisplay, {
  ImageListRef,
} from "@/components/ImageListHorizontalScrollDisplay";
import { allOutfitItemTypes, typeDisplayNames } from "@/types/outfit";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";

export default function ItemsCloset() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const listRefs = useRef<Record<string, ImageListRef | null>>({});

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all(
      allOutfitItemTypes.map((type) => listRefs.current[type]?.refresh?.())
    );
    setRefreshing(false);
  };

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="pt-2"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                ref={(el) => {
                  listRefs.current[type] = el;
                }}
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
