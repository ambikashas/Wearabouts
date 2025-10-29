module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.js",
  ],
  moduleNameMapper: {
    "^@/components/themed-view$": "<rootDir>/_mocks_/themed-view.tsx",
    "^@/components/themed-text$": "<rootDir>/_mocks_/themed-text.tsx",
    "^@/(.*)$": "<rootDir>/$1",
  },
};
