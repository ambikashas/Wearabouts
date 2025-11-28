import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import { within } from "@testing-library/react-native";
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

  function getLoginButton() {
    return screen.getByTestId("login-button");
  }

  it("shows error if login fails", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials" },
    });

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText(/email/i), "test@example.com");
    fireEvent.changeText(screen.getByPlaceholderText(/password/i), "wrongpassword");

    fireEvent.press(getLoginButton());

    await waitFor(() =>
      expect(screen.getByText("Invalid credentials")).toBeTruthy()
    );
  });

  it("redirects on successful login", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: { user: { id: "123" } } },
      error: null,
    });

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText(/email/i), "test@example.com");
    fireEvent.changeText(screen.getByPlaceholderText(/password/i), "password123");

    fireEvent.press(getLoginButton());

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith("/")
    );
  });
});
