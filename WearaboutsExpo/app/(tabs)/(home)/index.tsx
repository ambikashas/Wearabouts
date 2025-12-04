import { brandColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as Location from "expo-location";
import { Alert } from "react-native";


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
          // --- Notifications Button (replaces My Closet button) ---
          <Pressable
            onPress={async () => {
              await Haptics.selectionAsync();

              // Request location permission
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                alert("Permission denied. Unable to show weather alerts.");
                return;
              }

              // Get user location
              const loc = await Location.getCurrentPositionAsync({});
              const lat = loc.coords.latitude;
              const lon = loc.coords.longitude;

              // Fetch weather
              const WEATHER_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

              const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}`;

              const response = await fetch(url);
              const weather = await response.json();
              const weatherType = weather.weather?.[0]?.main ?? "the weather";

              alert(`Hey, watch out for ${weatherType} today!`);
            }}
            className="w-full flex-row items-center bg-brandPink py-4 rounded-2xl px-4 shadow-sm shadow-black/10"
          >
            <Image
              source={require("@/assets/images/anne_hathaway.png")}
              className="w-12 h-12 rounded-full mr-3"
              resizeMode="cover"
            />

            <Text style={{ color: "#0a4030" }} className="text-lg font-medium">
              Enable Notifications
            </Text>
          </Pressable>


          <Link href="./outfit-generation/generate" asChild>
            <Pressable
              className="w-full bg-brandPink py-4 rounded-2xl items-center shadow-sm shadow-black/10"
              onPress={() => Haptics.selectionAsync()}
            >
              <Text style={{ color: "#0a4030" }} className="text-lg font-medium">
                ♡ Create outfit
              </Text>
            </Pressable>
          </Link>

          <Pressable
            onPress={async () => {
              await Haptics.selectionAsync();
              await supabase.auth.signOut();
              router.replace("/(auth)/logout");
            }}
            className="w-full bg-red-500 py-3 rounded-2xl items-center shadow-sm shadow-black/10"
          >
            <Text className="text-lg text-white font-medium">Logout</Text>
          </Pressable>
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
