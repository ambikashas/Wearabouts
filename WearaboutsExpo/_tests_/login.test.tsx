import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import LoginScreen from "@/app/(auth)/login";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { signInWithPassword: jest.fn() },
  },
}));

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}));

describe("LoginScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows error if login fails", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: { message: "Invalid credentials" } });
    render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "wrongpassword");
    fireEvent.press(screen.getByText("Login"));

    await waitFor(() => expect(screen.getByText("Invalid credentials")).toBeTruthy());

  });

  it("redirects on successful login", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ data: { session: { user: { id: "123" } } }, error: null });
    render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "password123");
    fireEvent.press(screen.getByText("Login"));

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/"));

  });
});
