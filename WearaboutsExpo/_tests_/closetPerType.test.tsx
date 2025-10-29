import ItemsPerType from "@/app/(tabs)/closet/type";
import { mockOutfits } from "@/mock-data/items";
import { allOutfitItemTypes } from "@/types/outfit";
import { render, screen } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

// Mock router + params
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

// Mock Dropdown
jest.mock("react-native-element-dropdown", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Dropdown: ({ value }: any) => {
      const displayValue = value.charAt(0).toUpperCase() + value.slice(1) + "s";
      return <Text>{displayValue}</Text>;
    },
  };
});

// Safe mock for ListVerticalScrollDisplay
jest.mock("@/components/ImageListVerticalScrollDisplay", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ data }: any) => <Text>List({data.length} items)</Text>,
  };
});

describe("ItemsPerType", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Component renders without crashing
  it("renders without crashing", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ type: "top" });
    const { toJSON } = render(<ItemsPerType />);
    expect(toJSON()).toBeTruthy();
  });

  // Test 2: Dropdown and list render correctly for all types
  allOutfitItemTypes.forEach((type) => {
    it(`renders correctly for type "${type}"`, () => {
      // Mock the selected type from search params
      (useLocalSearchParams as jest.Mock).mockReturnValue({ type });
      render(<ItemsPerType />);

      // Check the dropdown shows correct label
      const expectedLabel = type.charAt(0).toUpperCase() + type.slice(1) + "s";
      expect(screen.getByText(expectedLabel)).toBeTruthy();

      // Check the list shows correct number of items
      const expectedItems = mockOutfits.filter((o) => o.type === type);
      expect(
        screen.getByText(`List(${expectedItems.length} items)`)
      ).toBeTruthy();
    });
  });

  // Test 3: Renders empty list if no items exist for the selected type
  it("renders no items if there are no outfits for the selected type", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      type: "nonexistent",
    });
    render(<ItemsPerType />);
    expect(screen.getByText("List(0 items)")).toBeTruthy();
  });
});
