import ListVerticalScrollDisplay from "@/components/ImageListVerticalScrollDisplay";
import { allOutfitItemTypes, typeDisplayNames } from "@/types/outfit";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { ChevronDownIcon } from "react-native-heroicons/outline";

export default function ItemsPerType() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();

  const [selected, setSelected] = useState(type ?? "top");

  const dropdownData = allOutfitItemTypes.map((typeItem) => ({
    label: typeDisplayNames[typeItem],
    value: typeItem,
  }));

  return (
    <View className="flex-1">
      <View className="px-4 py-3">
        <Dropdown
          data={dropdownData}
          labelField="label"
          valueField="value"
          value={selected}
          onChange={(item) => setSelected(item.value)}
          selectedTextStyle={{
            fontWeight: "bold",
            fontSize: 22,
            textAlign: "center",
          }}
          containerStyle={{ justifyContent: "center" }}
          showsVerticalScrollIndicator={false}
          activeColor="#FBCFE8"
          renderRightIcon={() => <ChevronDownIcon size={24} />}
        />
      </View>
      <ListVerticalScrollDisplay
        type={selected}
        onPressItem={(id: string) =>
          router.push({
            pathname: "/closet/[id]",
            params: { id },
          })
        }
      />
    </View>
  );
}
