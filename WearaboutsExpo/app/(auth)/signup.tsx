import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup() {
    setError("");
    setSuccess("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return setError(error.message);

    setSuccess("Account created! Please head to the login screen to sign in.");
  }

  return (
    <View className="flex-1 bg-white px-8 justify-center">
      <Text className="text-4xl font-semibold text-[#35403A] mb-10">
        Create your account ♡
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 p-4 rounded-2xl mb-4"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 p-4 rounded-2xl mb-4"
      />

      {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
      {success ? <Text className="text-green-500 mb-3">{success}</Text> : null}

      <Pressable
        onPress={handleSignup}
        className="w-full bg-brandPink py-4 rounded-2xl items-center mb-4"
      >
        <Text className="text-lg text-white font-medium">Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text className="text-center text-blue-500">
          Already have an account? Log in
        </Text>
      </Pressable>
    </View>
  );
}
