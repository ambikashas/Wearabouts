import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import { Text } from "react-native";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: "123" } } },
        error: null,
      }),
      onAuthStateChange: jest.fn().mockImplementation(() => {
        return {
          data: {
            subscription: {
              unsubscribe: jest.fn(),
            },
          },
        };
      }),
    },
  },
}));

const TestComponent = () => {
  const { user, session, loading } = useAuth();
  return (
    <>
      <Text testID="user">{user ? 'yes' : 'no'}</Text>
      <Text testID="session">{session ? 'yes' : 'no'}</Text>
      <Text testID="loading">{loading ? 'yes' : 'no'}</Text>
    </>
  );
};

it('provides user and session to children', async () => {
  const { getByTestId } = render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  await waitFor(() => {
    expect(getByTestId('loading').children[0]).toBe('no');
    expect(getByTestId('user').children[0]).toBe('yes');
    expect(getByTestId('session').children[0]).toBe('yes');
  });
});

describe("AuthProvider", () => {
  it("provides user and session to children", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId("loading").children[0]).toBe("no");
      expect(getByTestId("user").children[0]).toBe("yes");
      expect(getByTestId("session").children[0]).toBe("yes");
    });
  });
});
