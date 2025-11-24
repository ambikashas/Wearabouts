import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
import LoginScreen  from "./login";

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) return <></>;

  if (user) return <Redirect href="/" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}