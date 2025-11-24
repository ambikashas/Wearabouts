import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

jest.mock("@/lib/supabase", () => ({
  supabase: { auth: { signOut: jest.fn() } },
}));

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}));

describe("Logout", () => {
  it("signs out and navigates to login", async () => {
  supabase.auth.signOut.mockResolvedValue({ error: null });

  const logoutHandler = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  await logoutHandler();
  expect(supabase.auth.signOut).toHaveBeenCalled();
  expect(router.replace).toHaveBeenCalledWith("/(auth)/login");

});
});
