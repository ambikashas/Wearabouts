import React, { useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

export default function WeatherNotification() {
  const [weatherType, setWeatherType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const handlePress = async () => {
    setLoading(true);

    // Ask for location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setWeatherType(null);
      setHasPermission(false);
      setLoading(false);
      return;
    }

    setHasPermission(true);

    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    try {
      // Load from env (SAFE)
      const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.weather && data.weather[0]) {
        setWeatherType(data.weather[0].main);
      } else {
        setWeatherType("Unknown");
      }
    } catch (err) {
      console.log("Weather fetch failed", err);
      setWeatherType("Unknown");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFE4E1",
        padding: 10,
        margin: 10,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Image
        source={require("@/assets/images/anne_hathaway.png")}
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
      />

      <Text style={{ fontSize: 16, fontWeight: "600", flexShrink: 1 }}>
        {loading
          ? "Loading..."
          : hasPermission
          ? weatherType
            ? `Hey, watch out for ${weatherType} today!`
            : "Weather unknown"
          : "Enable location, click here"}
      </Text>
    </Pressable>
  );
}
