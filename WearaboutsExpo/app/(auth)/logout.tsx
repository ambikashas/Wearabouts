import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export default function LogoutScreen() {
  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
      router.replace("/(auth)/login");
    }
    signOut();
  }, []);

  return null; 
}
