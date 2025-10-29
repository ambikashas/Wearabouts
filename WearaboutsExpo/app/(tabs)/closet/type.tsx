import ListVerticalScrollDisplay from "@/components/ImageListVerticalScrollDisplay";
import { mockOutfits } from "@/mock-data/items";
import { allOutfitItemTypes } from "@/types/outfit";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ItemsPerType() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();

  const [selected, setSelected] = useState(type);

  const filteredData = mockOutfits.filter(
    (item) => item.type.toLowerCase() === selected.toLowerCase()
  );

  const titleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const dropdownData = allOutfitItemTypes.map((typeItem) => ({
    label: titleCase(typeItem) + "s",
    value: typeItem,
  }));

  return (
    <SafeAreaView edges={["left", "right", "bottom"]}>
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
        data={filteredData}
        onPressItem={(id: string) =>
          router.push({
            pathname: "./[id]",
            params: { id },
          })
        }
      />
    </SafeAreaView>
  );
}
