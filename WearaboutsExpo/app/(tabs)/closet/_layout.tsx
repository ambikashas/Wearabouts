import { brandColors } from "@/constants/colors";
import { Stack, usePathname, useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import colors from "tailwindcss/colors";

export default function ClosetLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: brandColors.brandPink },
        headerTintColor: colors.white,
        headerTitleAlign: "center",
        title: "My Closet",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "slide_from_bottom",
          headerTitle: () => <ClosetHeaderDropdown />,
        }}
      />
      <Stack.Screen
        name="saved-outfits"
        options={{
          animation: "slide_from_bottom",
          headerTitle: () => <ClosetHeaderDropdown />,
        }}
      />
      <Stack.Screen name="type" />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

function ClosetHeaderDropdown() {
  const router = useRouter();
  const pathname = usePathname();

  const dropdownData = [
    { label: "My Closet", value: "/closet" },
    { label: "Saved Outfits", value: "/closet/saved-outfits" },
  ];

  const selected =
    dropdownData.find((d) => d.value === pathname)?.value ?? "/closet";

  return (
    <Dropdown
      data={dropdownData}
      labelField="label"
      valueField="value"
      value={selected}
      onChange={(item) => {
        if (item.value !== pathname) {
          router.replace(item.value);
        }
      }}
      selectedTextStyle={{
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
        color: colors.white,
      }}
      style={{
        width: 200,
        backgroundColor: "transparent",
      }}
      containerStyle={{ justifyContent: "center" }}
      showsVerticalScrollIndicator={false}
      activeColor={brandColors.brandPink}
      renderRightIcon={() => <ChevronDownIcon size={24} color={colors.white} />}
    />
  );
}
