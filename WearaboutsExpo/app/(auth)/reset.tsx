import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function ResetScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setError("");
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "yourapp://login", // [FIX] research deep link setup for Expo
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("✅ Password reset email sent! Check your inbox.");
  }

  return (
    <View className="flex-1 bg-white px-8 justify-center">
      <Text className="text-4xl font-semibold text-[#35403A] mb-10 text-center">
        Reset your password
      </Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 p-4 rounded-2xl mb-4"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
      {message ? <Text className="text-green-600 mb-3">{message}</Text> : null}

      <Pressable
        onPress={handleReset}
        className="w-full bg-brandPink py-4 rounded-2xl items-center mb-4"
      >
        <Text className="text-lg text-white font-medium">
          {loading ? "Sending..." : "Send Reset Email"}
        </Text>
      </Pressable>

      <Link
        href="/(auth)/login"
        className="text-center text-brandPink mt-4"
      >
        Back to Login
      </Link>
    </View>
  );
}
