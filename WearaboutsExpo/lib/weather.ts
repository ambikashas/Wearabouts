import * as Location from "expo-location";
import { EXPO_PUBLIC_WEATHER_API_KEY } from "@env";

export async function getCurrentWeather() {
  try {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") throw new Error("Location permission not granted");

    // Get current coordinates
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Fetch weather from OpenWeatherMap
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${EXPO_PUBLIC_WEATHER_API_KEY}&units=metric`
    );

    if (!res.ok) throw new Error("Failed to fetch weather");

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Weather fetch failed", err);
    return null;
  }
}
