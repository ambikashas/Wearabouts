import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "tailwindcss/colors";

export default function GradientBackground({ children }) {
  return (
    <ImageBackground
      source={require("@/assets/images/coquette wallpaper.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(250,147,194,0.5)", "rgba(255,255,255,0.9)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.background}
      >
        {children}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
