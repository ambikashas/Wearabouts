import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import SignupScreen from "@/app/(auth)/signup";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { signUp: jest.fn() },
  },
}));

describe("SignupScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows success message on signup", async () => {
    supabase.auth.signUp.mockResolvedValue({ data: { user: { id: "123" } }, error: null });
    render(<SignupScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Email"), "newuser@example.com");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "password123");
    fireEvent.press(screen.getByText("Sign Up"));

    await waitFor(() => expect(screen.getByText(/Account created/i)).toBeTruthy());

  });

  it("shows error if signup fails", async () => {
    supabase.auth.signUp.mockResolvedValue({ data: null, error: { message: "Email exists" } });
    render(<SignupScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Email"), "existing@example.com");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "password123");
    fireEvent.press(screen.getByText("Sign Up"));

    await waitFor(() => expect(screen.getByText("Email exists")).toBeTruthy());

  });
});
