import { brandColors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput } from "react-native";
import colors from "tailwindcss/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setError(error.message);

    if (data.session) {
      router.replace("/"); 
    }
  };

  return (
    <LinearGradient
      colors={[brandColors.brandPink, colors.white]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text className="text-5xl font-extrabold mb-2 text-pink-400 tracking-tight text-center">
            WearAbouts
          </Text>
          <Text className="text-lg text-gray-700 italic mb-10 text-center">
            “Fashion is not about utility.” — M.P.
          </Text>
        {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#B06F79"
            value={email}
            onChangeText={setEmail}
            className="border border-pink-300 p-4 rounded-2xl mb-4 bg-pink-50"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        {/* Password */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#B06F79"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="border border-pink-300 p-4 rounded-2xl mb-4 bg-pink-50"
          />

          {/* Error */}
          {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}

          {/* Login Button */}
          <Pressable
            testID="login-button"
            onPress={handleLogin}
            className="w-full py-4 rounded-2xl items-center justify-center mb-4 bg-pink-200 shadow-lg"
          >
            <Text className="text-lg text-red-700 font-semibold tracking-wide">
              Log In
            </Text>
          </Pressable>
        {/* Signup Link */}
          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-center text-red-500 font-medium">
              Don’t have an account? <Text className="font-bold">Sign up</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
