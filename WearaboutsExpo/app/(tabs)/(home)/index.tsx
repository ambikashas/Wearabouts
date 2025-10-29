import { brandColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <SafeAreaView edges={["top"]} />
      <ScrollView
        className="z-10 px-10"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-around",
        }}
      >
        {/* Welcome card */}
        <View className="w-full rounded-2xl overflow-hidden self-center shadow-md shadow-black/10">
          <Image
            source={require("@/assets/images/dashboard-bg.jpg")}
            className="w-full h-[460px] rounded-2xl opacity-70"
          />

          {/* Overlay */}
          <View className="absolute inset-0 p-5 justify-between">
            <Text className="text-[46px] text-[#35403A] font-semibold font-[Georgia] mt-2">
              Welcome stylist!
            </Text>

            <Text className="text-right text-[#262E26] text-2xl leading-6 mt-44">
              passion{"\n"}personalization{"\n"}productivity
            </Text>

            <View className="flex-row items-center justify-end gap-2">
              <Ionicons name="shirt-outline" size={28} color="#131C16" />
              <Text className="text-[38px] text-[#131C16] font-medium text-right shadow-md">
                Wearabouts
              </Text>
            </View>

            {/* Overlay images */}
            <Image
              source={require("@/assets/images/pink-dress.png")}
              className="absolute top-[55%] left-[42%] w-[170px] h-[170px] opacity-75 z-10 rotate-[8deg] -translate-x-[75px] -translate-y-[75px]"
              resizeMode="contain"
            />
            <Image
              source={require("@/assets/images/blue-dress.png")}
              className="absolute top-[50%] left-[10%] w-[230px] h-[230px] z-10 rotate-[-11deg] -translate-x-[75px] -translate-y-[75px]"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Buttons */}
        <View className="items-center gap-5">
          <Link href="/closet" asChild>
            <Pressable
              className="w-full bg-brandPink py-4 rounded-2xl items-center shadow-sm shadow-black/10"
              onPress={() => Haptics.selectionAsync()}
            >
              <Text className="text-lg text-white font-medium">
                ♡ My Closet
              </Text>
            </Pressable>
          </Link>

          <Link href="./outfit-generation/generate" asChild>
            <Pressable
              className="w-full bg-brandPink py-4 rounded-2xl items-center shadow-sm shadow-black/10"
              onPress={() => Haptics.selectionAsync()}
            >
              <Text className="text-lg text-white font-medium">
                ♡ Create outfit
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
      <LinearGradient
        colors={[brandColors.brandPink, colors.white]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
        }}
      />
    </View>
  );
}
