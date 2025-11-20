import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

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

  const handleForgotPassword = async () => {
    if (!email) return setError("Enter your email first");

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) setError(error.message);
    else setSuccess("Check your email to reset password");
  };

  return (
    <View className="flex-1 bg-white px-8 justify-center">
      <Text className="text-4xl font-semibold text-[#35403A] mb-10">
        Welcome back ♡
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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 p-4 rounded-2xl mb-4"
      />

      {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
      {success ? <Text className="text-green-500 mb-3">{success}</Text> : null}

      <Pressable
        onPress={handleLogin}
        className="w-full bg-brandPink py-4 rounded-2xl items-center mb-4"
      >
        <Text className="text-lg text-white font-medium">Login</Text>
      </Pressable>

      <Pressable onPress={handleForgotPassword} className="mb-4">
        <Text className="text-center text-blue-500">Forgot Password?</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/signup")}>
        <Text className="text-center text-blue-500">
          Don't have an account? Sign up
        </Text>
      </Pressable>
    </View>
  );
}
