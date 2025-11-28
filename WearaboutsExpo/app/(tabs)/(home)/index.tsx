import { brandColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { ScrollView, Text, View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import WeatherNotification from "@/components/WeatherNotification";

export default function HomeScreen() {
  return (
    <View className="flex-1">
      {/* Gradient Background */}
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
          zIndex: -2,
        }}
      />

      <SafeAreaView edges={["top"]} />

      {/* Weather Notification */}
      <WeatherNotification />

      <ScrollView
        className="z-10 px-10"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 15,
        }}
      >
        {/* Background Image Container */}
        <View className="relative mb-10">
          <Image
            source={require("@/assets/images/dashboard-bg.jpg")}
            style={{
              width: 300,
              height: 300,
              borderRadius: 30,
              opacity: 0.95,
            }}
          />

          {/* Heel Icon (top-left, rotated, fully inside) */}
          <Image
            source={require("@/assets/images/heel.png")}
            style={{
              width: 70,
              height: 70,
              position: "absolute",
              top: 25,
              left: 25,
              transform: [{ rotate: "-25deg" }],
              opacity: 0.9,
            }}
            resizeMode="contain"
          />

          {/* Lips Icon (bottom-right, rotated, visible) */}
          <Image
            source={require("@/assets/images/lips.png")}
            style={{
              width: 80,
              height: 80,
              position: "absolute",
              bottom: 25,
              right: 25,
              transform: [{ rotate: "20deg" }],
              opacity: 0.9,
            }}
            resizeMode="contain"
          />

          {/* Title Overlay */}
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              transform: [{ translateY: -36 }],
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "BodoniModa",
                fontSize: 38,
                fontWeight: "900",
                color: "#800000",
                textAlign: "center",
                textShadowColor: "rgba(0,0,0,0.25)",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Welcome stylist!
            </Text>

            <Text
              style={{
                fontFamily: "BodoniModa",
                fontSize: 38,
                fontWeight: "900",
                color: "#800000",
                textAlign: "center",
                marginTop: 4,
                textShadowColor: "rgba(0,0,0,0.25)",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              to Wearabouts
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="items-center w-full" style={{ gap: 12 }}>
          {/* My Closet */}
          <Link href="/closet" asChild>
            <Pressable
              className="w-full py-5 rounded-3xl items-center bg-pink-200 shadow-md"
              onPress={() => Haptics.selectionAsync()}
            >
              {({ pressed }) => (
                <Text
                  style={{
                    color: "#800000",
                    fontSize: 18,
                    fontWeight: "700",
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  }}
                >
                  ♡ My Closet
                </Text>
              )}
            </Pressable>
          </Link>

          {/* Create Outfit */}
          <Link href="./outfit-generation/generate" asChild>
            <Pressable
              className="w-full py-5 rounded-3xl items-center bg-pink-200 shadow-md"
              onPress={() => Haptics.selectionAsync()}
            >
              {({ pressed }) => (
                <Text
                  style={{
                    color: "#800000",
                    fontSize: 18,
                    fontWeight: "700",
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  }}
                >
                  ♡ Create outfit
                </Text>
              )}
            </Pressable>
          </Link>

          {/* Logout */}
          <Pressable
            onPress={async () => {
              await Haptics.selectionAsync();
              await supabase.auth.signOut();
              router.replace("/(auth)/logout");
            }}
            className="w-full py-5 rounded-3xl items-center bg-red-500 shadow-md"
          >
            {({ pressed }) => (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "700",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                }}
              >
                Logout
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
