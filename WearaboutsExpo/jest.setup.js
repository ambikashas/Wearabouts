// jest.setup.js

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

// ---- MOCK EXPO LOCATION ----
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194, // dummy coordinates
      },
    })
  ),
}));

// ---- MOCK EXPO LINEAR GRADIENT ----
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  return {
    LinearGradient: (props) => React.createElement("LinearGradient", props, props.children),
  };
});
