import "react-native-gesture-handler/jestSetup";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}));

// Mock SafeAreaView and SafeAreaProvider to avoid native errors
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children }) => children,
    SafeAreaProvider: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
// Mock Expo Location (prevents native errors in tests)
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(async () => ({
    status: "granted",
  })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: { latitude: 0, longitude: 0 },
  })),
}));
