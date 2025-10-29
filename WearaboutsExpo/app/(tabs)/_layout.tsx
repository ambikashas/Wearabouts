import { brandColors } from "@/constants/colors";
import { Tabs } from "expo-router";
import React from "react";
import {
  HomeIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
} from "react-native-heroicons/solid";
import colors from "tailwindcss/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: brandColors.brandPink,
        headerTintColor: colors.white,
        headerStyle: { backgroundColor: brandColors.brandPink },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <HomeIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-clothes"
        options={{
          title: "Add Clothes",
          tabBarIcon: ({ color }) => <PlusCircleIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          headerShown: false,
          title: "My Closet",
          tabBarIcon: ({ color }) => (
            <ShoppingBagIcon size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
