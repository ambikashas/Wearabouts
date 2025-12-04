import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { brandColors } from "@/constants/colors";
import colors from "tailwindcss/colors";

export default function GradientBackground({ children }) {
  return (
    <LinearGradient
      colors={["#fa93c2", colors.white]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
